import { Router, type Request, type Response } from "express";
import { getDb, usersTable, gamesTable, scoresTable, eq, desc, sql } from "@workspace/db";

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

router.get("/scores", async (req: Request, res: Response) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  // Group by user and game to get max score
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
});

router.get("/scores/player", async (req: Request, res: Response) => {
  const email = String(req.query.email || "");

  if (!email) {
    res.status(400).json({ error: "email is required" });
    return;
  }

  // Find the highest score for this user
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

  // Calculate rank (this is a simplified rank calculation)
  const allRows = await db
    .select({ score: sql<number>`MAX(${scoresTable.score})` })
    .from(scoresTable)
    .groupBy(scoresTable.userId)
    .orderBy(desc(sql`MAX(${scoresTable.score})`));

  const rank = allRows.findIndex((r) => r.score === rows[0].score) + 1;
  res.json({ ...rows[0], rank });
});

router.post("/scores", async (req: Request, res: Response) => {
  if (!isValidSubmitBody(req.body)) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { username, email, gameName, score } = req.body;

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
    const inserted = await db.insert(usersTable).values({ username, email }).returning();
    userId = inserted[0].id;
  }

  // Upsert game
  const games = await db.select().from(gamesTable).where(eq(sql`lower(${gamesTable.name})`, gameName.toLowerCase())).limit(1);
  let gameId;
  if (games.length > 0) {
    gameId = games[0].id;
  } else {
    const inserted = await db.insert(gamesTable).values({ name: gameName }).returning();
    gameId = inserted[0].id;
  }

  // Insert score
  const insertedScore = await db.insert(scoresTable).values({
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
});

export default router;
