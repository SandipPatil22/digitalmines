
import { Router } from "express";
import {
  createMines,
  deleteMine,
  getMines,
  updateMine,
} from "../controllers/mines.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/create-mine").post(createMines);

router.route("/get-mines").get(verifyJWT,getMines);

router.route("/delete-mine/:mineId").patch(verifyJWT,deleteMine);

router.route("/update-mine/:mineId").post(verifyJWT,updateMine);

export default router;
