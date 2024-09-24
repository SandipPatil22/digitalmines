import { Router } from "express";
import {
  createRole,
  deleteRole,
  getRole,
} from "../controllers/role.controller.js";
const router = Router();
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.route("/createRole").post(verifyJWT,createRole);

router.route("/getRole").get(verifyJWT, getRole);

router.route("/deleteRole/:id").patch(verifyJWT, deleteRole);

export default router;
