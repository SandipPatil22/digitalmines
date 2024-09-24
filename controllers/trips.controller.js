import { json } from "express";
import { Trip } from "../models/Trips.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTrip = asyncHandler(async (req, res) => {
  const {
    pitId,
    section,
    benchId,
    loadingId,
    loadingOperatorId,
    dumperOperatorId,
    material,
    moistureContent,
    dumperId,
    tripStatus,
    subGrade,
    startTime,
  } = req.body;

  if (
    !pitId ||
    !section ||
    !benchId ||
    !loadingId ||
    !loadingOperatorId ||
    !dumperOperatorId ||
    !material ||
    !moistureContent ||
    !dumperId ||
    !tripStatus ||
    // !subGrade ||
    !startTime
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const corporationId = req?.user?.corporation;
  const account = req?.user?._id;

  const trip = await Trip.create({
    pit: pitId,
    section,
    bench: benchId,
    loading: loadingId,
    material,
    moistureContent,
    dumper: dumperId,
    subGrade: subGrade,
    loadingOperator: loadingOperatorId,
    dumperOperator: dumperOperatorId,
    tripStatus,
    loadingStartTime: startTime,
    createdBy: account,
    corporation: corporationId,
  });

  if (trip) {
    res.status(201).json({ message: "Trip started succesfully", data: trip });
  } else {
    return res.status(400).json({ message: "Error while creating trip" });
  }
});

const getTripByDate = asyncHandler(async (req, res) => {
  const corporationId = req?.user?.corporation;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const trip = await Trip.find({
    corporation: corporationId,
    updatedAt: {
      $gte: today,
      $lte: tomorrow,
    },
  })
    .populate("pit", "pitName")
    .populate("bench", "benchName benchLocation")
    .populate("loading", "unitId")
    .populate("dumper", "dumperNumber")
    .populate("loadingOperator", "operatorName")
    .populate("dumperOperator", "operatorName")
    .populate("destination", "destinationName destinationLocation");

  if (trip.length === 0) {
    return res.status(400).json({ message: "trip not found" });
  } else {
    res.status(200).json({ message: "trips featches succesfully", data: trip });
  }
});

const updateTrip = asyncHandler(async (req, res) => {
  const tripId = req.params.id;
  const { endTime } = req.body;

  if (!tripId) {
    return res.status(400).json({ message: "Trip Id not found" });
  }

  const trip = await Trip.findById(tripId);

  if (!trip) {
    return res.status(400).json({ message: "trip not found" });
  }

  const updatedData = { loadingEndTime: endTime };

  // if the material is waste set the tripStatus Completed
  if (trip.material === "Waste") {
    updatedData.tripStatus = "Complete";
  }

  // update the trip data
  const updatetrip = await Trip.findByIdAndUpdate(tripId, updatedData, {
    new: true,
  });

  if (updatetrip) {
    return res
      .status(200)
      .json({ message: "Trip updated succesfully ", data: updatetrip });
  } else {
    return res.status(400).json({ message: "Fail to update the trip data" });
  }
});

const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.tripId);

  if (trip) {
    trip.status = false;
    await trip.save();
    res.json({ message: "Trip removed" });
  } else {
    res.status(404).josn({ message: "trip not found" });
  }
});

const updateDestinationForTrip = asyncHandler(async (req, res) => {
  const tripId = req.params.id;
  const { feedback } = req.body;
  if (!tripId) {
    return res.status(400).json({ message: "Trip id is required" });
  }
  const trip = await Trip.findById(tripId);
  if (!trip) {
    return res.status(404).json({ message: "trip not found" });
  }

  const updatedData = await Trip.findByIdAndUpdate(tripId, {
    destination: req.body.destination,
    feedback,
  });
  if (updatedData) {
    return res
      .status(200)
      .json({ message: "Destination updated succesfully", data: updatedData });
  } else {
    return res
      .status(400)
      .josn({ message: "Error while updating the destination" });
  }
});

export {
  createTrip,
  getTripByDate,
  updateTrip,
  deleteTrip,
  updateDestinationForTrip,
};
