import { populate } from "dotenv";
import { Bench } from "../models/bench.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createBench = asyncHandler(async (req, res) => {
  const { pitId, benchName, benchLocation } = req?.body;

  if (!pitId || !benchName || !benchLocation) {
    res.status(400).json({ message: "All fields are required" });
  }
  const corporationId = req?.user?._id;

  const bench = await Bench.create({
    pit: pitId,
    benchName,
    benchLocation,
    corporation: corporationId,
  });

  if (bench) {
    res.status(201).json({
      message: "Bench created successfully",
      data: bench,
    });
  } else {
    res.status(400).json({ message: "Error while creating bench" });
  }
});

const getBenchByPitId = asyncHandler(async (req, res) => {
  const { pitId } = req?.params;
  const corporationId = req?.user?.corporation;
  if (!pitId) {
    res.status(400).json({ message: "Pit Id is required" });
  }

  const bench = await Bench.find({
    corporation: corporationId,
    status: true,
    pit: pitId,
  }).populate("pit");

  if (bench) {
    res.status(200).json({
      message: "Bench fetched successfully",
      data: bench,
    });
  } else {
    res.status(400).json({ message: "Error while fetching bench" });
  }
});

const getAllBenches = asyncHandler(async (req, res) => {
  const corporationId = req?.user?._id;
  console.log(corporationId);
  const benches = await Bench.find({
    corporation: corporationId,
    status: true,
  }).populate({ path: "pit", populate: { path: "mineId" } });
  if (benches) {
    res.status(200).json({
      message: "Benches fetched successfully",
      data: benches,
    });
  } else {
    res.status(400).json({ message: "Error while fetching benches" });
  }
});

const updateBench = asyncHandler(async (req, res) => {
  const { pitId, benchName, benchLocation } = req.body;
  const bench = await Bench.findByIdAndUpdate(
    req.params.id,
    { pitId, benchName, benchLocation },
    { new: true }
  );

  if (bench) {
    return res.status(200).json({ message: "bench updated succesfully" });
  } else {
    return res.status(400).json({ message: "failed to update bench" });
  }
});
const deleteBenches = asyncHandler(async (req, res) => {
  const bench = await Bench.findById(req.params.id);

  if (bench) {
    bench.status = false;
    await bench.save();
    res.json({ message: "Beches removed" });
  } else {
    res.status(404);
    throw new Error("Benches not found");
  }
});
export {
  createBench,
  getBenchByPitId,
  getAllBenches,
  deleteBenches,
  updateBench,
};
