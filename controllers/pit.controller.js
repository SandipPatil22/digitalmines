import { Bench } from "../models/bench.model.js";
import { Destination } from "../models/destination.model.js";
import { Dumper } from "../models/dumper.model.js";
import { Loading } from "../models/loading.model.js";
import { Operator } from "../models/operator.model.js";
import { Pit } from "../models/pit.model.js";
import { Mines } from "../models/mines.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Trip } from "../models/Trips.model.js";
import { Shift } from "../models/shift.model.js";
import { Plant } from "../models/Plant.model.js";

const minerals = ["Bauxite", "Waste", "SubGrade", "Top Soil"];

const section = ["Section A", "Section B", "Section C", "Section D"];

const moistureContent = ["0%", "5%", "10%", "15%"];

const subGrade = [
  "Rom 1",
  "Rom 2",
  "Rom 3",
  // "50% to below 55% Al2O3",
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

  const pitExists = await Pit.findOne({ pitCode });

  if (pitExists) {
    res.status(400);
    throw new Error("Pit already exists");
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
    res.status(200).json({
      message: "Pit created successfully",
      data: pit,
    });
  }
});

const getPits = asyncHandler(async (req, res) => {
  const mineId = req.params.mineId;
  const corporationId = req?.user?._id;
  if (!mineId) {
    return res.status(400).json({ message: "Mine ID is required" });
  }
  const pits = await Pit.find({
    mineId: mineId,
    corporation: corporationId,
    status: true,
  });

  if (pits.length > 0) {
    return res.status(200).json({
      message: "Pits fetched successfully",
      data: pits,
    });
  } else {
    return res.status(404).json({ message: "No pits found" });
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

  const pit = await Pit.findById(req.params.pitId);
  if ((pit.status = false)) {
    return res.status(400).json({ message: "pit not found" });
  }

  if (pit) {
    pit.pitCode = pitCode;
    pit.pitName = pitName;
    pit.mineralsName = mineralsName;
    pit.locationcoords = locationcoords;
    pit.pitArea = pitArea;
    pit.pitLength = pitLength;
    pit.pitWidth = pitWidth;
    pit.pitDepth = pitDepth;
    pit.status = status;
    pit.mineId = mineId;
    pit.status = true;

    const updatedPit = await pit.save();
    res.status(200).json({
      message: "Pit updated successfully",
      data: updatedPit,
    });
  } else {
    res.status(404);
    throw new Error("Pit not found");
  }
});

const getAllTaskPreData = asyncHandler(async (req, res) => {
  const pits = await Pit.find({}, { pitCode: 1, pitName: 1, _id: 1 });
  const plants = await Plant.find({}, { plantName: 1, _id: 1 });
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
  // const dumper = await Dumper.aggregate([
  //   {
  //     $lookup: {
  //       from: "trips",
  //       localField: "_id",
  //       foreignField: "dumper",
  //       as: "trips", // Join trips for each dumper
  //     },
  //   },
  //   {
  //     $match: {
  //       $or: [
  //         { trips: { $eq: [] } }, // Dumpers with no trips at all
  //         { "trips.tripStatus": { $ne: "InProgress" } }, // Dumpers with trips not in "InProgress" status
  //       ],
  //     },
  //   },

  //   {
  //     $project: {
  //       _id: 1,
  //       dumperNumber: 1,
  //       // Include any additional fields as necessary
  //     },
  //   },
  //   {
  //     $sort: {
  //       dumperNumber: 1, // Sort by dumperNumber in ascending order
  //     },
  //   },
  // ]);

  // ====================this is updated for delay the dumper

  const now = new Date();
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

  const dumper = await Dumper.aggregate([
    {
      $lookup: {
        from: "trips",
        localField: "_id",
        foreignField: "dumper",
        as: "trips", // Join trips for each dumper
      },
    },
    {
      $addFields: {
        shouldHide: {
          $cond: [
            { $eq: [{ $size: "$trips" }, 0] }, // No trips
            false, // Always show if no trips
            {
              $or: [
                // Condition for trips with material "Waste"
                {
                  $and: [
                    {
                      $eq: [{ $arrayElemAt: ["$trips.material", 0] }, "Waste"],
                    }, // Trip material is "Waste"
                    {
                      $gte: [
                        { $arrayElemAt: ["$trips.createdAt", 0] },
                        tenMinutesAgo,
                      ],
                    }, // Trip created within the last 10 minutes
                  ],
                },
                // Condition for trips with materials other than "Waste" that are InProgress
                {
                  $and: [
                    {
                      $ne: [{ $arrayElemAt: ["$trips.material", 0] }, "Waste"],
                    }, // Not Waste
                    {
                      $eq: [
                        { $arrayElemAt: ["$trips.tripStatus", 0] },
                        "InProgress",
                      ],
                    }, // Trip is in progress
                  ],
                },
              ],
            },
          ],
        },
      },
    },
    {
      $match: {
        shouldHide: false, // Show dumpers that are not hidden
      },
    },
    {
      $project: {
        _id: 1,
        dumperNumber: 1,
        // Include any additional fields as necessary
      },
    },
    {
      $sort: {
        dumperNumber: 1, // Sort by dumperNumber in ascending order
      },
    },
  ]);

  // console.log(dumper);
  const loadingOperator = await Operator.find(
    { role: "Loading" },
    { operatorName: 1, _id: 1 }
  );
  // const dumperOperator = await Operator.aggregate([
  //   {
  //     $match: {
  //       role: "Dumper", // Only consider operators with the "Dumper" role
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "trips", // Join the trips collection
  //       localField: "_id", // Link based on dumperOperator id
  //       foreignField: "dumperOperator", // Match with the dumperOperator field in trips
  //       as: "trips", // Output as an array of trips for each operator
  //     },
  //   },
  //   {
  //     $match: {
  //       $or: [
  //         { trips: { $size: 0 } }, // Include operators with no trips at all
  //         { "trips.tripStatus": { $ne: "InProgress" } }, // Exclude operators in "InProgress" trips
  //       ],
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 1,
  //       operatorName: 1,
  //       // Include any additional fields as necessary
  //     },
  //   },
  //   {
  //     $sort: {
  //       operatorName: 1, // Sort by dumperNumber in ascending order
  //     },
  //   },
  // ]);

  const dumperOperator = await Operator.aggregate([
    {
      $match: {
        role: "Dumper", // Only consider operators with the "Dumper" role
      },
    },
    {
      $lookup: {
        from: "trips", // Join the trips collection
        localField: "_id", // Link based on dumperOperator id
        foreignField: "dumperOperator", // Match with the dumperOperator field in trips
        as: "trips", // Output as an array of trips for each operator
      },
    },
    {
      $addFields: {
        shouldHide: {
          $cond: [
            { $eq: [{ $size: "$trips" }, 0] }, // No trips
            false, // Always show if no trips
            {
              $or: [
                // Condition for trips with material "Waste"
                {
                  $and: [
                    {
                      $eq: [{ $arrayElemAt: ["$trips.material", 0] }, "Waste"],
                    }, // Trip material is "Waste"
                    {
                      $gte: [
                        { $arrayElemAt: ["$trips.createdAt", 0] },
                        tenMinutesAgo,
                      ],
                    }, // Trip created within the last 10 minutes
                  ],
                },
                // Condition for trips with materials other than "Waste" that are InProgress
                {
                  $and: [
                    {
                      $ne: [{ $arrayElemAt: ["$trips.material", 0] }, "Waste"],
                    }, // Not Waste
                    {
                      $eq: [
                        { $arrayElemAt: ["$trips.tripStatus", 0] },
                        "InProgress",
                      ],
                    }, // Trip is in progress
                  ],
                },
              ],
            },
          ],
        },
      },
    },
    {
      $match: {
        shouldHide: false, // Show dumperOperators that are not hidden
      },
    },
    {
      $project: {
        _id: 1,
        operatorName: 1,
        // Include any additional fields as necessary
      },
    },
    {
      $sort: {
        operatorName: 1, // Sort by operatorName in ascending order
      },
    },
  ]);
  const destinationStockpile = await Destination.find(
    // { destinationType: "Stockpile" },
    {
      $or: [
        { destinationType: "Stockpile" },
        // { destinationType: "Plant" }
      ],
    },
    { destinationName: 1, destinationLocation: 1, _id: 1 }
  );

  const destinationWaste = await Destination.find(
    { destinationType: "Dumpyard" },
    { destinationName: 1, destinationLocation: 1, _id: 1 }
  );

  // shift data
  const userId = req.user._id;
  // Find the shift created by the user on the current day
  const shift = await Shift.findOne({
    createdBy: userId,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  })
    .select("section")
    .populate("loadingUnit", "unitId")
    .populate("pit", "pitName");

  if (pits) {
    res.status(200).json({
      message: "All task data fetched successfully",
      data: {
        // pits,
        // section,
        shiftData: shift,
        bench: bench,
        // loading,
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
  deletePit,
  updatePit,
  getAllTaskPreData,
  getPitsByCorporation,
};
