import { Router } from "express";
import {
  createDumper,
  deleteDumper,
  getDumpers,
  updateDumper,
} from "../controllers/dumper.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-dumper").post(verifyJWT, createDumper);

router.route("/getDumpers").get(verifyJWT, getDumpers);

router.route("/deleteDumper/:id").patch(verifyJWT, deleteDumper);

router.route('/update-dumper/:id').patch(verifyJWT, updateDumper)

export default router;
