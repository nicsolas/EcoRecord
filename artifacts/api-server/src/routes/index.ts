import { Router, type IRouter } from "express";
import healthRouter from "./health";
import scoresRouter from "./scores";
import gameRouter from "./game";

const router: IRouter = Router();

router.use(healthRouter);
router.use(scoresRouter);
router.use(gameRouter);

export default router;
