import { defineConfig } from "drizzle-kit";

// Production: Neon serverless
if (process.env.DATABASE_URL) {
  module.exports = defineConfig({
    schema: "./src/schema/index.ts",
    dialect: "postgresql",
    dbCredentials: {
      url: process.env.DATABASE_URL,
    },
  });
} else {
  // Local dev fallback: PGLite
  module.exports = defineConfig({
    schema: "./src/schema/index.ts",
    dialect: "postgresql",
    driver: "pglite",
    dbCredentials: {
      url: "./pglite-db",
    },
  });
}

