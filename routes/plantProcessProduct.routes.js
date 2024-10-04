import { Router } from "express";
import { checkAuth } from "../middlewares/supervisorAuth.middleware.js";
import {
  createPlantProcessProduct,
  deletPlantProcessProduct,
  getPlantProcessProduce,
  getPrePlantProcessProductData,
  updatePlantPP,
} from "../controllers/plantProcess.controller.js";

const router = Router();

router
  .route("/createPlantProcessProduct")
  .post(checkAuth, createPlantProcessProduct);

router.route("/getPlantProcessProduct").get(checkAuth, getPlantProcessProduce);

router.route("/deletePlantProcessProduct/:id").patch(deletPlantProcessProduct);

router.route("/updatePlantProcessProduct/:id").put(checkAuth, updatePlantPP);

router.route('/getPrePlantProcessProductData').get(getPrePlantProcessProductData)

export default router;
