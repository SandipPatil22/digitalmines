import { Dumper } from "../models/dumper.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createDumper = asyncHandler(async (req, res) => {
  const { dumperNumber, dumperCapacity } = req.body;
  if (!dumperNumber || !dumperCapacity) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const corporationId = req?.user?._id;
  const dumper = await Dumper.create({
    dumperCapacity,
    dumperNumber,
    corporation: corporationId,
  });
  if (dumper) {
    res
      .status(200)
      .json({ message: "Dumper created succesfully", data: dumper });
  } else {
    return res.status(400).json({ message: "Error to create the dumper" });
  }
});

const getDumpers = await asyncHandler(async (req, res) => {
  const corporationId = req?.user?._id;
  const dumpers = await Dumper.find({
    corporation: corporationId,
    status: true,
  });

  if (dumpers.length > 0) {
    res.status(200).json({
      message: "Dumper featched succeafully",
      data: dumpers,
    });
  } else {
    return res.status(400).json({ message: "No dumper found" });
  }
});

const updateDumper = await asyncHandler(async (req, res) => {
  const { dumperNumber, dumperCapacity } = req.body;

  const dumper = await Dumper.findByIdAndUpdate(
    req.params.id,
    { dumperNumber, dumperCapacity },
    { new: true }
  );

  if (dumper) {
    return res
      .status(200)
      .json({ message: "Dumper updated succesfully", data: dumper });
  } else {
    return res.status(400).json({ message: "Dumper not found" });
  }
});

const deleteDumper = await asyncHandler(async (req, res) => {
  const dumper = await Dumper.findById(req.params.id);

  if (dumper) {
    dumper.status = false;
    await dumper.save();
    res.status(200).json({ message: "Dumper removed" });
  } else {
    return res.status(400).json({ message: "Dumper not found" });
  }
});

export { createDumper, getDumpers, deleteDumper, updateDumper };
