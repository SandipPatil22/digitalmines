import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createMine,
  deleteMine,
  getMines,
  updateMine,
} from "../controllers/mine.controller.js";

const router = Router();

router.route("/create-mine").post(createMine);

router.route("/get-mines").get(verifyJWT, getMines);

router.route("/delete-mine/:mineId").patch(verifyJWT, deleteMine);

router.route("/update-mine/:mineId").patch(verifyJWT, updateMine);

export default router;
