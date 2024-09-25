import { Target } from "../models/target.model.js";
import { Trip } from "../models/Trips.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTarget = asyncHandler(async (req, res) => {
  const { materialTarget, wasteTarget, month, year } = req.body;

  if (!materialTarget || !wasteTarget || !month || !year) {
    return res.status(400).json({ message: "Please provide all the details" });
  }

  const newTarget = await Target.create({
    materialTarget,
    wasteTarget,
    month,
    year,
    corporation: req.user._id,
    createdBy: req.user._id,
  });

  if (newTarget) {
    return res
      .status(201)
      .json({ message: "Target created successfully", data: newTarget });
  } else {
    return res.status(400).json({ message: "Failed to create target" });
  }
});

const getTarget = asyncHandler(async (req, res) => {
  const corporationId = req?.user?._id;
  const target = await Target.find({
    corporation: corporationId,
    status: true,
  });

  if (target.length > 0) {
    return res
      .status(200)
      .json({ message: "featech target succesfully", data: target });
  } else {
    return res.status(404).json({ message: "fail to featch data " });
  }
});

const updateTarget = asyncHandler(async (req, res) => {
  const { materialTarget, wasteTarget, month, year } = req.body;
  const updatetarget = await Target.findByIdAndUpdate(
    req.params.id,
    { materialTarget, wasteTarget, month, year },
    { new: true }
  );

  if (updatetarget) {
    return res
      .status(200)
      .json({ message: "target updated succesfully", data: updatetarget });
  } else {
    return res.status(400).json({ message: "failed to update target" });
  }
});
const getAdminPanelDashboard = asyncHandler(async (req, res) => {
  const corporationId = req?.user?._id;
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const target = await Target.findOne({
    corporation: corporationId,
    month: currentMonth,
    status: true,
  });

  const trips = await Trip.find({
    corporation: corporationId,
    status: true,
  });

  const totalWeight = trips.reduce((acc, trip) => acc + Number(trip.weight), 0);

  const remainingTarget = Number(target?.target) - Number(totalWeight);

  if (target) {
    return res.status(200).json({
      message: "featech target succesfully",
      data: { target, totalWeight, trips: trips.length, remainingTarget },
    });
  } else {
    return res.status(404).json({ message: "fail to featch data " });
  }
});

export { createTarget, updateTarget, getTarget, getAdminPanelDashboard };
