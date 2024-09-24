import { Router } from "express";
import { CreatePlant, deletePlant, getPlant } from "../controllers/plant.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-plant").post(verifyJWT,CreatePlant);

router.route("/get-plant").get(verifyJWT,getPlant);

router.route('/delete-plant/:id').patch(verifyJWT,deletePlant)

export default router;
