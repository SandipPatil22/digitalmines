import { Router } from "express";
import {
  addWeighbridgeData,
  createWeighbridge,
  deleteWeighbridge,
  getAllDumpersList,
  getTripDataByDumperId,
  getTripsByDayBySupervisorId,
} from "../controllers/weighbridge.controller.js";
import { checkAuth } from "../middlewares/supervisorAuth.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/createWeighbridge").post(verifyJWT,createWeighbridge);

router.route("/getTripDataByDumperId").post(getTripDataByDumperId);

router.route("/addWeighbridgeData").post(checkAuth, addWeighbridgeData);

router.route("/getAllDumpersList").get(getAllDumpersList);

// router.route('/updateWeighbridgeDataInTrip').patch(checkAuth, updateWeighbridgeDataInTrip)

router.route("/delete-weighbridge/:id").patch(deleteWeighbridge);

router
  .route("/getTripBySupervisor")
  .get(checkAuth, getTripsByDayBySupervisorId);

export default router;
