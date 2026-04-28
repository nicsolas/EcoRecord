import { Router } from "express";
import { getDb, sql } from "@workspace/db";

const router = Router();

router.get("/healthz", async (_req: any, res: any) => {
  try {
    // Quick DB connectivity check
    const db = await getDb();
    await db.execute(sql`SELECT 1`);
    res.json({ status: "ok", db: "connected" });
  } catch (err: any) {
    console.error("[health] DB connection error:", err);
    res.status(503).json({
      status: "error",
      db: "disconnected",
      error: err?.message ?? String(err),
    });
  }
});

export default router;
