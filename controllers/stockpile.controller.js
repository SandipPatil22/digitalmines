import { Stockpile } from "../models/stockpile.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createStockpile = asyncHandler(async (req, res) => {
  const { StockpileName } = req.body;
  const isExist = await Stockpile.findOne({ StockpileName });

  if (isExist) {
    return res.status(404).json({ message: "Stockpile is already created" });
  }

  const corporationId = req?.user?._id;
  const stockpile = await Stockpile.create({
    StockpileName,
    corporation: corporationId,
  });

  if (stockpile) {
    return res
      .status(200)
      .json({ message: "Stockpile created succesfully", data: stockpile });
  } else {
    return res.status(400).json({ message: "Error while creating stockpile" });
  }
});

const getStockpile = asyncHandler(async (req, res) => {
  const corporationId = req?.user?._id;
  const stockpile = await Stockpile.find({
    corporation: corporationId,
    status: true,
  });
  if (stockpile) {
    return res
      .status(200)
      .json({ message: "featch stockpile succeafully", data: stockpile });
  } else {
    return res.status(400).json({ message: "no sotckpile found" });
  }
});

const deleteStockpile = asyncHandler(async (req, res) => {
  const stockpile = await Stockpile.findById(req.params.id);

  if (stockpile) {
    stockpile.status = false;
    await stockpile.save();
    res.json({ message: "stockpile removed" });
  } else {
    res.status(404);
    throw new Error(" stockpile not found ");
  }
});

export { createStockpile, getStockpile, deleteStockpile };
