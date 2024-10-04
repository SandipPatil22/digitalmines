import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  createBuyer,
  deleteBuyers,
  getBuyers,
} from "../controllers/buyer.controller.js";
const router = Router();

router.route("/createbuyers").post(verifyJWT, createBuyer);

router.route("/getbuyers").get(verifyJWT, getBuyers);

router.route("/deleteBuyer/:id").patch(verifyJWT,deleteBuyers);

export default router;
