import { Router } from "express";
import { createLoading, deleteLoading, getLoadings, updateLoading } from "../controllers/loading.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/create-loading").post(verifyJWT,createLoading);

router.route("/getLoadings").get(verifyJWT,getLoadings);

router.route('/delete-loading/:id').patch(verifyJWT,deleteLoading)

router.route('/update-loading/:id').patch(verifyJWT, updateLoading)

export default router;
