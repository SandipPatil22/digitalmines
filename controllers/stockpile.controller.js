import { asyncHandler } from "../utils/asyncHandler.js";
import { Stockpile } from "../models/stockpile.model.js";
import { Trip } from "../models/Trips.model.js";
import mongoose from "mongoose";

const createStockpille = asyncHandler(async (req, res) => {
  const { StockpileName } = req.body;
  const StockpileExist = await Stockpile.findOne({ StockpileName });

  if (StockpileExist) {
    return res.status(404).json({ message: "Stockpile  is already exist" });
  }
  const corporationId = req?.user?._id;
  const stockpile = await Stockpile.create({
    StockpileName,
    corporation: corporationId,
  });
  if (stockpile) {
    return res.status(200).json({
      message: " stockpile create succesfully",
      data: stockpile,
    });
  } else {
    return res.status(400).json({ message: " Fail to create stockpile" });
  }
});

const getStockpile = asyncHandler(async (req, res) => {
  const corporationId = req?.user?._id;
  const stockpile = await Stockpile.find({
    corporation: corporationId,
    status: true,
  });

  if (stockpile) {
    return res.status(200).json({
      message: "featch  stockpile succesfully",
      data: stockpile,
    });
  } else {
    return res.status(404).json({ message: "No stockpile found " });
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

const getAllStockpileDumpersTripList = asyncHandler(async (req, res) => {
  const dumpersInTrips = await Trip.aggregate([
    {
      $match: {
        // createdAt: { $gte: startOfDay, $lte: endOfDay },
        tripStatus: "InProgress",
        isWeightDone: true,
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
  // Check if dumperId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(dumperId)) {
    return res.status(400).json({ message: "Invalid dumper ID " });
  }
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const tripData = await Trip.findOne({
    dumper: dumperId,
    tripStatus: "InProgress",
    isWeightDone: true,
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

const completeTripOne = asyncHandler(async (req, res) => {
  const { tripId } = req.body;
  console.log(req.body);
  const trip = await Trip.findByIdAndUpdate(
    tripId,
    {
      tripStatus: "Completed",
    },
    { new: true }
  );

  if (trip) {
    return res.status(200).json({
      message: "Trip completed successfully",
      data: trip,
    });
  } else {
    return res.status(400).json({ message: "Error while completing trip" });
  }
});

const getisWeightDoneTripsByDate = asyncHandler(async (req, res) => {
  const corporationId = req?.user?.corporation;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const trips = await Trip.aggregate([
    {
      $match: {
        corporation: corporationId,
        updatedAt: {
          $gte: today,
          $lt: tomorrow,
        },
        isWeightDone: true,
      },
    },
    {
      $lookup: {
        from: "destinations", // Name of your destination collection
        localField: "destination", // Field from Trip model
        foreignField: "_id", // Field from Destination model
        as: "destinationDetails", // New array field to add to the result
      },
    },
    {
      $unwind: "$destinationDetails", // Flatten the array of destinationDetails
    },
    {
      $match: {
        "destinationDetails.destinationType": "Stockpile", // Filter for stockpile type
      },
    },
    {
      $lookup: {
        from: "pits", // Name of your pit collection
        localField: "pit",
        foreignField: "_id",
        as: "pitDetails",
      },
    },
    {
      $lookup: {
        from: "benches", // Name of your bench collection
        localField: "bench",
        foreignField: "_id",
        as: "benchDetails",
      },
    },
    {
      $lookup: {
        from: "loadings", // Name of your loading collection
        localField: "loading",
        foreignField: "_id",
        as: "loadingDetails",
      },
    },
    {
      $lookup: {
        from: "dumpers", // Name of your dumper collection
        localField: "dumper",
        foreignField: "_id",
        as: "dumperDetails",
      },
    },
    {
      $lookup: {
        from: "operators", // Name of your loading operator collection
        localField: "loadingOperator",
        foreignField: "_id",
        as: "loadingOperatorDetails",
      },
    },
    {
      $lookup: {
        from: "operators", // Name of your dumper operator collection
        localField: "dumperOperator",
        foreignField: "_id",
        as: "dumperOperatorDetails",
      },
    },
    // Optionally, you can add more lookups for additional fields
    {
      $project: {
        _id: 1,
        pit: { $ifNull: [{ $arrayElemAt: ["$pitDetails", 0] }, null] },
        bench: { $ifNull: [{ $arrayElemAt: ["$benchDetails", 0] }, null] },
        loading: { $ifNull: [{ $arrayElemAt: ["$loadingDetails", 0] }, null] },
        dumper: { $ifNull: [{ $arrayElemAt: ["$dumperDetails", 0] }, null] },
        loadingOperator: {
          $ifNull: [{ $arrayElemAt: ["$loadingOperatorDetails", 0] }, null],
        },
        dumperOperator: {
          $ifNull: [{ $arrayElemAt: ["$dumperOperatorDetails", 0] }, null],
        },
        destination: { $ifNull: ["$destinationDetails", null] }, // Destination details directly
        section: 1,
        material: 1,
        moistureContent: 1,
        subGrade: 1,
        loadingStartTime: 1,
        loadingEndTime: 1,
        tripStatus: 1,
        feedback: 1,
        weight: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  // const trips = await Trip.find({
  //   corporation: corporationId,
  //   updatedAt: {
  //     $gte: today,
  //     $lt: tomorrow,
  //   },
  //   isWeightDone: true,
  //   // tripStatus: "InProgress",
  // })
  //   .populate("pit", "pitName")
  //   .populate("bench", "benchName benchLocation")
  //   .populate("loading", "unitId")
  //   .populate("dumper", "dumperNumber")
  //   .populate("loadingOperator", "operatorName")
  //   .populate("dumperOperator", "operatorName")
  //   .populate({
  //     path: "destination",
  //     match: { destinationType: "Stockpile" }, // Filter for stockpile destinations
  //     select: "destinationName destinationLocation"
  //   });

  if (trips.length === 0) {
    return res.status(404).json({ message: "No trips found" });
  } else {
    return res.status(200).json({
      data: trips,
      message: "Trips fetched successfully",
    });
  }
});

export {
  createStockpille,
  getStockpile,
  deleteStockpile,
  getAllStockpileDumpersTripList,
  getTripDataByDumperId,
  getisWeightDoneTripsByDate,
  completeTripOne,
};
