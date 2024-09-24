import { locale, relativeTimeRounding } from "moment-timezone";
import { Weighbridge } from "../models/weighbridge.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createWeighbridge = asyncHandler(async (req, res) => {
  const { WeighbridgeName } = req.body;
  const corporationId = req?.user?._id;

  if (!WeighbridgeName) {
    return res.status(400).json({ message: "all fields are required" });
  }

  const isExist = await Weighbridge.findOne(WeighbridgeName);
  if (isExist) {
    return res.status(400).json({ message: "weighbridge is already exist" });
  }
  const weighbridge = await Weighbridge.create({
    WeighbridgeName,
    corporation: corporationId,
  });

  if (weighbridge) {
    res
      .status(200)
      .json({ message: "weighbridge created succesfully", data: weighbridge });
  } else {
    return res
      .status(400)
      .json({ message: "Error while creating the weighbridge" });
  }
});

const getAllDumpersListByDay = asyncHandler(async (req, res) => {
  // Determine the start and end of the current day
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // use aggreation to find dumperinvolve in trips created within the day
  const dumperInTrips = await Trip.aggregate([
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
        form: "dumpers", //your collection name
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

  if (dumperInTrips.length > 0) {
    return res
      .status(200)
      .json({
        message: "Dummpers in the Trip featch succeafully",
        data: dumperInTrips,
      });
  } else {
    return res.status(400).json({ message: "NO dumper found in trip for day" });
  }
});
export { createWeighbridge };
