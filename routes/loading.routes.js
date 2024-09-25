import { Router } from "express";
 
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createLoading, deleteLoading,  getLoadings, updateLoading } from "../controllers/loding.controller.js";


const router = Router();

router.route("/create-loading").post(verifyJWT, createLoading);

router.route("/getLoadings").get(verifyJWT,getLoadings);

router.route('/delete-loading/:id').patch(verifyJWT,deleteLoading)

router.route('/update-loading/:id').patch(verifyJWT, updateLoading)

export default router;
