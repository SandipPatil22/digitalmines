import { Router } from "express";
import {
  createPit,
  deletePit,
  getAllTaskPreData,
  getPits,
  getPitsByCorporation,
  updatePit,
} from "../controllers/pit.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkAuth } from "../middlewares/supervisorAuth.middleware.js";

const router = Router();

router.route("/create-pit").post(verifyJWT, createPit);

router.route("/get-pits/:mineId").get(verifyJWT, getPits);

router.route("/get-pits-by-corporation").get(verifyJWT, getPitsByCorporation);

router.route("/delete-pit/:pitId").patch(verifyJWT, deletePit);

router.route("/update-pit/:pitId").post(verifyJWT, updatePit);

router.route("/get-pretask-data").get(checkAuth, getAllTaskPreData);

export default router;
