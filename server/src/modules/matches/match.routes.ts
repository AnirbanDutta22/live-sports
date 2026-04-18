import { Router } from "express";
import { matchController } from "./match.controller";

const router = Router();

router.post("/", matchController.create);
router.get("/", matchController.find);

export default router;
