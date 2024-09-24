import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createStockpile, deleteStockpile, getStockpile } from "../controllers/stockpile.controller.js";

const router = Router();

router.route("/create-stockpile").post(verifyJWT, createStockpile);
router.route("/get-stockpile").get(verifyJWT, getStockpile);
router.route("/delete-stockpile/:id").patch(verifyJWT,deleteStockpile);

export default router;
