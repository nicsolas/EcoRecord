import { Router } from "express";
import healthRouter from "./health";
import scoresRouter from "./scores";
import gameRouter from "./game";

const router = Router();

// Diagnostics routes
router.get("/health-raw", (req: any, res: any) => res.json({ status: "ok", timestamp: new Date().toISOString() }));
router.get("/db-test", async (req: any, res: any) => {
  try {
    const { getDb } = await import("@workspace/db");
    const db = await getDb();
    const { sql } = await import("drizzle-orm");
    await (db as any).execute(sql`SELECT 1`);
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

router.use(healthRouter);
router.use(scoresRouter);
router.use(gameRouter);

export default router;
