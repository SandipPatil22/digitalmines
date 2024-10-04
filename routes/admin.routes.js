import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { adminDashboard } from "../controllers/adminDashboard.controller.js";
const router = Router();

router.route("/getAdminDashboard").get(verifyJWT, adminDashboard);
export default router;
