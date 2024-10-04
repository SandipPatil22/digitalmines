import { TripThree } from "../models/tripThree.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { mongoose } from "mongoose";
import { Plant } from "../models/Plant.model.js";
import { Stockpile } from "../models/stockpile.model.js";
import { Dumper } from "../models/dumper.model.js";
import { Loading } from "../models/loading.model.js";
import { Operator } from "../models/operator.model.js";
import { Destination } from "../models/destination.model.js";
import { Buyers } from "../models/buyers.model.js";



const getTripThreeData = asyncHandler(async (req, res) => {
  const corporationId = req?.user?.corporation;

  const tripthree = await TripThree.find({
    corporation: corporationId,
    status: true,
  })
    .populate("loading", "unitId")
    .populate("createdBy", "fullname")
    .populate("updatedBy", "fullname")
    .populate("plantId", "plantName")
    .populate("buyer", "name")
    .populate("stockpile", "StockpileName")
    .populate("dumper", "dumperNumber")
    .populate("loadingOperator", "operatorName")
    .populate("dumperOperator", "operatorName")
  .populate("destination", "destinationName destinationLocation");

  if (tripthree.length === 0) {
    return res.status(404).json({ message: "trip three data not found" });
  } else {
    return res
      .status(200)
      .json({ message: "trip three data featch succesfully" , data:tripthree});
  }
});

const updateTripthree = asyncHandler(async (req, res) => {
  const tripThreeID = req.params.id;
  const {
    loading,
    plantId,
    stockpile,
    loadingOperator,
    startTime,
    dumperOperator,
    dumper,

    weight,
    buyer,
    endTime,
    feedback,
    destination,
  } = req.body;

  const tripThreeExist = await TripThree.findById(tripThreeID);
  if (!tripThreeExist) {
    return res.status(404).json({ message: "trip not found " });
  }
  const account = req?.user?._id;
  const updatedtrip = await TripThree.findByIdAndUpdate(
    tripThreeID,
    {
      loading,
      plantId,
      stockpile,
      loadingOperator,
      startTime,
      dumperOperator,
      dumper,
      weight,
      buyer,
      feedback,
      destination,
      endTime,
      isweightDone: true,
      updatedBy: account,
    },
    { new: true }
  );

  if (updatedtrip) {
    res.status(200).json({
      message: " trip three  updated succesfully",
      data: updatedtrip,
    });
  } else {
    res.status(400).json({ message: "Failed to update trip three data  " });
  }
});

const deleteTripThree = asyncHandler(async (req, res) => {
  const tripthree = await TripThree.findById(req.params.id);

  if (tripthree) {
    tripthree.status = false;
    await tripthree.save();
    res.json({ message: " Removed Trip three data" });
  } else {
    res.status(404);
    throw new Error("trip three  not found ");
  }
});

const getPretripThreeData = asyncHandler(async (req, res) => {
  const plantId = await Plant.find({}, { plantName: 1, _id: 1 });
  const buyers = await Buyers.find({}, { name: 1, _id: 1 });
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
  const destination = await Destination.find(
    {},
    { destinationName: 1, _id: 1 }
  );

  if (plantId.length > 0) {
    return res.status(200).json({
      message: "feactching data Succesfully",
      data: {
        // plantId,
        // stockpileId,
        // loading,
        // loadingOperator,
        // dumper,
        // dumperOperator,
        destination,
        buyers,
      },
    });
  }
});

export {
  getTripThreeData,
  updateTripthree,
  deleteTripThree,
  getPretripThreeData,
};
