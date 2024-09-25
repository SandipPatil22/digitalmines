import { Dumper } from "../models/dumper.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createDumper = asyncHandler(async (req, res) => {
  const { dumperNumber, dumperCapacity } = req.body;

  if (!dumperNumber || !dumperCapacity) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const corporationId = req?.user?._id;
  const dumper = await Dumper.create({
    dumperNumber,
    dumperCapacity,
    // operatorName,
    corporation: corporationId,
  });

  if (dumper) {
    res.status(201).json({
      message: "Dumper created successfully",
      data: dumper,
    });
  } else {
    res.status(400);
    throw new Error("Error while creating dumper ");
  }
});

const getDumpers = asyncHandler(async (req, res) => {
  const corporationId = req?.user?._id;
  const dumpers = await Dumper.find({
    corporation: corporationId,
    status: true,
  });

  if (dumpers.length > 0) {
    res.status(200).json({
      message: "Dumpers fetched successfully",
      data: dumpers,
    });
  } else {
    res.status(404).json({ message: "No dumpers found" });
  }
});

const deleteDumper = asyncHandler(async (req, res) => {
  const dumper = await Dumper.findById(req.params.id);

  if (dumper) {
    dumper.status = false;
    await dumper.save();
    return res.status(200).json({
      message: "Dumper removed ",
    });
  } else {
    res.status(404);
    throw new Error("Dumper not found");
  }
});

const updateDumper = asyncHandler(async (req, res) => {
  const { dumperNumber, dumperCapacity } = req.body;

  const dumper = await Dumper.findByIdAndUpdate(
    req.params.id,
    { dumperNumber, dumperCapacity },
    { new: true }
  );

  if (dumper) {
    return res
      .status(200)
      .json({ message: "Dumper updated succeesfully", data: dumper });
  } else {
    return res.status(400).json({ message: "failed to update the dumper" });
  }
});
export { createDumper, getDumpers, deleteDumper, updateDumper };
