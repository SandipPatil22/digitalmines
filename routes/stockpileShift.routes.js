import { Router } from "express";

import { checkAuth } from "../middlewares/supervisorAuth.middleware.js";
import {
  endStockpileShift,
  getStockpileShiftData,
  getStockpileShiftPreData,
  startStockpileShift,
  updateStockpileShift,
} from "../controllers/stockpileShift.controller.js";

const router = Router();

router
  .route("/get-stockpileshift-predata")
  .get(checkAuth, getStockpileShiftPreData);

router.route("/start-stockpileshift").post(checkAuth, startStockpileShift);

router.route("/update-stockpileshift").patch(checkAuth, updateStockpileShift);

router.route("/end-stockpileshift").patch(checkAuth, endStockpileShift);

router.route("/get-Stockpileshift-data").get(checkAuth, getStockpileShiftData);

export default router;
