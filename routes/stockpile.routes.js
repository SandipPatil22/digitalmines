import { Router } from "express";
import {
  completeTripOne,
  createStockpille,
  deleteStockpile,
  getAllStockpileDumpersTripList,
  getisWeightDoneTripsByDate,
  getStockpile,
  getTripDataByDumperId,
} from "../controllers/stockpile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkAuth } from "../middlewares/supervisorAuth.middleware.js";
const router = Router();

router.route("/create-stockpile").post(verifyJWT, createStockpille);
router.route("/get-stockpile").get(verifyJWT, getStockpile);
router.route("/delete-stockpile/:id").patch(deleteStockpile);

router
  .route("/get-stockpile-dumpers-trips")
  .get(getAllStockpileDumpersTripList);

router.route("/getTripDataByDumperId").post(getTripDataByDumperId);

router.route("/complete-trip-one").patch(completeTripOne);

router.route("/get-WeightDone-tripdata-byDay").get(checkAuth,getisWeightDoneTripsByDate)

export default router;
