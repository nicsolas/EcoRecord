import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Support both /api and root mounting for Vercel compatibility
app.use("/api", router);
app.use("/", router);

// Health check outside the router just in case
app.get("/health-raw", (req: any, res: any) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.get("/db-test", async (req: any, res: any) => {
  try {
    const { getDb } = await import("@workspace/db");
    const db = await getDb();
    // Use a raw query to bypass schema issues for now
    const { sql } = await import("drizzle-orm");
    await db.execute(sql`SELECT 1`);
    res.json({ status: "ok", message: "Database connection successful" });
  } catch (err: any) {
    res.status(500).json({ 
      status: "error", 
      message: "Database connection failed", 
      details: err?.message,
      db_url_present: !!process.env.DATABASE_URL
    });
  }
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  logger.error({ err, url: req.url, method: req.method }, "Unhandled API Error");
  res.status(500).json({ 
    error: "Internal Server Error", 
    message: err?.message || "An unexpected error occurred",
    path: req.url
  });
});

export default app;

