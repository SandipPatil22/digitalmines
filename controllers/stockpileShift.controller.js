import { Stockpile } from "../models/stockpile.model.js";
import { StockpileShift } from "../models/stockpileShift.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const shift = ["Shift 1", "Shift 2"];

const startStockpileShift = asyncHandler(async (req, res) => {
  const newShift = await StockpileShift.create({
    corporation: req.user.corporation,
    createdBy: req.user._id,
  });

  if (newShift) {
    return res
      .status(201)
      .json({ message: "Shift started successfully", data: newShift });
  } else {
    return res.status(400).json({ message: "Failed to start shift" });
  }
});
const getStockpileShiftPreData = asyncHandler(async (req, res) => {
  // const stockpile = await Stockpile.find({
  //   corporation: req.user.corporation,
  // }).select("StockpileName");

  if (shift ) {
    return res.status(200).json({
      data: { shift },
      message: "Data fetched successfully",
    });
  } else {
    return res.status(400).json({ message: "Failed to fetch data" });
  }
});

const updateStockpileShift = asyncHandler(async (req, res) => {
  const { supervisorShiftId, shiftName, startTime, stockpile } = req.body;

  console.log(req.body);

  if (!supervisorShiftId) {
    return res.status(400).json({ message: "Shift ID is required" });
  }

  if (!shiftName) {
    return res.status(400).json({ message: "Shift Name is required" });
  }

  if (!supervisorShiftId || !shiftName  || !startTime) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingShift = await StockpileShift.findById(supervisorShiftId);

  if (!existingShift) {
    return res.status(404).json({ message: "Shift not found" });
  }

  const shift = await StockpileShift.findByIdAndUpdate(
    supervisorShiftId,
    {
      shiftName,
      // stockpile,
      startTime,
      updatedBy: req.user._id,
    },
    { new: true }
  );

  if (shift) {
    return res
      .status(200)
      .json({ message: "Shift updated successfully", data: shift });
  } else {
    return res.status(400).json({ message: "Failed to update shift" });
  }
});

const endStockpileShift = asyncHandler(async (req, res) => {
  const { supervisorShiftId, endTime } = req.body;

  if (!supervisorShiftId) {
    return res.status(400).json({ message: "Shift ID is required" });
  }

  if (!endTime) {
    return res.status(400).json({ message: "End Time is required" });
  }
  const shift = await StockpileShift.findByIdAndUpdate(
    supervisorShiftId,
    {
      endTime,
      updatedBy: req.user._id,
    },
    { new: true }
  );
  if (shift) {
    return res
      .status(200)
      .json({ message: "Shift ended successfully", data: shift });
  } else {
    return res.status(400).json({ message: "Failed to end shift" });
  }
});

const getStockpileShiftData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Find the shift created by the user on the current day
  const shift = await StockpileShift.findOne({
    createdBy: userId,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  if (shift) {
    return res.status(200).json({
      message: "Stockpile shift data featch succesfully",
      data: shift,
    });
  } else {
    return res
      .status(400)
      .json({ message: "fail to featch Stockpile shift data " });
  }
});

export {
  startStockpileShift,
  getStockpileShiftPreData,
  updateStockpileShift,
  endStockpileShift,
  getStockpileShiftData,
};
