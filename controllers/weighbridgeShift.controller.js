import { Weighbridge } from "../models/weighbridge.model.js";
import { WeighbridgeShift } from "../models/weighbridgeShift.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const shift = ["Shift 1", "Shift 2"];

const startweighbridgeShift = asyncHandler(async (req, res) => {
  const newShift = await WeighbridgeShift.create({
    corporation: req.user.corporation,
    createdBy: req.user._id,
  });

  console.log(req.user.corporation);
  if (newShift) {
    return res
      .status(201)
      .json({ message: "Shift started successfully", data: newShift });
  } else {
    return res.status(400).json({ message: "Failed to start shift" });
  }
});
const getweighbridgeShiftPreData = asyncHandler(async (req, res) => {
  const weighbridge = await Weighbridge.find({
    corporation: req.user.corporation,
  }).select("WeighbridgeName");
  if (shift && weighbridge) {
    return res.status(200).json({
      data: { shift, weighbridge },
      message: "Data fetched successfully",
    });
  } else {
    return res.status(400).json({ message: "Failed to fetch data" });
  }
});

const updateWeighbridgeShift = asyncHandler(async (req, res) => {
  const { supervisorShiftId, shiftName, startTime, Weighbridge } = req.body;

  console.log(req.body);

  if (!supervisorShiftId) {
    return res.status(400).json({ message: "Shift ID is required" });
  }

  if (!shiftName) {
    return res.status(400).json({ message: "Shift Name is required" });
  }

  if (!supervisorShiftId || !shiftName || !Weighbridge || !startTime) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingShift = await WeighbridgeShift.findById(supervisorShiftId);
  if (!existingShift) {
    return res.status(404).json({ message: "Shift not found" });
  }

  const shift = await WeighbridgeShift.findByIdAndUpdate(
    supervisorShiftId,
    {
      shiftName,
      Weighbridge,
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

const endweighbridgeShift = asyncHandler(async (req, res) => {
  const { supervisorShiftId, endTime } = req.body;

  if (!supervisorShiftId) {
    return res.status(400).json({ message: "Shift ID is required" });
  }

  if (!endTime) {
    return res.status(400).json({ message: "End Time is required" });
  }
  const shift = await WeighbridgeShift.findByIdAndUpdate(
    supervisorShiftId,
    {
      endTime,
      updatedBy: req.user._id,
    },
    { new: true } // Ensure the updated document is returned
  );

  if (shift) {
    return res
      .status(200)
      .json({ message: "Shift ended successfully", data: shift });
  } else {
    return res.status(400).json({ message: "Failed to end shift" });
  }
});

const getWeighbridgeShiftData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Find the shift created by the user on the current day
  const shift = await WeighbridgeShift.findOne({
    createdBy: userId,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });
  if (shift) {
    return res
      .status(200)
      .json({ message: "weighbridge shift data featch succesfully" , data:shift});
  } else {
    return res
      .status(400)
      .json({ message: "fail to featch weighbridge shift data " });
  }

  //   if (shift) {
  //     const { machineStart, machineEnd, loadingUnit } = shift;

  //     if (!loadingUnit) {
  //       return res
  //         .status(400)
  //         .json({ message: "Loading unit not found in shift" });
  //     }
  // // retrive the loding unit data by day in future when we have lot of data
  //     const trips = await Trip.find({ loading: loadingUnit });

  //     let totalLoadingTimeInMinutes = 0;

  //     const tripsWithLoadingTime = trips.map((trip) => {
  //       const { loadingStartTime, loadingEndTime } = trip;

  //       if (loadingStartTime && loadingEndTime) {
  //         const start = new Date(loadingStartTime);
  //         const end = new Date(loadingEndTime);
  //         const differenceInMilliseconds = end - start;
  //         const loadingTimeInMinutes = Math.floor(
  //           differenceInMilliseconds / 1000 / 60
  //         );
  //         totalLoadingTimeInMinutes += loadingTimeInMinutes;
  //       }
  //     });

  //     let runningTimeInMinutes = null;
  //     if (machineStart && machineEnd) {
  //       const start = new Date(machineStart);
  //       const end = new Date(machineEnd);
  //       const differenceInMilliseconds = end - start;
  //       runningTimeInMinutes = Math.floor(differenceInMilliseconds / 1000 / 60);
  //     }

  //     const idleTimeInMinutes = runningTimeInMinutes - totalLoadingTimeInMinutes;

  //     const idleHours = Math.floor(idleTimeInMinutes / 60);
  //     const idleMinutes = idleTimeInMinutes % 60;
  //     const idleTimeFormatted = `${idleHours}:${idleMinutes}`;

  //     return res.status(200).json({
  //       message: "Shift fetched successfully",
  //       data: shift,
  //       runningTimeInMinutes,
  //       idleTime: idleTimeFormatted,
  //     });
  //   } else {
  //     return res.status(400).json({ message: "Failed to fetch shift" });
  //   }
});

export {
  startweighbridgeShift,
  updateWeighbridgeShift,
  endweighbridgeShift,
  getweighbridgeShiftPreData,
  getWeighbridgeShiftData
};
