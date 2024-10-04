import { Router } from "express";

import { checkAuth } from "../middlewares/supervisorAuth.middleware.js";
import {
  endShift,
  getShiftData,
  getShiftPreData,
  startShift,
  updateShift,
} from "../controllers/shift.controller.js";

const router = Router();

router.route("/get-shift-predata").get(checkAuth, getShiftPreData);

router.route("/start-shift").post(checkAuth, startShift);

router.route("/update-shift").patch(checkAuth, updateShift);

router.route("/end-shift").patch(checkAuth, endShift);

router.route("/get-shift-data").post(checkAuth, getShiftData);

export default router;
