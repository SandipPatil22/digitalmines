import { PlantProcessProduct } from "../models/plantProcess.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { mongoose } from "mongoose";
import { Plant } from "../models/Plant.model.js";
import { Stockpile } from "../models/stockpile.model.js";
import { Dumper } from "../models/dumper.model.js";
import { Loading } from "../models/loading.model.js";
import { Operator } from "../models/operator.model.js";
import { Destination } from "../models/destination.model.js";
import { Buyers } from "../models/buyers.model.js";
import { TripThree } from "../models/tripThree.model.js";
const minerals = ["Bauxite", "Aluminium"];

const createPlantProcessProduct = asyncHandler(async (req, res) => {
  const {
    loading,
    plantId,
    // stockpile,
    loadingOperator,
    startTime,
    dumperOperator,
    dumper,
    // weight,
    // buyer,
    feedback,
    // destination,
  } = req.body;

  if (
    !loading ||
    !plantId ||
    // !stockpile ||
    !loadingOperator ||
    !startTime ||
    !dumperOperator ||
    !dumper
    // !weight ||
    // !buyer ||

    // !destination
  ) {
    return res.status(404).json({ message: "All fields are required" });
  }

  const corporationId = req?.user?.corporation;
  const account = req?.user?._id;

  const idsToValidate = [
    dumper,
    dumperOperator,
    loading,
    loadingOperator,
    // destination,
    plantId,
    // stockpile,
  ];

  // Check each ID individually
  for (const id of idsToValidate) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
  }

  const PlantPP = await PlantProcessProduct.create({
    loading,
    plantId,
    // stockpile,
    loadingOperator,
    startTime,
    dumperOperator,
    dumper,
    // weight,
    // buyer,
    feedback,
    createdBy: account,
    corporation: corporationId,
  });

  if (PlantPP) {
    const randomNum = Math.floor(1000 + Math.random() * 90000000);

    const trackingId = `TRP-${randomNum}`;

    await TripThree.create({
      loading,
      plantId,
      // stockpile,
      loadingOperator,
      startTime,
      dumperOperator,
      dumper,
      trackingId: trackingId,
      // weight,
      // buyer,
      feedback,
      createdBy: account,
      corporation: corporationId,
    });

    return res.status(200).json({
      message: " plant process product create succesfully",
      data: PlantPP,
    });
  } else {
    return res
      .status(400)
      .json({ message: "plant process product data not added " });
  }
});

const getPlantProcessProduce = asyncHandler(async (req, res) => {
  const corporationId = req?.user?.corporation;

  const plantPP = await PlantProcessProduct.find({
    corporation: corporationId,
    status: true,
  })
    .populate("loading", "unitId")
    .populate("createdBy", "fullname")
    .populate("updatedBy", "fullname")
    .populate("plantId", "plantName")
    // .populate("buyer", "name")
    // .populate("stockpile", "StockpileName")
    .populate("dumper", "dumperNumber")
    .populate("loadingOperator", "operatorName")
    .populate("dumperOperator", "operatorName");
  // .populate("destination", "destinationName destinationLocation");

  if (plantPP.length === 0) {
    return res.status(404).json({ message: "no plant process product found" });
  } else {
    return res.status(200).json({
      message: "plant process product data featch succesfully ",
      data: plantPP,
    });
  }
});

const updatePlantPP = asyncHandler(async (req, res) => {
  const plantPPID = req.params.id;
  const {
    loading,
    plantId,
    // stockpile,
    loadingOperator,
    startTime,
    dumperOperator,
    dumper,
    // weight,
    // buyer,
    endTime,
    feedback,
    // destination,
  } = req.body;

  const findPlantPP = await PlantProcessProduct.findById(plantPPID);
  if (!findPlantPP) {
    return res.status(404).json({ message: "Plant Process Product not found" });
  }

  const account = req?.user?._id;

  const plantPP = await PlantProcessProduct.findByIdAndUpdate(
    plantPPID,
    {
      loading,
      plantId,
      // stockpile,
      loadingOperator,
      startTime,
      dumperOperator,
      dumper,
      weight,
      // buyer,
      feedback,
      // destination,
      endTime,
      updatedBy: account,
    },
    { new: true }
  );

  if (plantPP) {
    res.status(200).json({
      message: " Plant process product updated succesfully",
      data: plantPP,
    });
  } else {
    res
      .status(400)
      .json({ message: "Failed to update Plant process product " });
  }
});

const deletPlantProcessProduct = asyncHandler(async (req, res) => {
  const plantPP = await PlantProcessProduct.findById(req.params.id);

  if (plantPP) {
    plantPP.status = false;
    await plantPP.save();
    res.json({ message: " plant process product Removed" });
  } else {
    res.status(404);
    throw new Error("plant process product not found ");
  }
});

const getPrePlantProcessProductData = asyncHandler(async (req, res) => {
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
        plantId,
        stockpileId,
        material: minerals,
        loading,
        loadingOperator,
        dumper,
        dumperOperator,
        // destination,
        // buyers,
      },
    });
  }
});

export {
  createPlantProcessProduct,
  getPlantProcessProduce,
  deletPlantProcessProduct,
  updatePlantPP,
  getPrePlantProcessProductData,
};
