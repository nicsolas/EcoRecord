import { Router } from "express";

const router = Router();

router.get("/game/config", (_req, res) => {
  res.json({
    countdownDeadline: "2026-05-20T23:59:59.000Z",
    timePerItem: 10,
    pointsPerCorrectAnswer: 10,
  });
});

export default router;
