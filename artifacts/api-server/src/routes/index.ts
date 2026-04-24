import { Router } from "express";
import healthRouter from "./health";
import scoresRouter from "./scores";
import gameRouter from "./game";

const router = Router();

router.use(healthRouter);
router.use(scoresRouter);
router.use(gameRouter);

export default router;
