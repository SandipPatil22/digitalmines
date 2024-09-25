import { Destination } from "../models/destination.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createDestination = asyncHandler(async (req, res) => {
  const { destinationName, destinationLocation, destinationType } = req?.body;

  const destinationExists = await Destination.findOne({
    destinationName,
  });

  if (destinationExists) {
    res.status(400).json({ message: "Destination already exists" });
    throw new Error("Destination already exists");
  }
  const corporationId = req?.user?._id;
  const destination = await Destination.create({
    destinationName,
    destinationLocation,
    destinationType,
    corporation: corporationId,
  });

  if (destination) {
    res.status(200).json({
      message: "Destination created successfully",
      data: destination,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Destination data");
  }
});

const getDestinations = asyncHandler(async (req, res) => {
  const corporationId = req?.user?._id;
  const destinations = await Destination.find({
    corporation: corporationId,
    status: true,
  });

  if (destinations.length > 0) {
    res.status(200).json({
      message: "Destinations fetched successfully",
      data: destinations,
    });
  } else {
    res.status(404).json({ message: "No destinations found" });
  }
});

const deleteDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (destination) {
    destination.status = false;
    await destination.save();
    return res.status(200).json({
      message: " Destination removed",
    });
  } else {
    res.status(404);
    throw new Error("Destination not found");
  }
});

const updateDestination = asyncHandler(async (req, res) => {
  const { destinationName, destinationLocation, destinationType } = req.body;

  const destinationUpdate = await Destination.findByIdAndUpdate(
    req.params.id,
    { destinationName, destinationLocation, destinationType },
    { new: true }
  );

  if (destinationUpdate) {
    return res
      .status(200)
      .json({
        message: "desttination updated succesfully",
        data: destinationUpdate,
      });
  } else {
    return res
      .status(400)
      .json({ message: "failed to update the destination" });
  }
});
export {
  createDestination,
  getDestinations,
  deleteDestination,
  updateDestination,
};
