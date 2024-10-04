import { Router } from "express";
import {
  deleteTripThree,
  getPretripThreeData,
  getTripThreeData,
  updateTripthree,
} from "../controllers/TripThree.controller.js";
import { checkAuth } from "../middlewares/supervisorAuth.middleware.js";

const router = Router();

router.route("/getTripThreeData").get(checkAuth,getTripThreeData);

router.route("/updateTripThree/:id").put(checkAuth,updateTripthree);

router.route("/deleteTripThree/:id").patch(deleteTripThree);

router.route("/tripThreePreData").get(getPretripThreeData);

export default router;
