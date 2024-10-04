import { Router } from "express";
import { checkAuth } from "../middlewares/supervisorAuth.middleware.js";
import {
  createTriptwo,
  deleteTripTwo,
  endTripTwo,
  getCompletedTripByDate,
  getPreFeedingData,
  getTripsTwoByDate,
  // updateDestinationIdForTripTwo,
} from "../controllers/triptwo.controller.js";

const router = Router();

router.route("/start-loading-tripTwo").post(checkAuth, createTriptwo);

router.route("/get-tripTwo-by-date").get(checkAuth,getTripsTwoByDate);

router.route("/get-completed-tripTwo-by-date").get(checkAuth,getCompletedTripByDate);

router.route("/end-tripTwo-loading/:id").patch(endTripTwo);

// router.route("/create-tripTwo/:id").patch(updateDestinationIdForTripTwo);

router.route("/delete-tripTwo/:tripId").patch(deleteTripTwo);

router.route("/get-preFeeding-data").get(getPreFeedingData);

export default router;
