import { Router } from "express";

import { checkAuth } from "../middlewares/supervisorAuth.middleware.js";
import {
  endweighbridgeShift,
  getWeighbridgeShiftData,
  getweighbridgeShiftPreData,
  startweighbridgeShift,
  updateWeighbridgeShift,
} from "../controllers/weighbridgeShift.controller.js";

const router = Router();

router
  .route("/get-weighbridgeshift-predata")
  .get(checkAuth, getweighbridgeShiftPreData);

router.route("/start-weighbridgeshift").post(checkAuth, startweighbridgeShift);

router
  .route("/update-weighbridgeshift")
  .patch(checkAuth, updateWeighbridgeShift);

router.route("/end-weighbridgeshift").patch(checkAuth, endweighbridgeShift);

router
  .route("/get-weighbridgeshift-data")
  .get(checkAuth, getWeighbridgeShiftData);

export default router;
