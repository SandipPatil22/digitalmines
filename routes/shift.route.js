import { Router } from "express";
import {
    endshift,
  getPreShiftData,
  startShift,
  updateShift,
} from "../controllers/shift.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkAuth } from "../middlewares/supervisorAuth.middleware.js";
const router = Router();

router.route("/start-shift").post(checkAuth, startShift);

router.route("/update-shift").patch(checkAuth, updateShift);

router.route("/getShift").get(getPreShiftData);

router.route("/end-shift").patch(checkAuth,endshift);

router.route('/get-shift-predata').get(checkAuth, getPreShiftData)

export default router;
