import { defineConfig } from "drizzle-kit";

// Use DATABASE_URL_UNPOOLED for migrations (direct connection, not pooler)
// Fall back to DATABASE_URL if unpooled isn't available
const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

export default url
  ? defineConfig({
      schema: "./src/schema/index.ts",
      dialect: "postgresql",
      dbCredentials: {
        url,
      },
    })
  : defineConfig({
      schema: "./src/schema/index.ts",
      dialect: "postgresql",
      driver: "pglite",
      dbCredentials: {
        url: "./pglite-db",
      },
    });
