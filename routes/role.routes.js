import { Router } from "express";
import { createRole, deleteRole, getRole } from "../controllers/role.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-role").post(verifyJWT,createRole);

router.route("/get-roles").get(verifyJWT,getRole);

router.route('/delete-role/:id').patch(verifyJWT,deleteRole)

export default router;
