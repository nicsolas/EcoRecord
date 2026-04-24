import * as schema from "./schema";

// Use Neon serverless when DATABASE_URL is available (production/staging),
// otherwise fall back to local PGlite for offline development.
async function createDb() {
  if (process.env.DATABASE_URL) {
    const { neon } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-http");
    const sql = neon(process.env.DATABASE_URL);
    return drizzle(sql, { schema });
  }

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
