import { Loading } from "../models/loading.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createLoading = asyncHandler(async (req, res) => {
  const { unitId } = req?.body;

  if (!unitId) {
    return res.status(400).json({ message: "All field are required" });
  }

  const corporationId = req?.user?._id;
  const loading = await Loading.create({ unitId, corporation: corporationId });

  if (loading) {
    res
      .status(200)
      .json({ message: "Loading created succesfully", data: loading });
  } else {
    return res
      .status(400)
      .json({ message: "Error while creating the loading " });
  }
});

const getLoadings = asyncHandler(async (req, res) => {
  const corporationId = req?.user?._id;
  const loading = await Loading.find({
    corporation: corporationId,
    status: true,
  });

  if (loading.length > 0) {
    res
      .status(200)
      .json({ message: "Loading featched successfully", data: loading });
  } else {
    return res.status(400).json({ message: "No loading found" });
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
    return res
      .status(200)
      .json({ message: "Loading updated succesfully", data: loading });
  } else {
    return res.status(400).json({ message: "failed to update loading" });
  }
});

export { createLoading, getLoadings, updateLoading, deleteLoading };
