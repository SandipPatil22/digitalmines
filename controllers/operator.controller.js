import { Operator } from "../models/operator.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createOperator = asyncHandler(async (req, res) => {
  const { operatorName, contactNumber, role } = req.body;

  if (!operatorName || !contactNumber || !role) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const corporationId = req?.user?._id;
  const operator = await Operator.create({
    operatorName,
    contactNumber,
    role,
    corporation: corporationId,
  });

  if (operator) {
    res.status(201).json({
      message: "Operator created successfully",
      data: operator,
    });
  } else {
    res.status(400);
    throw new Error("Error while creating operator ");
  }
});

const getOperators = asyncHandler(async (req, res) => {
  const corporationId = req?.user?._id;
  const operators = await Operator.find({
    corporation: corporationId,
    status: true,
  });

  if (operators.length > 0) {
    res.status(200).json({
      message: "Operators fetched successfully",
      data: operators,
    });
  } else {
    res.status(404).json({ message: "No operators found" });
  }
});

const deleteOperator = asyncHandler(async (req, res) => {
  const operator = await Operator.findById(req.params.id);

  if (operator) {
    operator.status = false;
    await operator.save();
    res.json({ message: "Operator Removed" });
  } else {
    res.status(404);
    throw new Error("operator not found");
  }
});

const updateOperator = asyncHandler(async (req, res) => {
  const { operatorName, contactNumber, role } = req.body;

  const operator = await Operator.findByIdAndUpdate(
    req.params.id,
    { operatorName, contactNumber, role },
    { new: true }
  );
  console.log(req.body,"operator data")
  if (operator) {
    return res
      .status(200)
      .json({ message: "operator update succesfully", data: operator });
  } else {
    return res.status(400).json({ message: "failed to update the operator" });
  }
});
export { createOperator, getOperators, deleteOperator, updateOperator };
