import { Router } from "express";
import { createDestination, deleteDestination, getDestinations, updateDestination } from "../controllers/destination.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-destination").post(verifyJWT ,createDestination);

router.route("/getDestinations").get(verifyJWT,getDestinations);

router.route('/deleteDestination/:id').patch(verifyJWT,deleteDestination)

router.route('/update-destination/:id').patch(verifyJWT, updateDestination)

export default router;
