import { Router } from "express";
import { fieldsupload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkAuth } from "../middlewares/supervisorAuth.middleware.js";

import {
  createSupervisor,
  deleteSupervisor,
  getMaterialSupervisorDashboard,
  getMaterialSupervisorReport,
  getStockpileDashboardReport,
  getStockpileSupervisorDashboard,
  getSupervisor,
  getUserProfile,
  getWeighbridgeDashboard,
  getWeighbridgeDashboardReport,
  loginSupervisor,
  logoutSupervisor,
  updateSupervisor,
} from "../controllers/supervisor.controller.js";

const router = Router();

// router.route("/register-supervisor").post(
//   upload.fields([
//     {
//       name: "profilePic",
//       maxCount: 1,
//     },
//   ]),
//   createSupervisor
// );

router
  .route("/register-supervisor")
  .post(fieldsupload, verifyJWT, createSupervisor);

router.route("/login-supervisor").post(loginSupervisor);

router.route("/logout-supervisor").patch(logoutSupervisor);

router.route("/getUserProfile").post(getUserProfile); // mobile route

router.route("/get-supervisor").get(verifyJWT, getSupervisor);

router.route("/delete-supervisor/:supervisorId").patch(deleteSupervisor);

router.route("/update-supervisor/:id").patch(verifyJWT, updateSupervisor);

router
  .route("/get-material-supervisor-dashboard")
  .get(checkAuth, getMaterialSupervisorDashboard);

router
  .route("/downloadMaterialSupervisorReport")
  .get(checkAuth, getMaterialSupervisorReport);
router
  .route("/get-stockpile-supervisor-dashboard")
  .get(checkAuth, getStockpileSupervisorDashboard);
router
  .route("/get-weighbridge-supervisor-dashboard")
  .get(checkAuth, getWeighbridgeDashboard);
router
  .route("/downloadWrighbridgeSupervisorReport")
  .get(checkAuth, getWeighbridgeDashboardReport);
router
  .route("/downloadStockpileSupervisorReport")
  .get(checkAuth, getStockpileDashboardReport);

export default router;
