import { Router } from "express";
import {
  createPit,
  deletePit,
  getPits,
  getAllTaskPreData,
  getPitsByCorporation,
  updatePit,
} from "../controllers/pit.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-pit").post(verifyJWT, createPit);

router.route("/get-pits/:mineId").get(verifyJWT, getPits);

router.route("/get-pits-by-corporation").get(verifyJWT, getPitsByCorporation);

router.route("/delete-pit/:pitId").patch(verifyJWT, deletePit);

router.route("/update-pit/:pitId").patch(verifyJWT, updatePit);

router.route("/get-pretask-data").get(getAllTaskPreData);

export default router;
