import { Router } from "express";
import {
  createTrip,
  deleteTrip,
  getTripByDate,
  updateDestinationForTrip,
  updateTrip,
} from "../controllers/trips.controller";

const router = Router();
import { checkAuth } from "../middlewares/supervisorAuth.middleware.js";

router.route("/start-loading").post(checkAuth, createTrip);

router.route("/get-trips-by-date").get(checkAuth, getTripByDate);

router.route("/end-loading/:id").patch(checkAuth, updateTrip);

router.route("/create-trip/:id").patch(checkAuth, updateDestinationForTrip);

router.route("/delete-trip/:tripId").patch(checkAuth, deleteTrip);

export default router;
