import { Loading } from "../models/loading.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createLoading = asyncHandler(async (req, res) => {
  const { unitId } = req?.body;

  if (!unitId) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const corporationId = req?.user?._id;
  const loading = await Loading.create({
    // operatorName,
    unitId,
    corporation: corporationId,
  });

  if (loading) {
    res.status(201).json({
      message: "Loading created successfully",
      data: loading,
    });
  } else {
    res.status(400);
    throw new Error("Error while creating loading ");
  }
});

const getLoadings = asyncHandler(async (req, res) => {
  const corporationId = req?.user?._id;
  const loadings = await Loading.find({
    corporation: corporationId,
    status: true,
  });

  if (loadings.length > 0) {
    res.status(200).json({
      message: "Loadings fetched successfully",
      data: loadings,
    });
  } else {
    res.status(404).json({ message: "No loadings found" });
  }
});

const deleteLoading = asyncHandler(async (req, res) => {
  const loading = await Loading.findById(req.params.id);
  if (loading) {
    loading.status = false;
    await loading.save();
    res.json({ message: "Loading Removed" });
  } else {
    res.status(404);
    throw new Error("Loading not found");
  }
});

const updateLoading = asyncHandler(async (req, res) => {
  const { unitId } = req.body;

  const loading = await Loading.findByIdAndUpdate(
    req.params.id,
    { unitId },
    { new: true }
  );

  if (loading) {
    return res.status(200).json({ message: "Loading updated succesfully",data :loading });
  } else {
    return res.status(400).json({ message: "failed to update loading" });
  }
});

export { createLoading, getLoadings, deleteLoading,updateLoading };
