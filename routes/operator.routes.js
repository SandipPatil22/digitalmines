import { Router } from "express";
import { createOperator, deleteOperator, getOperators, updateOperator } from "../controllers/operator.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-operator").post(verifyJWT,createOperator);

router.route("/getOperators").get(verifyJWT,getOperators);

router.route('/delete-operator/:id').patch(verifyJWT,deleteOperator)

router.route('/update-operator/:id').patch(verifyJWT, updateOperator)

export default router;
