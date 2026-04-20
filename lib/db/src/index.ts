import { drizzle } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import * as schema from "./schema";
import path from "path";
import url from "url";

// Get the absolute path to lib/db/pglite-db
const currentDir = path.dirname(url.fileURLToPath(import.meta.url));
const isBundled = currentDir.includes("api-server");
const dbPath = isBundled
  ? path.resolve(currentDir, "..", "..", "..", "lib", "db", "pglite-db")
  : path.resolve(currentDir, "..", "pglite-db");

// Store the database locally in a directory
const client = new PGlite(dbPath);

export const db = drizzle(client, { schema });

export * from "./schema";
