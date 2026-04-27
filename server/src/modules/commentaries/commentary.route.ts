import { Router } from "express";
import { commentaryController } from "./commentary.controller";

const router = Router();

router.post("/", commentaryController.create);

router.get("/match/:matchId", commentaryController.getForMatch);

export default router;
