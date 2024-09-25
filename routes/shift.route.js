import { Router } from "express";
import {
  endShift,
  getShiftData,
  getShiftPreData,
  startShift,
  updateShift,
} from "../controllers/shift.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkAuth } from "../middlewares/supervisorAuth.middleware.js";
const router = Router();

router.route("/start-shift").post(checkAuth, startShift);

router.route("/update-shift").patch(checkAuth, updateShift);

router.route("/get-shift-data").post(checkAuth, getShiftData);

router.route("/end-shift").patch(checkAuth, endShift);

router.route("/get-shift-predata").get(checkAuth, getShiftPreData);

export default router;
