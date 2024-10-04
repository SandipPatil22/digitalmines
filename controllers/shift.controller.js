import { Loading } from "../models/loading.model.js";
import { Pit } from "../models/pit.model.js";
import { Shift } from "../models/shift.model.js";
import { Trip } from "../models/Trips.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const shift = ["Shift 1", "Shift 2"];
const section = ["Section A", "Section B", "Section C", "Section D"];

const getShiftPreData = asyncHandler(async (req, res) => {
  const pit = await Pit.find({ corporation: req.user.corporation });
  const loadingUnit = await Loading.find({ corporation: req.user.corporation });

  if (pit && loadingUnit) {
    return res.status(200).json({
      data: { shift, pit, section, loadingUnit, section },
      message: "Data fetched successfully",
    });
  } else {
    return res.status(400).json({ message: "Failed to fetch data" });
  }
});

const startShift = asyncHandler(async (req, res) => {
  // // Get the start and end of the current day
  // const startOfDay = new Date();
  // startOfDay.setHours(0, 0, 0, 0); // Set to start of day

  // const endOfDay = new Date();
  // endOfDay.setHours(23, 59, 59, 999); // Set to end of day

  // // Check if a shift already exists for today
  // const existingShift = await Shift.findOne({
  //   corporation: req.user.corporation,
  //   createdBy: req.user._id,
  //   createdAt: {
  //     $gte: startOfDay,
  //     $lte: endOfDay,
  //   },
  // });

  // if (existingShift) {
  //   return res.status(400).json({ message: "Shift already started for today" });
  // }
  const { shiftStartTime } = req.body;
  const newShift = await Shift.create({
    corporation: req.user.corporation,
    createdBy: req.user._id,
    shiftStartTime,
  });

  if (newShift) {
    return res
      .status(201)
      .json({ message: "Shift started successfully", data: newShift });
  } else {
    return res.status(400).json({ message: "Failed to start shift" });
  }
});

const updateShift = asyncHandler(async (req, res) => {
  const {
    supervisorShiftId,
    shiftName,
    pit,
    section,
    whyRestart,
    loadingUnit,
    hourMeterStart,
    loadingLat,
    loadingLong,
    MachineStartTime,
  } = req.body;

  // console.log(req.body);

  if (!supervisorShiftId) {
    return res.status(400).json({ message: "Shift ID is required" });
  }

  if (!shiftName) {
    return res.status(400).json({ message: "Shift Name is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(pit)) {
    return res.status(400).json({ message: "Invalid pit ID" });
  }

  // if (!mongoose.Types.ObjectId.isValid(section)) {
  //   return res.status(400).json({ message: "Invalid section ID" });
  // }

  if (!mongoose.Types.ObjectId.isValid(loadingUnit)) {
    return res.status(400).json({ message: "Invalid loadingUnit ID" });
  }

  // if (!pit) {
  //   return res.status(400).json({ message: "Pit is required" });
  // }

  // if (!section) {
  //   return res.status(400).json({ message: "Section is required" });
  // }

  // if (!loadingUnit) {
  //   return res.status(400).json({ message: "Loading Unit is required" });
  // }

  // if (!hourMeterStart) {
  //   return res.status(400).json({ message: "Hour Meter Start is required" });
  // }

  // if (!loadingLat) {
  //   return res.status(400).json({ message: "Loading Latitude is required" });
  // }

  // if (!loadingLong) {
  //   return res.status(400).json({ message: "Loading Longitude is required" });
  // }

  // if (!MachineStartTime) {
  //   return res.status(400).json({ message: "Start Time is required" });
  // }

  if (
    !supervisorShiftId ||
    !shiftName ||
    !pit ||
    !section ||
    !loadingUnit ||
    !hourMeterStart ||
    !loadingLat ||
    !loadingLong
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingShift = await Shift.findById(supervisorShiftId);
  if (!existingShift) {
    return res.status(404).json({ message: "Shift not found" });
  }

  console.log(
    existingShift.shiftStartTime,
    " existing shift time in shift controller"
  );

  const machineStart = Date.now();
  const shift = await Shift.findByIdAndUpdate(
    supervisorShiftId,
    {
      shiftName,
      pit,
      section,
      whyRestart,
      loadingUnit,
      hourMeterStart,
      loadingLat,
      loadingLong,
      MachineStartTime,
      machineStart,
      updatedBy: req.user._id,
    },
    { new: true }
  );

  if (shift) {
    //if needed then update the machineStartTime too
    shift.shiftStartTime = existingShift.shiftStartTime;
    return res
      .status(200)
      .json({ message: "Shift updated successfully", data: shift });
  } else {
    return res.status(400).json({ message: "Failed to update shift" });
  }
});

const endShift = asyncHandler(async (req, res) => {
  const { supervisorShiftId, hourMeterEnd, MachineEndTime, shiftEndTime } =
    req.body;

  const machineEnd = Date.now();
  if (!supervisorShiftId) {
    return res.status(400).json({ message: "Shift ID is required" });
  }
  if (!hourMeterEnd) {
    return res.status(400).json({ message: "Hour Meter End is required" });
  }
  if (!machineEnd) {
    return res.status(400).json({ message: "Machine End is required" });
  }
  if (!MachineEndTime) {
    return res.status(400).json({ message: "Machine End Time is required" });
  }
  if (!shiftEndTime) {
    return res.status(400).json({ message: "shift End Time Time  required" });
  }
  const shift = await Shift.findByIdAndUpdate(
    supervisorShiftId,
    {
      hourMeterEnd,
      machineEnd,
      MachineEndTime,
      shiftEndTime,
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

// const getShiftData = asyncHandler(async (req, res) => {
//   // const { shiftId } = req.body;

//   // if (!shiftId) {
//   //   return res.status(400).json({ message: "Shift ID is required" });
//   // }

//   const userId = req.user._id;

//   // const shift = await Shift.findById(shiftId).populate("loadingUnit");

//   const startOfDay = new Date();
//   startOfDay.setHours(0, 0, 0, 0);

//   const endOfDay = new Date();
//   endOfDay.setHours(23, 59, 59, 999);

//   // Find the shift created by the user on the current day
//   const shift = await Shift.findOne({
//     createdBy: userId,
//     createdAt: { $gte: startOfDay, $lte: endOfDay },
//   })
//     .sort({ createdAt: -1 })
//     .populate("loadingUnit");

//   if (shift) {
//     const { startTime, endTime, machineStart, machineEnd, loadingUnit } = shift;

//     // Function to calculate time difference in minutes
//     const calculateTimeDifference = (start, end) => {
//       const startDate = new Date(start);
//       const endDate = new Date(end);
//       const differenceInMilliseconds = endDate - startDate;

//       return Math.floor(differenceInMilliseconds / 1000 / 60); // Convert to minutes
//     };

//     // Calculate total shift time
//     const totalShiftTimeInMinutes = calculateTimeDifference(startTime, endTime);
//     // Function to convert minutes to HH.MM format
//     const convertMinutesToHHMM = (minutes) => {
//       const hours = Math.floor(minutes / 60);
//       const mins = minutes % 60;
//       return `${hours}:${mins.toString().padStart(2, "0")}`;
//     };

//     const shiftTimeFormatted = convertMinutesToHHMM(totalShiftTimeInMinutes);

//     if (!loadingUnit) {
//       return res
//         .status(400)
//         .json({ message: "Loading unit not found in shift" });
//     }
//     // retrive the loding unit data by day in future when we have lot of data
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
//       totalShiftTime: shiftTimeFormatted,
//       idleTime: idleTimeFormatted,
//     });
//   } else {
//     return res.status(400).json({ message: "Failed to fetch shift" });
//   }
// });

const getShiftData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Find the latest shift created by the user on the current day
  const shift = await Shift.findOne({
    createdBy: userId,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  })
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order (latest first)
    .populate("loadingUnit");

  console.log(shift, "shift data ");

  if (shift) {
    const {
      shiftStartTime,
      shiftEndTime,
      machineStart,
      machineEnd,
      loadingUnit,
    } = shift;

    // Function to convert minutes to HH:MM format
    const convertMinutesToHHMM = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}:${mins.toString().padStart(2, "0")}`;
    };

    // Function to calculate time difference in minutes
    const calculateTimeDifference = (start, end) => {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const differenceInMilliseconds = endDate - startDate;
      return Math.floor(differenceInMilliseconds / 1000 / 60); // Convert to minutes
    };

    let totalShiftTimeInMinutes = 0;
    let shiftTimeFormatted = "00:00"; // Default value if shift is still ongoing

    // Check if both shiftStartTime and endTime are available before calculating total shift time
    if (shiftStartTime && shiftEndTime) {
      totalShiftTimeInMinutes = calculateTimeDifference(
        shiftStartTime,
        shiftEndTime
      );
      shiftTimeFormatted = convertMinutesToHHMM(totalShiftTimeInMinutes);
    }

    if (!loadingUnit) {
      return res
        .status(400)
        .json({ message: "Loading unit not found in shift" });
    }

    // Retrieve the loading unit data
    const trips = await Trip.find({ loading: loadingUnit._id, createdBy: userId });
console.log(userId,'user id in get shift data',loadingUnit._id)
    let totalLoadingTimeInMinutes = 0;

    trips.forEach((trip) => {
      const { loadingStartTime, loadingEndTime } = trip;
      if (loadingStartTime && loadingEndTime) {
        const start = new Date(loadingStartTime);
        const end = new Date(loadingEndTime);
        const differenceInMilliseconds = end - start;
        const loadingTimeInMinutes = Math.floor(
          differenceInMilliseconds / 1000 / 60
        );
        totalLoadingTimeInMinutes += loadingTimeInMinutes;
      }
    });

    const totalLoadingTimeFormatted = convertMinutesToHHMM(
      totalLoadingTimeInMinutes
    );

    let runningTimeInMinutes = null;
    if (machineStart && machineEnd) {
      runningTimeInMinutes = calculateTimeDifference(machineStart, machineEnd);
    }

    const idleTimeInMinutes =
      runningTimeInMinutes !== null
        ? runningTimeInMinutes - totalLoadingTimeInMinutes
        : null;

    const idleTimeFormatted =
      idleTimeInMinutes !== null
        ? convertMinutesToHHMM(idleTimeInMinutes)
        : "0:00"; // Default to "0:00" if idleTime is null

    console.log(runningTimeInMinutes, "running time");
    console.log(shiftTimeFormatted, "total shift time");
    console.log(idleTimeFormatted, "ideal machine time");
    return res.status(200).json({
      message: "Shift fetched successfully",
      data: shift,
      runningTimeInMinutes: runningTimeInMinutes || 0, // Default to 0 if null
      totalShiftTime: shiftTimeFormatted,
      idleTime: totalLoadingTimeFormatted,
      idleTimeFormatted,
      totalLoadingTimeInMinutes,
    });
  } else {
    return res.status(400).json({ message: "Failed to fetch shift" });
  }
});

export { startShift, updateShift, endShift, getShiftPreData, getShiftData };
