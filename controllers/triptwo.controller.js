import { TripTwo } from "../models/TripTwo.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Plant } from "../models/Plant.model.js";
import { Stockpile } from "../models/stockpile.model.js";
import { Dumper } from "../models/dumper.model.js";
import { Loading } from "../models/loading.model.js";
import { Operator } from "../models/operator.model.js";
import { Destination } from "../models/destination.model.js";
import moment from "moment-timezone";
import mongoose from "mongoose";

const minerals = ["Bauxite", "Aluminium", "sulphate"];

const createTriptwo = asyncHandler(async (req, res) => {
  const {
    loading,
    plantId,
    stockpile,
    loadingOperator,
    startTime,
    dumperOperator,
    dumper,
    minerals,
    tripStatus,
    weight,
  } = req.body;
  console.log(req.body);
  if (
    !loading ||
    !plantId ||
    !stockpile ||
    !loadingOperator ||
    !startTime ||
    !dumperOperator ||
    !dumper ||
    !minerals ||
    !tripStatus ||
    !weight
  ) {
    return res.status(404).json({ message: "All fields are required" });
  }
  const corporationId = req?.user?.corporation;
  const account = req?.user?._id;

  const tripTwo = await TripTwo.create({
    plantId,
    stockpile,
    loading,
    loadingOperator,
    minerals,
    dumperOperator,
    dumper,
    tripStatus,
    weight,
    loadingStartTime: startTime,
    createdBy: account,
    corporation: corporationId,
  });

  if (tripTwo) {
    res.status(201).json({
      message: "Loading Started successfully",
      data: tripTwo,
    });
  } else {
    res.status(400).json({ message: "Error while creating trip" });
  }
});

const getTripsTwoByDate = asyncHandler(async (req, res) => {
  const corporationId = req?.user?.corporation;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  console.log(corporationId);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const trips = await TripTwo.find({
    corporation: corporationId,
    updatedAt: {
      $gte: today,
      $lt: tomorrow,
    },
    tripStatus  :"InProgress"
  })
    .populate("plantId", "plantName")
    .populate("stockpile", "StockpileName")
    .populate("loading", "unitId")
    .populate("dumper", "dumperNumber")
    .populate("loadingOperator", "operatorName")
    .populate("dumperOperator", "operatorName");

  if (trips.length > 0) {
    const formatedTrips = trips.map((trip) => {
      const tripObject = trip.toObject();
      tripObject.createdAt = moment(trip.createdAt)
        .tz("Asia/Kolkata")
        .format("h:mm A");
      return tripObject;
    });

    return res.status(200).json({
      data: formatedTrips,
      message: "Trips fetched successfully",
    });
  } else {
    return res.status(404).json({ message: "No trips found" });
  }
});

const getCompletedTripByDate = asyncHandler(async (req, res) => {
  const corporationId = req?.user?.corporation;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  console.log(corporationId);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const trips = await TripTwo.find({
    corporation: corporationId,
    updatedAt: {
      $gte: today,
      $lt: tomorrow,
    },
    tripStatus: "Completed",
  })
    .populate("plantId", "plantName")
    .populate("stockpile", "StockpileName")
    .populate("loading", "unitId")
    .populate("dumper", "dumperNumber")
    .populate("loadingOperator", "operatorName")
    .populate("dumperOperator", "operatorName");

  if (trips.length > 0) {
    const formatedTrips = trips.map((trip) => {
      const tripObject = trip.toObject();
      tripObject.updatedAt = moment(trip.updatedAt)
        .tz("Asia/Kolkata")
        .format("h:mm A");
        tripObject.createdAt = moment(trip.createdAt)
        .tz("Asia/Kolkata")
        .format("h:mm A");
      return tripObject;
    });

    return res.status(200).json({
      data: formatedTrips,
      message: "Completed Trips fetched successfully",
    });
  } else {
    return res.status(404).json({ message: "No trips found" });
  }
});

const endTripTwo = asyncHandler(async (req, res) => {
  const tripId = req.params.id;

  console.log(tripId,'tsafdjasvh')
  const { endtime } = req.body;
  console.log(req.body, "sandip testing req bady");
 

  if (!mongoose.Types.ObjectId.isValid(tripId)) {
    return res.status(400).json({ message: "Invalid trip ID " });
  }

  const tripTwo = await TripTwo.findById(tripId);

  if (!tripTwo) {
    return res.status(404).josn({
      message: " Trip not found",
    });
  }

  const updatedTripTwo = await TripTwo.findByIdAndUpdate(
    tripId,
    {
      loadingEndTime: endtime,
      tripStatus: "Completed",
    },
    { new: true }
  );
  if (updatedTripTwo) {
    res.status(200).json({
      message: "Trip updated successfully",
      data: updatedTripTwo,
    });
  } else {
    res.status(400).json({ message: "Error while updating trip" });
  }
});

// const updateDestinationIdForTripTwo = asyncHandler(async (req, res) => {
//   const tripId = req.params.id;

//   if (!tripId) {
//     return res.status(404).json({ message: "TripId not found" });
//   }

//   const trip = await TripTwo.findById(tripId);
//   if (!trip) {
//     return res.status(404).json({ message: "Trip not found" });
//   }

//   const updateTripTwo = await TripTwo.findByIdAndUpdate(tripId, {
//     destination: req.body.destinationId,
//   });

//   if (updateTripTwo) {
//     res.status(200).json({
//       message: "Destination updated successfully",
//       data: updateTripTwo,
//     });
//   } else {
//     res.status(400).json({ message: "Error while updating destination" });
//   }
// });

const deleteTripTwo = asyncHandler(async (req, res) => {
  const trip = await TripTwo.findById(req.params.tripId);

  if (trip) {
    trip.status = false;
    await trip.save();
    res.json({
      message: "Trip Removed",
    });
  } else {
    res.status(404);
    throw new Error("trip not found");
  }
});

const getPreFeedingData = asyncHandler(async (req, res) => {
  const plantId = await Plant.find({}, { plantName: 1, _id: 1 });
  const stockpileId = await Stockpile.find({}, { StockpileName: 1, _id: 1 });
  const loading = await Loading.find(
    {},
    { operatorName: 1, unitId: 1, _id: 1 }
  );
  const dumper = await Dumper.find({}, { dumperNumber: 1, _id: 1 });
  const loadingOperator = await Operator.find(
    { role: "Loading" },
    { operatorName: 1, _id: 1 }
  );
  const dumperOperator = await Operator.find(
    { role: "Dumper" },
    { operatorName: 1, _id: 1 }
  );

  if (plantId.length > 0) {
    return res.status(200).json({
      message: "feactching data Succesfully",
      data: {
        plantId,
        stockpileId,
        loading,
        loadingOperator,
        dumper,
        dumperOperator,
        minerals,
      },
    });
  }
});
export {
  createTriptwo,
  getTripsTwoByDate,
  endTripTwo,
  deleteTripTwo,
  getPreFeedingData,
  getCompletedTripByDate,
};
