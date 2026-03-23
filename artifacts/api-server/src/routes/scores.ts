import { Router, type IRouter } from "express";
import { db, scoresTable } from "@workspace/db";
import { eq, and, desc, sql } from "drizzle-orm";

const router: IRouter = Router();

function isValidSubmitBody(body: unknown): body is { firstName: string; lastName: string; score: number } {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.firstName === "string" && b.firstName.length > 0 &&
    typeof b.lastName === "string" && b.lastName.length > 0 &&
    typeof b.score === "number" && Number.isInteger(b.score) && b.score >= 0
  );
}

router.get("/scores", async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const rows = await db
    .select()
    .from(scoresTable)
    .orderBy(desc(scoresTable.bestScore))
    .limit(limit);

  const withRank = rows.map((row, index) => ({
    ...row,
    rank: index + 1,
  }));

  res.json(withRank);
});

router.get("/scores/player", async (req, res) => {
  const firstName = String(req.query.firstName || "");
  const lastName = String(req.query.lastName || "");

  if (!firstName || !lastName) {
    res.status(400).json({ error: "firstName and lastName are required" });
    return;
  }

  const rows = await db
    .select()
    .from(scoresTable)
    .where(
      and(
        eq(sql`lower(${scoresTable.firstName})`, firstName.toLowerCase()),
        eq(sql`lower(${scoresTable.lastName})`, lastName.toLowerCase())
      )
    )
    .limit(1);

  if (rows.length === 0) {
    res.status(404).json({ error: "Player not found" });
    return;
  }

  const allRows = await db
    .select()
    .from(scoresTable)
    .orderBy(desc(scoresTable.bestScore));

  const rank = allRows.findIndex((r) => r.id === rows[0].id) + 1;
  res.json({ ...rows[0], rank });
});

router.post("/scores", async (req, res) => {
  if (!isValidSubmitBody(req.body)) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { firstName, lastName, score } = req.body;

  const existing = await db
    .select()
    .from(scoresTable)
    .where(
      and(
        eq(sql`lower(${scoresTable.firstName})`, firstName.toLowerCase()),
        eq(sql`lower(${scoresTable.lastName})`, lastName.toLowerCase())
      )
    )
    .limit(1);

  let result;

  if (existing.length > 0) {
    const current = existing[0];
    const newBest = Math.max(current.bestScore, score);
    const newTotal = current.totalScore + score;
    const newGames = current.gamesPlayed + 1;

    const updated = await db
      .update(scoresTable)
      .set({
        totalScore: newTotal,
        bestScore: newBest,
        gamesPlayed: newGames,
        updatedAt: new Date(),
      })
      .where(eq(scoresTable.id, current.id))
      .returning();

    result = updated[0];
  } else {
    const inserted = await db
      .insert(scoresTable)
      .values({
        firstName,
        lastName,
        totalScore: score,
        bestScore: score,
        gamesPlayed: 1,
      })
      .returning();

    result = inserted[0];
  }

  const allRows = await db
    .select()
    .from(scoresTable)
    .orderBy(desc(scoresTable.bestScore));

  const rank = allRows.findIndex((r) => r.id === result.id) + 1;
  res.json({ ...result, rank });
});

export default router;
