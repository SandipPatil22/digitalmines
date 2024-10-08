import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTarget,
  getAdminPanelDashboard,
  getTarget,
  updateTarget,
} from "../controllers/target.controller.js";

const router = Router();

router.route("/create-target").post(verifyJWT, createTarget);
router.route("/getAdminPanelDashboard").get(verifyJWT, getAdminPanelDashboard);

router.route("/getTarget").get(verifyJWT, getTarget);

router.route('/updatetarget/:id').patch(verifyJWT, updateTarget)



export default router;
