import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { Shift } from "../models/shift.model.js";
import { Pit } from "../models/pit.model.js";
import { Loading } from "../models/loading.model.js";

const shift = ["Shift 1", "Shift 2"];
const section = ["Section A", "Section B", "Section C", "Section D"];

const startShift = asyncHandler(async (req, res) => {
  const newShift = await Shift.create({
    corporation: req.user.corporation,
    createdBy: req.user._id,
  });

  if (newShift) {
    return res
      .status(200)
      .json({ message: "shift started succesfully", data: newShift });
  } else {
    return res.status(400).json({ message: "fail to start shift " });
  }
});

const updateShift = asyncHandler(async (req, res) => {
  const {
    supervisorShiftId,
    shiftName,
    pit,
    section,
    hourMeterStart,
    loadingUnit,
    loadingLat,
    loadingLong,

    startTime,
  } = req.body;

  if (
    !shiftName ||
    !pit ||
    !section ||
    !hourMeterStart ||
    !loadingUnit ||
    !loadingLat ||
    !loadingLong ||
    !startTime
  ) {
    return res.status(400).json({ message: "required field missing " });
  }

  const existingShift = await Shift.findById(supervisorShiftId);
  if (!existingShift) {
    return res.status(404).json({ message: "Shift not found" });
  }

  const machineStart = Date.now();
  const shift = await Shift.findByIdAndUpdate(
    supervisorShiftId,
    {
      shiftName,
      pit,
      section,
      loadingUnit,
      hourMeterStart,
      loadingLat,
      loadingLong,
      startTime,
      machineStart,
      updatedBy: req.user._id,
    },
    { new: true }
  );

  if (shift) {
    return res
      .status(200)
      .json({ message: "shift updated succesfully", data: shift });
  } else {
    return res.status(400).json({ message: "failed to update shift" });
  }
});

const endshift = asyncHandler(async (req, res) => {
  const { hourMeterEnd, endTime, supervisorShiftId } = req.body;

  if (!endTime || !hourMeterEnd) {
    return res.status(404).json({ message: "Required field is missing " });
  }
  const machineEnd = Date.now();
  const shift = await Shift.findByIdAndUpdate(
    supervisorShiftId,
    { hourMeterEnd, endTime, machineEnd, updatedBy: req.user._id },
    { new: true }
  );

  if (shift) {
    return res.status(200).json({ message: "shift end succesfully", data:shift });
  } else {
    return res.status(400).json({ message: "failed to end the shift" });
  }
});

const getPreShiftData = asyncHandler(async (req, res) => {
  const pit = await Pit.find({ corporation: req.user.corporation });
  const loadingUnit = await Loading.find({ corporation: req.user.corporation });

  if (pit && loadingUnit) {
    return res.status(200).json({
      message: "featch pre data succesfully",
      data: {shift, section, pit, loadingUnit},
    });
  } else {
    return res.status(400).json({ message: "fail to featch pre data" });
  }
});
export { startShift, updateShift, endshift, getPreShiftData };
