import { Bench } from "../models/bench.model.js";
import { Destination } from "../models/destination.model.js";
import { Dumper } from "../models/dumper.model.js";
import { Loading } from "../models/loading.model.js";
import { Operator } from "../models/operator.model.js";
import { Pit } from "../models/pit.model.js";
import { Mines } from "../models/mines.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Trip } from "../models/Trips.model.js";
const minerals = ["Bauxite", "Waste", "SubGrade", "Top Soil"];

const section = ["Section A", "Section B", "Section C", "Section D"];

const moistureContent = ["0%", "5%", "10%", "15%"];

const subGrade = [
  "Below 40% Al2O3",
  "40% to below 45% Al2O3",
  "45% to below 50% Al2O3",
  "50% to below 55% Al2O3",
];

const createPit = asyncHandler(async (req, res) => {
  const {
    pitCode,
    pitName,
    mineralsName,
    locationcoords,
    pitArea,
    pitLength,
    pitWidth,
    pitDepth,
    pitStatus,
    mineId,
  } = req.body;

  const isExist = await Pit.findOne({ pitCode });

  if (isExist) {
    return res.status(400).json({ message: "Pit already exists" });
  }

  const corporationId = req?.user?._id;
  const pit = await Pit.create({
    pitCode,
    pitName,
    mineralsName,
    locationcoords,
    pitArea,
    pitLength,
    pitWidth,
    pitDepth,
    pitStatus,
    mineId,
    corporation: corporationId,
  });

  if (pit) {
    res.status(200).json({ message: "Pit created succesfully", data: pit });
  } else {
    return res.status(400).json({ message: "Fail to create pit" });
  }
});

const getPits = asyncHandler(async (req, res) => {
  const mineId = req.params.mineId;
  const corporationId = req?.user?._id;

  if (!mineId) {
    return res.status(404).json({ message: "mine Id required" });
  }

  const pit = await Pit.find({
    mineId: mineId,
    corporation: corporationId,
    status: true,
  });

  if (pit.length > 0) {
    return res
      .status(200)
      .json({ message: "Pits featched succesfully", data: pit });
  } else {
    return res.status(400).json({ message: "no pit found" });
  }
});

const updatePit = asyncHandler(async (req, res) => {
  const {
    pitCode,
    pitName,
    mineralsName,
    locationcoords,
    pitArea,
    pitLength,
    pitWidth,
    pitDepth,
    status,
    mineId,
  } = req.body;

  const isExist = await Pit.find(pitCode);
  if (!isExist) {
    return res.status(404).json({ message: "pit not found" });
  }

  const pit = await Pit.findByIdAndUpdate(
    req.params.pitId,
    {
      pitCode,
      pitName,
      mineralsName,
      locationcoords,
      pitArea,
      pitLength,
      pitWidth,
      pitDepth,
      status,
      mineId,
    },
    { new: true }
  );

  if (pit) {
    res.status(200).json({ message: "Pit updated succesfully", data: pit });
  }
});

const deletePit = asyncHandler(async (req, res) => {
  const pit = await Pit.findById(req.params.pitId);

  if (pit) {
    // await Pit.findByIdAndDelete(req.params.pitId);
    pit.status = false;
    await pit.save();
    res.json({ message: "Pit removed" });
  } else {
    res.status(404);
    throw new Error("Pit not found");
  }
});

const getAllTaskPreData = asyncHandler(async (req, res) => {
  const pits = await Pit.find({}, { pitCode: 1, pitName: 1, _id: 1 });
  const bench = await Bench.find(
    {},
    { pit: 1, benchName: 1, _id: 1, benchLocation: 1 }
  );
  const loading = await Loading.find(
    {},
    { operatorName: 1, unitId: 1, _id: 1 }
  );
  // const dumper = await Dumper.find({}, { dumperNumber: 1, _id: 1 });

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Use aggregation to find dumpers involved in trips created within the day
  const dumper = await Dumper.aggregate([
    {
      $lookup: {
        from: "trips",
        localField: "_id",
        foreignField: "dumper",
        as: "trips",
      },
    },
    {
      $match: {
        $or: [
          { "trips.tripStatus": { $ne: "InProgress" } }, // Exclude dumpers with InProgress trips
          // { trips: { $eq: [] } }, // Include dumpers with no trips at all
        ],
      },
    },
    {
      $project: {
        _id: 1,
        dumperNumber: 1,
        // Add any other fields you want to include from the Dumper model
      },
    },
    {
      $unionWith: {
        coll: "trips",
        pipeline: [
          {
            $match: {
              tripStatus: "Completed",
              // isWeightDone: false,
              // createdAt: { $gte: startOfDay, $lte: endOfDay },
            },
          },
          {
            $lookup: {
              from: "dumpers",
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
        ],
      },
    },
    {
      $group: {
        _id: "$_id",
        dumperNumber: { $first: "$dumperNumber" },
        dumperCapacity: { $first: "$dumperCapacity" },
        corporation: { $first: "$corporation" },
        status: { $first: "$status" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
      },
    },
  ]);

  // console.log(dumper);
  const loadingOperator = await Operator.find(
    { role: "Loading" },
    { operatorName: 1, _id: 1 }
  );
  const dumperOperator = await Operator.find(
    { role: "Dumper" },
    { operatorName: 1, _id: 1 }
  );
  const destinationStockpile = await Destination.find(
    { destinationType: "Stockpile" },
    { destinationName: 1, destinationLocation: 1, _id: 1 }
  );

  const destinationWaste = await Destination.find(
    { destinationType: "Dumpyard" },
    { destinationName: 1, destinationLocation: 1, _id: 1 }
  );

  if (pits) {
    res.status(200).json({
      message: "All task data fetched successfully",
      data: {
        pits,
        section,
        bench: bench,
        loading,
        loadingOperator,
        material: minerals,
        subGrade: subGrade,
        moistureContent,
        dumper,

        dumperOperator,
        destinationStockpile,
        destinationWaste,
      },
    });
  } else {
    res.status(404).json({ message: "No pits found" });
  }
});

const getPitsByCorporation = asyncHandler(async (req, res) => {
  const corporationId = req.user._id;

  if (!corporationId) {
    return res.status(400).json({ message: "Corporation ID is required" });
  }

  const pits = await Pit.find({
    corporation: corporationId,
    status: true,
  }).populate("mineId");

  if (pits.length > 0) {
    return res.status(200).json({
      message: "Pits fetched successfully",
      data: pits,
    });
  } else {
    return res.status(404).json({ message: "No pits found" });
  }
});

export {
  createPit,
  getPits,
  updatePit,
  deletePit,
  getAllTaskPreData,
  getPitsByCorporation,
};
