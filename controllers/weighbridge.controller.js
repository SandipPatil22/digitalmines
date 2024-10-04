import { asyncHandler } from "../utils/asyncHandler.js";

import { Weighbridge } from "../models/weighbridge.model.js";
import { Trip } from "../models/Trips.model.js";
import { Dumper } from "../models/dumper.model.js";
import mongoose from "mongoose";

// const getAllDumpersList = asyncHandler(async (req, res) => {
//   const dumpers = await Dumper.find({});

//   if (dumpers) {
//     return res
//       .status(200)
//       .json({ dumpers, message: "Dumpers fetched successfully" });
//   } else {
//     return res.status(404).json({ message: "No dumpers found" });
//   }
// });

const createWeighbridge = asyncHandler(async (req, res) => {
  const { WeighbridgeName } = req.body;
  const WeighbridgeExist = await Weighbridge.findOne({ WeighbridgeName });

  if (WeighbridgeExist) {
    return res.status(404).json({ message: "Weighbridge  is already exist" });
  }
  const corporationId = req?.user?._id;

  const weighbridge = await Weighbridge.create({
    WeighbridgeName,
    corporation: corporationId,
  });

  if (weighbridge) {
    return res.status(200).json({
      message: " Weighbridge create succesfully",
      data: weighbridge,
    });
  } else {
    return res.status(400).json({ message: " Fail to create Weighbridge" });
  }
});

const getAllDumpersList = asyncHandler(async (req, res) => {
  // Determine the start and end of the current day
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Use aggregation to find dumpers involved in trips created within the day
  const dumpersInTrips = await Trip.aggregate([
    {
      $match: {
        // createdAt: { $gte: startOfDay, $lte: endOfDay },
        tripStatus: "InProgress",
        isWeightDone: false,
        material: "Bauxite",
      },
    },
    {
      $lookup: {
        from: "dumpers", // Adjust if your collection name is different
        localField: "dumper",
        foreignField: "_id",
        as: "dumperDetails",
      },
    },
    {
      $unwind: "$dumperDetails",
    },
    {
      $group: {
        _id: "$dumperDetails._id",
        dumper: { $first: "$dumperDetails" },
      },
    },
    {
      $replaceRoot: { newRoot: "$dumper" },
    },
  ]);

  if (dumpersInTrips.length > 0) {
    return res.status(200).json({
      dumpers: dumpersInTrips,
      message: "Dumpers in trips fetched successfully",
    });
  } else {
    return res
      .status(404)
      .json({ message: "No dumpers found in trips for today" });
  }
});

const getTripDataByDumperId = asyncHandler(async (req, res) => {
  const dumperId = req.body.id;
  if (!dumperId) {
    return res.status(400).json({ message: "Dumper id is required" });
  }

  console.log(req.body)
  // Check if dumperId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(dumperId)) {
    return res.status(400).json({ message: "Invalid dumper ID " });
  }
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const tripData = await Trip.findOne({
    dumper: dumperId,
    tripStatus: "InProgress",
    isWeightDone: false,

    // updatedAt: { $gte: startOfToday },
  })
    .populate({
      path: "pit",
      select: "mineId",
      populate: {
        path: "mineId",
        select: "mineCode",
      },
    })
    .populate({ path: "loading", select: "unitId" })
    .populate({ path: "loadingOperator", select: "operatorName" })
    .populate({ path: "dumper", select: "dumperNumber" })
    .populate({ path: "dumperOperator", select: "operatorName" })
    .populate({ path: "destination", select: "destinationName" });
  if (tripData) {
    return res
      .status(200)
      .json({ tripData, message: "Trip data fetched successfully" });
  } else {
    return res.status(404).json({ message: "No trip data found" });
  }
});

const addWeighbridgeData = asyncHandler(async (req, res) => {
  const {
    dumper,
    dumperOperator,
    weight,
    mine,
    loading,
    loadingOperator,
    tripId,
    material,
    destination,
    feedback,
  } = req.body;

  const corporationId = req?.user?.corporation;

  const account = req?.user?._id;

  if (
    !dumper ||
    !dumperOperator ||
    !weight ||
    !mine ||
    !tripId ||
    !loading ||
    !loadingOperator ||
    // !feedback ||
    !material ||
    !destination
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const idsToValidate = [
    dumper,
    dumperOperator,
    mine,
    loading,
    loadingOperator,
    destination,
    tripId,
  ];

  // Check each ID individually
  for (const id of idsToValidate) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
  }

  // const weighbridgeData = await Weighbridge.create({
  //   dumper,
  //   dumperOperator,
  //   weight,
  //   mine,
  //   loading,
  //   loadingOperator,
  //   material,
  //   destination,
  //   feedback,
  //   corporation: corporationId,
  // });

  // if (weighbridgeData) {
  const trip = await Trip.findByIdAndUpdate(
    tripId,

    {
      // tripStatus: "Completed",
      weight,
      isWeightDone: true,
      weightUpdatedBy: account,
    },

    { new: true }
  );
console.log(trip,"weight data")
  return res.status(200).json({
    // weighbridgeData,
    trip,
    message: "Weighbridge data added successfully",
  });
  // } else {
  //   return res.status(404).json({ message: "Weighbridge data not added" });
  // }
});

// const updateWeighbridgeDataInTrip = asyncHandler(async (req, res) => {
//   const { weight, tripId } = req.body;
//   const account = req?.user?._id;

//   if (!weight || !tripId) {
//     return res
//       .status(400)
//       .json({ message: "All fields are required is required" });
//   }

//   if (!mongoose.Types.ObjectId.isValid(tripId)) {
//     return res.status(400).json({ message: "Invalid ID" });
//   }

//   const tripData = await Trip.findByIdAndUpdate(tripId, {
//     $set: {
//       weight,
//       isWeightDone: true,
//       weightUpdatedBy: account,
//     },
//   });

//   if (tripData) {
//     return res
//       .status(200)
//       .json({ tripData, message: "Trip data updated successfully" });
//   } else {
//     return res.status(404).json({ message: "Trip data not updated" });
//   }
// });

const deleteWeighbridge = asyncHandler(async (req, res) => {
  const weighbridge = await Weighbridge.findById(req.params.id);

  if (weighbridge) {
    weighbridge.status = false;
    await weighbridge.save();
    res.json({ message: "WeighBridge Removed" });
  } else {
    res.status(404);
    throw new Error("WeighBridge not found");
  }
});

const getTripsByDayBySupervisorId = asyncHandler(async (req, res) => {
  const supervisorId = req?.user?._id;
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const trips = await Trip.find({
    weightUpdatedBy: supervisorId,
    updatedAt: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  })
    .populate("pit", "pitName")
    .populate("bench", "benchName benchLocation")
    .populate("loading", "unitId")
    .populate("dumper", "dumperNumber")
    .populate("loadingOperator", "operatorName")
    .populate("dumperOperator", "operatorName")
    .populate("destination", "destinationName destinationLocation")
    .populate("createdBy", "fullname");

  if (trips.length > 0) {
    return res.status(200).json({
      message: "tripe by supervisor featch succesfully",
      data: trips,
    });
  } else {
    return res.status(404).json({ message: "trips  not found" });
  }
});

export {
  getTripDataByDumperId,
  addWeighbridgeData,
  getAllDumpersList,
  // updateWeighbridgeDataInTrip,
  deleteWeighbridge,
  getTripsByDayBySupervisorId,
  createWeighbridge,
};
