import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/game/config", (_req, res) => {
  res.json({
    countdownDeadline: "2026-05-20T23:59:59.000Z",
    timePerItem: 10,
    pointsPerCorrectAnswer: 10,
  });
});

export default router;
