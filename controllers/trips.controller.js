import { Trip } from "../models/Trips.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTrip = asyncHandler(async (req, res) => {
  const {
    pitId,
    section,
    benchId,
    loadingId,
    loadingOperatorId,
    dumperOperatorId,
    material,
    moistureContent,
    dumperId,
    tripStatus,
    subGrade,
    startTime,
    destinationId,
  } = req.body;
  console.log(req.body);
  if (
    !pitId ||
    !section ||
    !benchId ||
    !loadingId ||
    !material ||
    !moistureContent ||
    !dumperId ||
    // !subGrade||
    !loadingOperatorId ||
    !dumperOperatorId ||
    !tripStatus ||
    !startTime
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const corporationId = req?.user?.corporation;
  const account = req?.user?._id;

  const trip = await Trip.create({
    pit: pitId,
    section,
    bench: benchId,
    loading: loadingId,
    material,
    moistureContent,
    dumper: dumperId,
    subGrade: subGrade,
    loadingOperator: loadingOperatorId,
    dumperOperator: dumperOperatorId,
    tripStatus,
    loadingStartTime: startTime,
    createdBy: account,
    corporation: corporationId,
    destination: destinationId,
  });

  if (trip) {
    res.status(201).json({
      message: "Loading Started successfully",
      data: trip,
    });
  } else {
    res.status(400).json({ message: "Error while creating trip" });
  }
});

const getTripsByDate = asyncHandler(async (req, res) => {
  const corporationId = req?.user?.corporation;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Initial query to get trips for the day
  let trips = await Trip.find({
    corporation: corporationId,
    updatedAt: {
      $gte: today,
      $lt: tomorrow,
    },
  })
    .populate("pit", "pitName")
    .populate("bench", "benchName benchLocation")
    .populate("loading", "unitId")
    .populate("dumper", "dumperNumber")
    .populate("loadingOperator", "operatorName")
    .populate("dumperOperator", "operatorName")
    .populate("destination", "destinationName destinationLocation");

  // Filter trips with missing destination
  const tripsMissingDestination = trips.filter((trip) => !trip.destination);

  // If any trips are missing their destination, re-fetch them
  if (tripsMissingDestination.length > 0) {
    console.log(
      `${tripsMissingDestination.length} trips missing destination, re-fetching...`
    );

    // Re-fetch the trips with missing destination and populate the destination field
    const refetchedTrips = await Promise.all(
      tripsMissingDestination.map(async (trip) => {
        return await Trip.findById(trip._id)
          .populate("pit", "pitName")
          .populate("bench", "benchName benchLocation")
          .populate("loading", "unitId")
          .populate("dumper", "dumperNumber")
          .populate("loadingOperator", "operatorName")
          .populate("dumperOperator", "operatorName")
          .populate("destination", "destinationName destinationLocation");
      })
    );

    // Merge refetched trips back into the original trips array
    trips = trips.map((trip) => {
      if (!trip.destination) {
        const refetchedTrip = refetchedTrips.find((rTrip) =>
          rTrip._id.equals(trip._id)
        );
        return refetchedTrip || trip;
      }
      return trip;
    });
  }

  if (trips.length === 0) {
    return res.status(404).json({ message: "No trips found" });
  } else {
    return res.status(200).json({
      data: trips,
      message: "Trips fetched successfully",
    });
  }
});

const updateTrip = asyncHandler(async (req, res) => {
  const tripId = req.params.id;
  const { endTime } = req.body;
  console.log(req.body);
  if (!tripId) {
    return res.status(404).json({ message: "Trip Id is required" });
  }

  const trip = await Trip.findById(tripId);

  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }

  // Prepare the update object
  const updateData = { loadingEndTime: endTime };

  // If the material is 'Waste', set tripStatus to 'Complete'
  if (trip.material === "Waste") {
    updateData.tripStatus = "Completed";
  }

  // Update the trip with the new data
  const updatedTrip = await Trip.findByIdAndUpdate(tripId, updateData, {
    new: true, // Returns the updated document
  });

  // const updatedTrip = await Trip.findByIdAndUpdate(tripId, {
  //   loadingEndTime: endTime,

  // });
  console.log(updatedTrip, "updated trip data ");
  if (updatedTrip) {
    return res.status(200).json({
      message: "Trip updated successfully",
      data: updatedTrip,
    });
  } else {
    return res.status(400).json({ message: "Error while updating trip" });
  }
});

const UpdateDestinationIdForTrip = asyncHandler(async (req, res) => {
  const tripId = req.params.id;
  const { feedback } = req.body;
  console.log(req.body, "req body");
  if (!tripId) {
    return res.status(404).json({ message: "Trip Id is required" });
  }
  // if (!feedback) {
  //   return res.status(404).json({ message: "Feedback is required" });
  // }
  const trip = await Trip.findById(tripId);
  if (!trip) {
    return res.status(404).json({ message: "Trip not found" });
  }
  const updatedTrip = await Trip.findByIdAndUpdate(tripId, {
    destination: req.body.destinationId,
    feedback,
  });
  console.log(updatedTrip, "update destination");
  if (updatedTrip) {
    return res.status(200).json({
      message: "Destination updated successfully",
      data: updatedTrip,
    });
  } else {
    return res
      .status(400)
      .json({ message: "Error while updating destination" });
  }
});

const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.tripId);

  if (trip) {
    trip.status = false;
    await trip.save();
    res.json({ message: "Trip removed" });
  } else {
    res.status(404).josn({ message: "trip not found" });
  }
});

export {
  createTrip,
  getTripsByDate,
  updateTrip,
  UpdateDestinationIdForTrip,
  deleteTrip,
};
