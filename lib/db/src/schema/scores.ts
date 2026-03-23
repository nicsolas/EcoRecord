import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const scoresTable = pgTable("scores", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  totalScore: integer("total_score").notNull().default(0),
  gamesPlayed: integer("games_played").notNull().default(0),
  bestScore: integer("best_score").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertScoreSchema = createInsertSchema(scoresTable).omit({
  id: true,
  updatedAt: true,
});

export type InsertScore = z.infer<typeof insertScoreSchema>;
export type Score = typeof scoresTable.$inferSelect;
