import { Router } from "express";
import crypto from "crypto";
import { getDb, usersTable, gamesTable, scoresTable, eq, desc, sql } from "../_db/index.js";

const router = Router();

function isValidSubmitBody(body: unknown): body is { username: string; email: string; gameName: string; score: number } {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.username === "string" && b.username.length > 0 &&
    typeof b.email === "string" && b.email.length > 0 &&
    typeof b.gameName === "string" && b.gameName.length > 0 &&
    typeof b.score === "number" && Number.isInteger(b.score) && b.score >= 0
  );
}

router.get("/scores", async (req: any, res: any) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    const db = await getDb();
    const rows = await db
      .select({
        id: usersTable.id,
        score: sql<number>`MAX(${scoresTable.score})`,
        username: usersTable.username,
        email: usersTable.email,
        gameName: gamesTable.name,
        createdAt: sql<string>`MAX(${scoresTable.createdAt})`,
      })
      .from(scoresTable)
      .innerJoin(usersTable, eq(scoresTable.userId, usersTable.id))
      .innerJoin(gamesTable, eq(scoresTable.gameId, gamesTable.id))
      .groupBy(usersTable.id, usersTable.username, usersTable.email, gamesTable.id, gamesTable.name)
      .orderBy(desc(sql`MAX(${scoresTable.score})`))
      .limit(limit);

    const withRank = rows.map((row, index) => ({
      ...row,
      rank: index + 1,
    }));

    res.json(withRank);
  } catch (err: any) {
    console.error("[scores GET /scores] DB error:", err);
    res.status(500).json({ error: "Database error", details: err?.message ?? String(err) });
  }
});

router.get("/scores/player", async (req: any, res: any) => {
  try {
    const email = String(req.query.email || "");

    if (!email) {
      res.status(400).json({ error: "email is required" });
      return;
    }

    const db = await getDb();
    const rows = await db
      .select({
        id: scoresTable.id,
        score: scoresTable.score,
        username: usersTable.username,
        email: usersTable.email,
        gameName: gamesTable.name,
        createdAt: scoresTable.createdAt,
      })
      .from(scoresTable)
      .innerJoin(usersTable, eq(scoresTable.userId, usersTable.id))
      .innerJoin(gamesTable, eq(scoresTable.gameId, gamesTable.id))
      .where(eq(sql`lower(${usersTable.email})`, email.toLowerCase()))
      .orderBy(desc(scoresTable.score))
      .limit(1);

    if (rows.length === 0) {
      res.status(404).json({ error: "Player not found" });
      return;
    }

    const allRows = await db
      .select({ score: sql<number>`MAX(${scoresTable.score})` })
      .from(scoresTable)
      .groupBy(scoresTable.userId)
      .orderBy(desc(sql`MAX(${scoresTable.score})`));

    const rank = allRows.findIndex((r) => r.score === rows[0].score) + 1;
    res.json({ ...rows[0], rank });
  } catch (err: any) {
    console.error("[scores GET /scores/player] DB error:", err);
    res.status(500).json({ error: "Database error", details: err?.message ?? String(err) });
  }
});

router.post("/scores", async (req: any, res: any) => {
  if (!isValidSubmitBody(req.body)) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const { username, email, gameName, score } = req.body;
    console.log(`[scores POST /scores] Received submission: ${username} (${email}), score: ${score}, game: ${gameName}`);

    // Check for banned words
    const { isBanned } = await import("../_lib/banned-words.js");
    if (isBanned(username)) {
      console.warn(`[scores POST /scores] Rejected banned username: ${username}`);
      res.status(400).json({ error: "Username non appropriato" });
      return;
    }

    // Upsert user
    const db = await getDb();
    const users = await db.select().from(usersTable).where(eq(sql`lower(${usersTable.email})`, email.toLowerCase())).limit(1);
    let userId;
    if (users.length > 0) {
      userId = users[0].id;
      // Update username if changed
      if (users[0].username !== username) {
        await db.update(usersTable).set({ username }).where(eq(usersTable.id, userId));
      }
    } else {
      const id = crypto.randomUUID();
      console.log(`[scores POST /scores] Creating user with ID: ${id}`);
      const inserted = await db.insert(usersTable).values({ id, username, email }).returning();
      userId = inserted[0].id;
    }

    // Upsert game
    console.log(`[scores POST /scores] Checking game: ${gameName}`);
    const games = await db.select().from(gamesTable).where(eq(sql`lower(${gamesTable.name})`, gameName.toLowerCase())).limit(1);
    let gameId;
    if (games.length > 0) {
      gameId = games[0].id;
    } else {
      const id = crypto.randomUUID();
      console.log(`[scores POST /scores] Creating game with ID: ${id}`);
      const inserted = await db.insert(gamesTable).values({ id, name: gameName }).returning();
      gameId = inserted[0].id;
    }

    // Insert score
    const scoreId = crypto.randomUUID();
    console.log(`[scores POST /scores] Inserting score with ID: ${scoreId}`);
    const insertedScore = await db.insert(scoresTable).values({
      id: scoreId,
      userId,
      gameId,
      score,
    }).returning();

    const result = {
      id: insertedScore[0].id,
      score: insertedScore[0].score,
      username,
      email,
      gameName,
      createdAt: insertedScore[0].createdAt,
    };

    const allRows = await db
      .select({ score: sql<number>`MAX(${scoresTable.score})` })
      .from(scoresTable)
      .groupBy(scoresTable.userId)
      .orderBy(desc(sql`MAX(${scoresTable.score})`));

    const rank = allRows.findIndex((r) => r.score === result.score) + 1;
    res.json({ ...result, rank });
  } catch (err: any) {
    console.error("[scores POST /scores] DB error:", err);
    res.status(500).json({ 
      error: "Database error", 
      details: err?.message ?? String(err),
      stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined,
      db_url_detected: !!process.env.DATABASE_URL
    });
  }
});

export default router;
