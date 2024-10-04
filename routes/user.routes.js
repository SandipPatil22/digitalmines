import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createUser, deleteuser, loginUser } from "../controllers/user.controller.js";
const router = Router();


router.route('/create-user').post( createUser);

router.route('/login-user').post( loginUser);

router.route('/delete-user/:id').patch(deleteuser)

export default router;

