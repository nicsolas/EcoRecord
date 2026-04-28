import * as schema from "./schema/index.js";

/**
 * Clean the connection URL to remove parameters incompatible with the Neon HTTP driver
 */
function cleanConnectionUrl(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.delete("sslmode");
    u.searchParams.delete("channel_binding");
    return u.toString();
  } catch {
    // Fallback: manually strip if URL parsing fails
    return url.replace(/(\?|&)(channel_binding|sslmode)=[^&]+/g, "");
  }
}

// Use Neon serverless when DATABASE_URL is available (production/staging),
// otherwise fall back to local PGlite for offline development.
async function createDb() {
  // Prioritise the unpooled URL for HTTP connections as recommended by Neon
  const rawUrl = process.env.DATABASE_URL_UNPOOLED || 
                 process.env.DATABASE_URL || 
                 process.env.POSTGRES_URL;

  if (rawUrl) {
    const { neon } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-http");
    const cleanUrl = cleanConnectionUrl(rawUrl);
    const isUnpooled = rawUrl === process.env.DATABASE_URL_UNPOOLED;
    
    console.log(`[db] Connecting to Neon (HTTP)${isUnpooled ? " using unpooled URL" : ""}…`, cleanUrl.replace(/:[^@]+@/, ":***@"));
    
    const sql = neon(cleanUrl);
    
    // Connectivity test - only in development to reduce cold-start latency in prod
    if (process.env.NODE_ENV === "development" && !process.env.VERCEL) {
      try {
        await sql`SELECT 1`;
        console.log("[db] Neon connection verified.");
      } catch (err: any) {
        console.error("[db] Neon connection test failed:", err.message);
      }
    }

    return drizzle(sql, { schema });
  }

  console.log("[db] No DATABASE_URL found, falling back to local PGlite.");

  // Local dev fallback: PGlite (no DATABASE_URL needed)
  if (process.env.VERCEL) {
    throw new Error("DATABASE_URL environment variable is missing on Vercel!");
  }
  const path = await import("path");
  const fs = await import("fs");
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  
  let currentDir = process.cwd();
  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, "pnpm-workspace.yaml"))) {
      break;
    }
    currentDir = path.dirname(currentDir);
  }
  
  const dbPath = path.resolve(currentDir, "lib", "db", "pglite-db");
  const client = new PGlite(dbPath);
  return drizzle(client, { schema });
}

// Singleton promise so the DB is only initialised once per process/request
let _dbPromise: ReturnType<typeof createDb> | null = null;

function getDb() {
  if (!_dbPromise) _dbPromise = createDb();
  return _dbPromise;
}

export { getDb };

export * from "./schema";
export { sql, eq, desc } from "drizzle-orm";
