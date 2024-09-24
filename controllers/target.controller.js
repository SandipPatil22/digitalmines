import { Target } from "../models/target.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTarget = asyncHandler(async (req, res) => {
  const { target, month, year } = req.body;

  if (!target || !month || !year) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newTagret = await Target.create({
    target,
    month,
    year,
    corporation: req.user._id,
    createdBy: req.user._id,
  });

  if (newTagret) {
    return res
      .status(200)
      .json({ message: "Target created succesfully", data: newTagret });
  } else {
    return res.status(400).json({ message: "Failed to create target" });
  }
});

const getTarget = asyncHandler(async (req, res) => {
  const corporationId = req?.user?._id;
  const target = await Target.find({
    corporation: corporationId,
    status: true,
  });

  if (target.length > 0) {
    return res
      .status(200)
      .json({ message: "featch target succesfully", data: target });
  } else {
    return res.status(400).json({ message: "fail to featch data" });
  }
});

const updateTarget = asyncHandler(async (req, res) => {
    const { target, month, year } = req.body;
    const updatetarget = await Target.findByIdAndUpdate(
      req.params.id,
      { target, month, year },
      { new: true }
    );
  
    if (updatetarget) {
      return res
        .status(200)
        .json({ message: "target updated succesfully", data: updatetarget });
    } else {
      return res.status(400).json({ message: "failed to update target" });
    }
  });

export {getTarget,createTarget,updateTarget};
