import { Router } from "express";
import {
  UpdateDestinationIdForTrip,
  createTrip,
  deleteTrip,
  getTripsByDate,
  updateTrip,
} from "../controllers/trips.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkAuth } from "../middlewares/supervisorAuth.middleware.js";

const router = Router();

// router.use(verifyJWT);

router.route("/start-loading").post(checkAuth,createTrip);

router.route("/get-trips-by-date").get(checkAuth,getTripsByDate);

router.route("/end-loading/:id").patch(updateTrip);

router.route("/create-trip/:id").patch(UpdateDestinationIdForTrip);

router.route("/delete-trip/:tripId").patch(deleteTrip)

export default router;
