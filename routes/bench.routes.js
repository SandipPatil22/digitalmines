import { Router } from "express";
import {
  createBench,
  deleteBenches,
  getAllBenches,
  getBenchByPitId,
  updateBench,
} from "../controllers/bench.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkAuth } from "../middlewares/supervisorAuth.middleware.js";

const router = Router();

router.route("/create-bench").post(verifyJWT, createBench);
// mobile route
router.route("/get-bench-by-pit-id/:pitId").get(checkAuth, getBenchByPitId);

router.route("/get-all-benches").get(verifyJWT, getAllBenches);

router.route("/delete-branch/:id").patch(verifyJWT,deleteBenches);

router.route("/update-bench/:id").patch(verifyJWT, updateBench);

export default router;
