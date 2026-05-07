import { Router } from "express";
import { matchController } from "./match.controller";

const router = Router();

router.post("/", matchController.create);
router.get("/", matchController.find);
router.get("/:matchId", matchController.findOne);
router.patch("/score", matchController.updateScore);

export default router;
