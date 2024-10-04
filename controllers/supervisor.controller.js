// import {  User } from "../models/user.model.js";
import { Employee } from "../models/employee.model.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import s3Upload from "../global/s3.controller.js";
import { Target } from "../models/target.model.js";
import { Trip } from "../models/Trips.model.js";
import ExcelJS from "exceljs";
import { Pit } from "../models/pit.model.js";
import { Shift } from "../models/shift.model.js";
import { WeighbridgeShift } from "../models/weighbridgeShift.model.js";
import { StockpileShift } from "../models/stockpileShift.model.js";
import { DashboardSnapshot } from "../models/dashboardSnapshort.model.js";

const createSupervisor = asyncHandler(async (req, res) => {
  const { fname, lname, email, role, phone, address, mine } = req?.body;
  const corporationId = req?.user?._id;
  const supervisorExists = await Employee.findOne({ email });
  if (supervisorExists) {
    return res.status(400).json({ message: "Supervisor already exists" });
  }

  const fullname = `${fname} ${lname}`;

  const randomNum = Math.floor(1000 + Math.random() * 9000);

  const supervisorId = `SUP-${randomNum}`;

  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);

  let img;

  if (req.files && req.files.profilePicture) {
    const result = await s3Upload(req.files.profilePicture);
    img = result.results[0].Key; // Assuming s3Upload returns an array of results
  }
  console.log(corporationId);
  const supervisorData = {
    fname,
    lname,
    fullname,
    email,
    role,
    password,
    phone,
    address,
    mine,
    supervisorId,
    corporation: corporationId,
  };

  if (img) {
    supervisorData.profilePic = img;
  }

  const supervisor = await Employee.create(supervisorData);

  if (supervisor) {
    return res.status(200).json({
      message: "Supervisor created successfully",
      data: supervisor,
      password: password,
    });
  } else {
    return res.status(400).json({ message: "Invalid Supervisor data" });
  }
});

const loginSupervisor = asyncHandler(async (req, res) => {
  const { supervisorId, password } = req.body;

  const supervisor = await Employee.findOne({ supervisorId });

  if (!supervisor) {
    return res
      .status(401)
      .json({ message: "Invalid Supervisor ID or password" });
  }

  // Check if the supervisor is already logged in
  if (supervisor.isLoggedIn) {
    return res.status(403).json({
      message:
        "Supervisor is already logged in. Please log out before logging in again.",
    });
  }

  if (supervisor.password === password) {
    supervisor.isLoggedIn = true;
    await supervisor.save();
    res.status(200).json({
      message: "Supervisor login succesfully",
      _id: supervisor._id,
      supervisorId: supervisor.supervisorId,
      email: supervisor.email,
      phone: supervisor.phone,
      location: supervisor.address,
      mineId: supervisor.mine,
      token: generateToken(supervisor._id),
    });
  } else {
    res.status(401).json({ message: "Invalid Supervisor ID or password" });
  }
});

const logoutSupervisor = asyncHandler(async (req, res) => {
  const { supervisorId } = req.body;

  const supervisor = await Employee.findOne({ supervisorId });

  if (!supervisor) {
    return res.status(404).json({ message: "Supervisor not found" });
  }

  supervisor.isLoggedIn = false; // Reset the login status
  await supervisor.save();

  res.status(200).json({ message: "Logged out successfully" });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.body;
  // if(id){
  //   return res.status(404).json({message:"Id is required"})
  // }
  // const corporationId=  req?.user?._id
  const user = await Employee.findOne({ _id: id, status: true })
    .select("-password -fname -lname")
    .populate("mine")
    .populate("role");
  if (user) {
    return res
      .status(200)
      .json({ message: "User fetched successfully", data: user });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

const getSupervisor = asyncHandler(async (req, res) => {
  const supervisors = await Employee.find({
    corporation: req?.user?._id,
    status: true,
  })
    .populate("mine")
    .populate("role");

  if (supervisors.length > 0) {
    return res.status(200).json({
      message: "Supervisor featch seccesfully",
      data: supervisors,
    });
  } else {
    return res.status(404).json({
      message: " Supervisor data not found  ",
    });
  }
});

const deleteSupervisor = asyncHandler(async (req, res) => {
  const supervisor = await Employee.findById(req.params.supervisorId);

  if (supervisor) {
    supervisor.status = false;
    await supervisor.save();
    res.json({ message: "remove supervisor" });
  } else {
    res.status(404);
    throw new Error("supervisor not found");
  }
});

const updateSupervisor = asyncHandler(async (req, res) => {
  const {
    fname,
    lname,

    email,
    role,
    phone,
  } = req.body;

  const existingSupervisor = await Employee.findById(req.params.id);

  if (!existingSupervisor) {
    return res.status(404).json({ message: "Supervisor not found" });
  }

  const updatedFname = fname || existingSupervisor.fname;
  const updatedLname = lname || existingSupervisor.lname;

  // Update the fullname based on updated fname and lname
  const fullname = `${updatedFname} ${updatedLname}`;

  const update = await Employee.findByIdAndUpdate(
    req.params.id,
    {
      fname: updatedFname,
      lname: updatedLname,
      fullname,
      email,
      role,
      phone,
    },
    { new: true }
  );

  if (update) {
    return res
      .status(200)
      .json({ message: "Supervisor updated succesfully", data: update });
  } else {
    return res.status(400).json({ message: "Error updating Supervisor" });
  }
});

const getMaterialSupervisorDashboard = asyncHandler(async (req, res) => {
  const supervisor = await Employee.findById(req.user._id);
  if (!supervisor) {
    return res.status(404).json({ message: "Supervisor not found" });
  }

  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  // Fetch the shift based on supervisor's ID
  const shiftData = await Shift.findOne({
    createdBy: req.user._id,
  });

  const target = await Target.findOne({
    corporation: supervisor.corporation,
    status: true,
    month: currentMonth,
  });

  // retrive the trip data by day in future
  const trips = await Trip.find({
    corporation: supervisor.corporation,
    material: "Bauxite",
  });

  const ROM1 = await Trip.find({
    corporation: supervisor.corporation,
    material: "Bauxite",
    subGrade: "Rom 1",
  });

  const ROM2 = await Trip.find({
    corporation: supervisor.corporation,
    material: "Bauxite",
    subGrade: "Rom 2",
  });

  const ROM3 = await Trip.find({
    corporation: supervisor.corporation,
    material: "Bauxite",
    subGrade: "Rom 3",
  });

  // const ROM4 = await Trip.find({
  //   corporation: supervisor.corporation,
  //   material: "Bauxite",
  //   subGrade: "50% to below 55% Al2O3",
  // });

  const wasteTrips = await Trip.find({
    corporation: supervisor.corporation,
    material: "Waste",
  });

  const rom1weight = parseFloat(
    ROM1.reduce((acc, trip) => acc + Number(trip.weight), 0).toFixed(2)
  );

  const rom2weight = parseFloat(
    ROM2.reduce((acc, trip) => acc + Number(trip.weight), 0).toFixed(2)
  );

  const rom3weight = parseFloat(
    ROM3.reduce((acc, trip) => acc + Number(trip.weight), 0).toFixed(2)
  );

  // const rom4weight = ROM4.reduce((acc, trip) => acc + Number(trip.weight), 0);

  const totalWeight = trips.reduce((acc, trip) => acc + Number(trip.weight), 0);

  const totalTrips = await Trip.countDocuments({
    corporation: supervisor.corporation,
  });

  // Calculate the average moisture content
  const totalMoistureInMiniral = trips.reduce((total, trip) => {
    // Extract the moistureContent as a string and remove any percentage sign
    const moistureString = trip.moistureContent || "0";
    const moistureContent = parseFloat(moistureString.replace("%", "")) || 0; // Convert to a float

    return total + moistureContent;
  }, 0);
  console.log(totalMoistureInMiniral);

  // const averageMoistureInMiniral = totalMoistureInMiniral / trips.length;
  // // Reduce waste extracted by average moisture content
  // const reducedMiniralExtracted =
  //   totalWeight * (1 - averageMoistureInMiniral / 100);

  // const percentageComplete = Math.round(
  //   (Number(totalWeight) / target.materialTarget) * 100
  // );

  // const wasteExtracted = Number(wasteTrips?.length) * 17;

  const averageMoistureInMiniral =
    trips.length > 0 ? totalMoistureInMiniral / trips.length : 0;
  const reducedMiniralExtracted =
    totalWeight > 0 ? totalWeight * (1 - averageMoistureInMiniral / 100) : 0;

  const percentageComplete =
    target?.materialTarget > 0
      ? parseFloat(
          ((Number(totalWeight) / target.materialTarget) * 100).toFixed(2)
        )
      : 0;

  const wasteExtracted =
    wasteTrips.length > 0 ? Number(wasteTrips.length) * 17 : 0;

  // Calculate the average moisture content
  const totalMoisture = wasteTrips.reduce((total, trip) => {
    // Extract the moistureContent as a string and remove any percentage sign
    const moistureString = trip.moistureContent || "0";
    const moistureContent = parseFloat(moistureString.replace("%", "")) || 0; // Convert to a float

    return total + moistureContent;
  }, 0);

  // const averageMoisture = totalMoisture / wasteTrips.length;
  // // Reduce waste extracted by average moisture content
  // const reducedWasteExtracted = wasteExtracted * (1 - averageMoisture / 100);

  // const percentagewasteComplete = Math.round(
  //   (Number(reducedWasteExtracted) / target.wasteTarget) * 100
  // );

  const averageMoisture =
    wasteTrips.length > 0 ? totalMoisture / wasteTrips.length : 0;
  const reducedWasteExtracted =
    wasteExtracted > 0 ? wasteExtracted * (1 - averageMoisture / 100) : 0;

  const percentagewasteComplete =
    target?.wasteTarget > 0
      ? parseFloat(
          ((Number(reducedWasteExtracted) / target.wasteTarget) * 100).toFixed(
            2
          )
        )
      : 0;

  // mineral convertion tones to metercube
  const mineralExtractedMeterCube = reducedMiniralExtracted.toFixed(2) * 0.85;

  const totalRomWeight = rom1weight + rom2weight + rom3weight;

  const rom1Percentage =
    totalRomWeight > 0 ? (rom1weight / totalRomWeight) * 100 : 0;
  const rom2Percentage =
    totalRomWeight > 0 ? (rom2weight / totalRomWeight) * 100 : 0;
  const rom3Percentage =
    totalRomWeight > 0 ? (rom3weight / totalRomWeight) * 100 : 0;

  return res.status(200).json({
    message: "Supervisor dashboard data fetched successfully",
    data: {
      supervisor: supervisor.fullname,
      mineralTrips: trips.length,
      wasteTrips: wasteTrips.length,
      truckTrips: totalTrips,
      shift: shiftData.shiftName,
      wasteTarget: target?.wasteTarget,
      target: target?.materialTarget,
      mineralExtracted: reducedMiniralExtracted.toFixed(2),
      wasteExtracted: reducedWasteExtracted.toFixed(2),
      miniralinTotalHandle: mineralExtractedMeterCube.toFixed(2),
      percentageComplete: percentageComplete,
      percentageWasteComplete: percentagewasteComplete,
      percetageBar: percentageComplete,
      ROM1: {
        percentage: rom1Percentage.toFixed(2),
        rom1weight,
      },
      ROM2: {
        rom2weight,
        percentage: rom2Percentage.toFixed(2),
      },
      ROM3: {
        rom3weight,
        percentage: rom3Percentage.toFixed(2),
      },

      // ROM4: rom4weight,
    },
  });
});

const getMaterialSupervisorReport = asyncHandler(async (req, res) => {
  const supervisor = await Employee.findById(req.user._id);
  if (!supervisor) {
    return res.status(404).json({ message: "Supervisor not found" });
  }

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentDate = new Date().toLocaleDateString();

  // Fetch the shift based on supervisor's ID
  const shiftData = await Shift.findOne({
    createdBy: req.user._id,
  })
    .populate("pit")
    .populate("loadingUnit");
  console.log(shiftData.pit.pitName, "shift data");
  const shift = shiftData ? shiftData.shiftName : "Unknown Shift";
  const pitId = shiftData ? shiftData.pit.pitName : "Unknown Pit";
  const loadingUnit = shiftData
    ? shiftData.loadingUnit.unitId
    : "Unknown Loading Unit";

  // Convert machine start and end times to local time strings
  const machineStartTime = new Date(shiftData.machineStart);
  const machineEndTime = new Date(shiftData.machineEnd);

  const machineStartLocalTime = machineStartTime.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const machineEndLocalTime = machineEndTime.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // Calculate total machine time in hours
  const machineTotalTimeInMs = machineEndTime - machineStartTime;
  const machineTotalMinutes = Math.floor(
    (machineTotalTimeInMs / (1000 * 60)) % 60
  ); // minutes
  const machineTotalHours = Math.floor(machineTotalTimeInMs / (1000 * 60 * 60)); // hours

  let machineTotalTimeFormatted;
  if (machineTotalHours > 0) {
    machineTotalTimeFormatted = `${machineTotalHours} hours, ${machineTotalMinutes} minutes`;
  } else {
    machineTotalTimeFormatted = `${machineTotalMinutes} minutes`;
  }

  const target = await Target.findOne({
    corporation: supervisor.corporation,
    status: true,
    month: currentMonth,
  });

  const trips = await Trip.find({
    corporation: supervisor.corporation,
    material: "Bauxite",
  });
  const tripsForLoading = await Trip.find({
    corporation: supervisor.corporation,
    material: "Bauxite",
    createdBy: req.user._id,
  });

  // Total loading time calculation
  let totalLoadingTimeInMs = 0;
  tripsForLoading.forEach((trip) => {
    const loadingStartTime = new Date(trip.loadingStartTime);
    const loadingEndTime = new Date(trip.loadingEndTime);
    totalLoadingTimeInMs += loadingEndTime - loadingStartTime;
  });

  const totalLoadingMinutes = Math.floor(
    (totalLoadingTimeInMs / (1000 * 60)) % 60
  );
  const totalLoadingHours = Math.floor(totalLoadingTimeInMs / (1000 * 60 * 60));

  let totalLoadingTimeFormatted;
  if (totalLoadingHours > 0) {
    totalLoadingTimeFormatted = `${totalLoadingHours} hours, ${totalLoadingMinutes} minutes`;
  } else {
    totalLoadingTimeFormatted = `${totalLoadingMinutes} minutes`;
  }

  const ROM1 = await Trip.find({
    corporation: supervisor.corporation,
    material: "Bauxite",
    subGrade: "Rom 1",
  });

  const ROM2 = await Trip.find({
    corporation: supervisor.corporation,
    material: "Bauxite",
    subGrade: "Rom 2",
  });

  const ROM3 = await Trip.find({
    corporation: supervisor.corporation,
    material: "Bauxite",
    subGrade: "Rom 3",
  });

  // const ROM4 = await Trip.find({
  //   corporation: supervisor.corporation,
  //   material: "Bauxite",
  //   subGrade: "50% to below 55% Al2O3",
  // });

  const wasteTrips = await Trip.find({
    corporation: supervisor.corporation,
    material: "Waste",
  });

  // Calculate weights and totals
  const rom1weight = ROM1.reduce((acc, trip) => acc + Number(trip.weight), 0);
  const rom2weight = ROM2.reduce((acc, trip) => acc + Number(trip.weight), 0);
  const rom3weight = ROM3.reduce((acc, trip) => acc + Number(trip.weight), 0);
  // const rom4weight = ROM4.reduce((acc, trip) => acc + Number(trip.weight), 0);
  const totalWeight = trips.reduce((acc, trip) => acc + Number(trip.weight), 0);
  const totalTrips = await Trip.countDocuments({
    corporation: supervisor.corporation,
  });

  const data = {
    supervisorName: supervisor.fullname,
    date: currentDate,
    shift,
    pitId,
    loadingUnit,
    machineStartTime: machineStartLocalTime,
    machineEndTime: machineEndLocalTime,
    machineTotalTime: machineTotalTimeFormatted,
    totalLoadingTime: totalLoadingTimeFormatted,
    mineralTrips: `${trips.length} trips`,
    wasteTrips: `${wasteTrips.length} trips`,
    truckTrips: `${totalTrips} trips`,
    target: `${target?.target || 0} tons`,
    mineralExtracted: `${totalWeight.toFixed(2)} tons`,
    ROM1: `${rom1weight.toFixed(2)} tons`,
    ROM2: `${rom2weight.toFixed(2)} tons`,
    ROM3: `${rom3weight.toFixed(2)} tons`,
    // ROM4: `${rom4weight.toFixed(2)} tons`,
  };

  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Supervisor Dashboard");

  // Add supervisor details at the top
  worksheet.addRow([`Supervisor Name:`, data.supervisorName]);
  worksheet.addRow([`Date:`, data.date]);
  worksheet.addRow([`Shift:`, data.shift]);
  worksheet.addRow([`Pit ID:`, data.pitId]);
  worksheet.addRow([`Loading Unit:`, data.loadingUnit]);
  worksheet.addRow([]); // Add an empty row for spacing

  // Add a highlighted heading for the data section
  const headingRow = worksheet.addRow([`Shift Supervisor Report`]);
  headingRow.font = { bold: true, size: 14 };
  headingRow.alignment = { horizontal: "center" };
  headingRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFE0B2" }, // Light orange background
  };
  worksheet.addRow([]); // Add another empty row for spacing

  // Add data rows with units
  worksheet.addRow([`Metric`, `Value`]).font = { bold: true }; // Add header row
  worksheet.addRow([]);
  worksheet.addRow([`Mineral Trips`, data.mineralTrips]);
  worksheet.addRow([`Waste Trips`, data.wasteTrips]);
  worksheet.addRow([`Total Trips`, data.truckTrips]).font = { bold: true };
  worksheet.addRow([]);
  worksheet.addRow([`Target`, data.target]);
  worksheet.addRow([`ROM1 `, data.ROM1]);
  worksheet.addRow([`ROM2 `, data.ROM2]);
  worksheet.addRow([`ROM3 `, data.ROM3]);
  // worksheet.addRow([`ROM4 (50% to below 55% Al2O3)`, data.ROM3]);
  worksheet.addRow([`Actual Mineral Extracted`, data.mineralExtracted]).font = {
    bold: true,
  };

  worksheet.addRow([]);
  worksheet.addRow([]);

  worksheet.addRow([`Machine Start Time:`, data.machineStartTime]);
  worksheet.addRow([`Machine End Time:`, data.machineEndTime]);
  worksheet.addRow([`Total Machine Operation Time:`, data.machineTotalTime]);
  worksheet.addRow([`Total Loading Time:`, data.totalLoadingTime]);

  // Apply formatting to the data table
  worksheet.columns.forEach((column) => {
    column.width = 30; // Set column width for better readability
  });

  worksheet.getRow(8).font = { bold: true }; // Bold the Metric and Value headers

  // Set the response headers and send the Excel file
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=supervisor_dashboard.xlsx"
  );

  await workbook.xlsx.write(res);
  return res.status(200).end();
});

const getWeighbridgeDashboard = asyncHandler(async (req, res) => {
  const supervisor = await Employee.findById(req.user._id);
  if (!supervisor) {
    return res.status(404).json({ message: "Supervisor not found" });
  }

  // Get the start and end of the current day
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Fetch all trips with weight done for the current day
  const completedTrips = await Trip.find({
    corporation: supervisor.corporation,
    isWeightDone: true, // Only fetch trips where weight is done
    createdAt: { $gte: startOfDay, $lte: endOfDay }, // Filter for current day
  });

  // Total trips where isWeightDone is true
  const totalTripsWithWeightDone = completedTrips.length;

  // Calculate total weight for all trips where isWeightDone is true
  const totalWeight = completedTrips.reduce(
    (acc, trip) => acc + Number(trip.weight),
    0
  );

  // Grade-wise filtering for ROM1, ROM2, ROM3
  const ROM1 = completedTrips.filter((trip) => trip.subGrade === "Rom 1");
  const ROM2 = completedTrips.filter((trip) => trip.subGrade === "Rom 2");
  const ROM3 = completedTrips.filter((trip) => trip.subGrade === "Rom 3");

  // Calculate total weight per ROM grade
  const rom1Weight = ROM1.reduce((acc, trip) => acc + Number(trip.weight), 0);
  const rom2Weight = ROM2.reduce((acc, trip) => acc + Number(trip.weight), 0);
  const rom3Weight = ROM3.reduce((acc, trip) => acc + Number(trip.weight), 0);

  // Get the latest 5 trips where tripStatus is "InProgress" for the current day
  const latestInProgressTrips = await Trip.find({
    corporation: supervisor.corporation,
    tripStatus: "InProgress",
    isWeightDone: true,
    createdAt: { $gte: startOfDay, $lte: endOfDay }, // Filter for current day
  })
    .populate("dumper", "dumperNumber")
    .sort({ createdAt: -1 }) // Sort by createdAt (latest first)
    .limit(5); // Limit to 5 trips

  // Get the start and end of the previous day
  const prevStartOfDay = new Date(startOfDay);
  prevStartOfDay.setDate(prevStartOfDay.getDate() - 1);

  const prevEndOfDay = new Date(endOfDay);
  prevEndOfDay.setDate(prevEndOfDay.getDate() - 1);

  // Get the latest 5 completed trips from the previous day
  const latestCompletedTripsPrevDay = await Trip.find({
    corporation: supervisor.corporation,
    tripStatus: "Completed",
    createdAt: { $gte: prevStartOfDay, $lte: prevEndOfDay }, // Filter for previous day
  })
    .populate("dumper", "dumperNumber")
    .sort({ createdAt: -1 }) // Sort by createdAt (latest first)
    .limit(5); // Limit to 5 trips

  return res.status(200).json({
    message: "Weighbridge dashboard data fetched successfully",
    data: {
      supervisor: supervisor.fullname,
      totalTripsWithWeightDone, // Total trips with weight done
      totalWeight, // Total weight for all completed trips
      ROM1: {
        count: ROM1.length,
        weight: rom1Weight, // Weight for ROM1
      },
      ROM2: {
        count: ROM2.length,
        weight: rom2Weight, // Weight for ROM2
      },
      ROM3: {
        count: ROM3.length,
        weight: rom3Weight, // Weight for ROM3
      },
      latestInProgressTrips: latestInProgressTrips.map((trip) => ({
        dumperNumber: trip.dumper.dumperNumber,
        weight: trip.weight,
        time: trip.loadingEndTime,
      })), // Display latest 5 in-progress trips
      latestCompletedTripsPrevDay: latestCompletedTripsPrevDay.map((trip) => ({
        dumperNumber: trip.dumper.dumperNumber,
        weight: trip.weight,
        time: trip.loadingEndTime,
      })), // Display l
    },
  });
});

const getStockpileSupervisorDashboard = asyncHandler(async (req, res) => {
  const supervisor = await Employee.findById(req.user._id);
  if (!supervisor) {
    return res.status(404).json({ message: "Supervisor not found" });
  }

  // Get the start and end of the current day
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  // Get the previous day's closing balance for opening balance
  const prevDay = new Date();
  prevDay.setDate(prevDay.getDate() - 1);
  prevDay.setHours(0, 0, 0, 0);

  // Find the previous day's dashboard snapshot to get the closing balance as the opening balance
  const prevClosingBalance = await DashboardSnapshot.findOne({
    corporation: supervisor.corporation,
    date: { $gte: prevDay, $lt: startOfDay }, // Previous day
  });

  const openingBalance = prevClosingBalance
    ? prevClosingBalance.totalClosingBalance
    : 0;

  // Fetch the shift based on supervisor's ID
  const shiftData = await Shift.findOne({
    createdBy: req.user._id,
  });

  // Retrieve the trip data for the current day
  const trips = await Trip.find({
    corporation: supervisor.corporation,
    material: "Bauxite",
    createdAt: { $gte: startOfDay, $lte: endOfDay }, // Filter for current day
  });

  // Retrieve all complete trips with weight done for the current day
  const completeTrips = await Trip.find({
    corporation: supervisor.corporation,
    isWeightDone: true,
    tripStatus: "Completed",
    material: "Bauxite",
    createdAt: { $gte: startOfDay, $lte: endOfDay }, // Filter for current day
  });

  // Grade-wise filtering
  const ROM1 = completeTrips.filter((trip) => trip.subGrade === "Rom 1");
  const ROM2 = completeTrips.filter((trip) => trip.subGrade === "Rom 2");
  const ROM3 = completeTrips.filter((trip) => trip.subGrade === "Rom 3");

  // Calculate total weight per ROM grade
  const rom1Weight = ROM1.reduce((acc, trip) => acc + Number(trip.weight), 0);
  const rom2Weight = ROM2.reduce((acc, trip) => acc + Number(trip.weight), 0);
  const rom3Weight = ROM3.reduce((acc, trip) => acc + Number(trip.weight), 0);

  // Placeholder values for grade-wise dispatch weight (currently set to zero)
  const rom1DispatchWeight = 0;
  const rom2DispatchWeight = 0;
  const rom3DispatchWeight = 0;

  const totalTripDispatch = 0;

  // Grade-wise closing balance
  const rom1ClosingBalance = rom1Weight - rom1DispatchWeight;
  const rom2ClosingBalance = rom2Weight - rom2DispatchWeight;
  const rom3ClosingBalance = rom3Weight - rom3DispatchWeight;

  // Total weight and total dispatch
  const totalWeight = rom1Weight + rom2Weight + rom3Weight;
  const totalWeightDispatch =
    rom1DispatchWeight + rom2DispatchWeight + rom3DispatchWeight;

  // Total closing balance
  const totalClosingBalance =parseFloat(openingBalance)+ totalWeight - totalWeightDispatch;

  // Total completed and in-progress trips for the current day
  const totalCompletedTrips = trips.filter(
    (trip) => trip.isWeightDone && trip.tripStatus === "Completed"
  ).length;
  const totalInProgressTrips = trips.filter(
    (trip) => trip.tripStatus === "InProgress"
  ).length;

  const totalTrips = await Trip.countDocuments({
    corporation: supervisor.corporation,
    createdAt: { $gte: startOfDay, $lte: endOfDay }, // Count total trips for the day
  });

  // Upsert (Update if exists, Insert if not) dashboard data for the current day
  await DashboardSnapshot.findOneAndUpdate(
    {
      corporation: supervisor.corporation,
      date: { $gte: startOfDay, $lte: endOfDay }, // Find existing data for today
    },
    {
      supervisor: supervisor._id,
      corporation: supervisor.corporation,
      date: new Date(),
      totalTrips: totalTrips,
      mineralTrips: trips.length,
      mineralExtracted: totalWeight,
      totalCompletedTrips,
      totalInProgressTrips,
      totalTripDispatch,
      totalClosingBalance,
      openingBalance,
      ROM1: {
        count: ROM1.length,
        weight: rom1Weight,
        dispatchWeight: rom1DispatchWeight,
        closingBalance: rom1ClosingBalance,
      },
      ROM2: {
        count: ROM2.length,
        weight: rom2Weight,
        dispatchWeight: rom2DispatchWeight,
        closingBalance: rom2ClosingBalance,
      },
      ROM3: {
        count: ROM3.length,
        weight: rom3Weight,
        dispatchWeight: rom3DispatchWeight,
        closingBalance: rom3ClosingBalance,
      },
    },
    { new: true, upsert: true } // Create a new document if it doesn't exist
  );

  return res.status(200).json({
    message: "Supervisor dashboard data fetched and saved successfully",
    data: {
      supervisor: supervisor.fullname,
      shift: shiftData.shiftName,
      mineralTrips: trips.length,
      totalTrips: totalTrips,
      mineralExtracted: totalWeight,
      totalCompletedTrips,
      totalInProgressTrips,

      // Grade-wise data
      ROM1: {
        count: ROM1.length,
        weight: rom1Weight,
        dispatchWeight: rom1DispatchWeight,
        closingBalance: rom1ClosingBalance,
      },
      ROM2: {
        count: ROM2.length,
        weight: rom2Weight,
        dispatchWeight: rom2DispatchWeight,
        closingBalance: rom2ClosingBalance,
      },
      ROM3: {
        count: ROM3.length,
        weight: rom3Weight,
        dispatchWeight: rom3DispatchWeight,
        closingBalance: rom3ClosingBalance,
      },

      // Total data
      totalTripDispatch: totalTripDispatch,
      totalClosingBalance: totalClosingBalance,
      openingBalance: parseFloat(openingBalance).toFixed(2), // Previous day's closing balance
    },
  });
});

const getStockpileDashboardReport = asyncHandler(async (req, res) => {
  const supervisor = await Employee.findById(req.user._id);
  if (!supervisor) {
    return res.status(404).json({ message: "Supervisor not found" });
  }

  // Get the start and end of the current day
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Get the previous day's closing balance for opening balance
  const prevDay = new Date();
  prevDay.setDate(prevDay.getDate() - 1);
  prevDay.setHours(0, 0, 0, 0);

  const prevClosingBalance = await DashboardSnapshot.findOne({
    corporation: supervisor.corporation,
    date: { $gte: prevDay, $lt: startOfDay }, // Previous day
  });

  const openingBalance = prevClosingBalance
    ? prevClosingBalance.totalClosingBalance
    : 0;

  // Fetch the shift based on supervisor's ID
  const shiftData = await StockpileShift.findOne({
    createdBy: req.user._id,
  }).populate("stockpile");

  const stockpile = shiftData
    ? shiftData.stockpile.StockpileName
    : "Unknown Shift";

  // Retrieve the trip data for the current day
  const trips = await Trip.find({
    corporation: supervisor.corporation,
    material: "Bauxite",
    createdAt: { $gte: startOfDay, $lte: endOfDay }, // Filter for current day
  });

  // Retrieve all complete trips with weight done for the current day
  const completeTrips = await Trip.find({
    corporation: supervisor.corporation,
    isWeightDone: true,
    tripStatus: "Completed",
    material: "Bauxite",
    createdAt: { $gte: startOfDay, $lte: endOfDay }, // Filter for current day
  });

  // Grade-wise filtering
  const ROM1 = completeTrips.filter((trip) => trip.subGrade === "Rom 1");
  const ROM2 = completeTrips.filter((trip) => trip.subGrade === "Rom 2");
  const ROM3 = completeTrips.filter((trip) => trip.subGrade === "Rom 3");

  // Calculate total weight per ROM grade
  const rom1Weight = ROM1.reduce((acc, trip) => acc + Number(trip.weight), 0);
  const rom2Weight = ROM2.reduce((acc, trip) => acc + Number(trip.weight), 0);
  const rom3Weight = ROM3.reduce((acc, trip) => acc + Number(trip.weight), 0);

  // Placeholder values for grade-wise dispatch weight (currently set to zero)
  const rom1DispatchWeight = 0;
  const rom2DispatchWeight = 0;
  const rom3DispatchWeight = 0;

  const totalTripDispatch = 0;

  // Grade-wise closing balance
  const rom1ClosingBalance = rom1Weight - rom1DispatchWeight;
  const rom2ClosingBalance = rom2Weight - rom2DispatchWeight;
  const rom3ClosingBalance = rom3Weight - rom3DispatchWeight;

  // Total weight and total dispatch
  const totalWeight = rom1Weight + rom2Weight + rom3Weight;
  const totalWeightDispatch =
    rom1DispatchWeight + rom2DispatchWeight + rom3DispatchWeight;

  // Total closing balance
  const totalClosingBalance = parseFloat(openingBalance)+totalWeight - totalWeightDispatch;

  // Total completed and in-progress trips for the current day
  const totalCompletedTrips = trips.filter(
    (trip) => trip.isWeightDone && trip.tripStatus === "Completed"
  ).length;
  const totalInProgressTrips = trips.filter(
    (trip) => trip.tripStatus === "InProgress"
  ).length;

  const totalTrips = await Trip.countDocuments({
    corporation: supervisor.corporation,
    createdAt: { $gte: startOfDay, $lte: endOfDay }, // Count total trips for the day
  });

  // Upsert (Update if exists, Insert if not) dashboard data for the current day
  await DashboardSnapshot.findOneAndUpdate(
    {
      corporation: supervisor.corporation,
      date: { $gte: startOfDay, $lte: endOfDay }, // Find existing data for today
    },
    {
      supervisor: supervisor._id,
      corporation: supervisor.corporation,
      date: new Date(),
      stockpileName: stockpile,
      totalTrips: totalTrips,
      mineralTrips: trips.length,
      mineralExtracted: totalWeight,
      totalCompletedTrips,
      totalInProgressTrips,
      totalTripDispatch,
      totalClosingBalance,
      openingBalance:parseFloat(openingBalance).toFixed(2),
      ROM1: {
        count: ROM1.length,
        weight: rom1Weight,
        dispatchWeight: rom1DispatchWeight,
        closingBalance: rom1ClosingBalance,
      },
      ROM2: {
        count: ROM2.length,
        weight: rom2Weight,
        dispatchWeight: rom2DispatchWeight,
        closingBalance: rom2ClosingBalance,
      },
      ROM3: {
        count: ROM3.length,
        weight: rom3Weight,
        dispatchWeight: rom3DispatchWeight,
        closingBalance: rom3ClosingBalance,
      },
    },
    { new: true, upsert: true }
  );

  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Stockpile Supervisor Dashboard");

  // Add supervisor details at the top
  worksheet.addRow([`Supervisor Name:`, supervisor.fullname]);
  worksheet.addRow([`Date:`, new Date().toLocaleDateString()]);
  worksheet.addRow([`Shift:`, shiftData.shiftName || "Unknown Shift"]);
  worksheet.addRow([]); // Add an empty row for spacing

  // Summary Table
  const summaryHeadingRow = worksheet.addRow([`Summary Table`]);
  summaryHeadingRow.font = { bold: true, size: 14 };
  summaryHeadingRow.alignment = { horizontal: "center" };
  summaryHeadingRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFE0B2" }, // Light orange background
  };

  worksheet.addRow([]); // Add an empty row for spacing

  // worksheet.addRow([`Metric`, `Value`]).font = { bold: true }; // Add header row
  worksheet.addRow([]);
  worksheet.addRow([`Opening Balance (tons)`, openingBalance]);
  worksheet.addRow([
    `Total Closing Balance (tons)`,
    totalClosingBalance.toFixed(2),
  ]);
  worksheet.addRow([`Total Trips`, totalTrips]);
  worksheet.addRow([`Total Completed Trips`, totalCompletedTrips]);
  worksheet.addRow([`Total In-Progress Trips`, totalInProgressTrips]);

  worksheet.addRow([]); // Add an empty row for spacing

  // Dispatch Data Table
  const dispatchHeadingRow = worksheet.addRow([
    ` Received Stockpile Data Table`,
  ]);
  dispatchHeadingRow.font = { bold: true, size: 14 };
  dispatchHeadingRow.alignment = { horizontal: "center" };
  dispatchHeadingRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0B2" }, // Light yellow background
  };

  worksheet.addRow([]); // Add an empty row for spacing

  worksheet.addRow([
    // `Stockpile`,
    `Grade`,
    `Quantity (tons)`,
    `Trips Completed`,
    `Trips In Progress`,
  ]).font = { bold: true }; // Add header row
  worksheet.addRow([]);
  worksheet.addRow([
    // stockpile,
    `ROM1`,
    rom1Weight.toFixed(2),
    ROM1.length,
    trips.filter(
      (trip) => trip.subGrade === "Rom 1" && trip.tripStatus === "InProgress"
    ).length,
  ]);
  worksheet.addRow([
    // "",
    `ROM2`,
    rom2Weight.toFixed(2),
    ROM2.length,
    trips.filter(
      (trip) => trip.subGrade === "Rom 2" && trip.tripStatus === "InProgress"
    ).length,
  ]);
  worksheet.addRow([
    // "",
    `ROM3`,
    rom3Weight.toFixed(2),
    ROM3.length,
    trips.filter(
      (trip) => trip.subGrade === "Rom 3" && trip.tripStatus === "InProgress"
    ).length,
  ]);

  // Apply formatting to the tables
  worksheet.columns.forEach((column) => {
    column.width = 30; // Set column width for better readability
  });

  worksheet.getRow(8).font = { bold: true }; // Bold the Metric and Value headers
  worksheet.getRow(14).font = { bold: true }; // Bold the table headers

  // Set the response headers and send the Excel file
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=stockpile_supervisor_dashboard.xlsx"
  );

  await workbook.xlsx.write(res);
  return res.status(200).end();
});

const getWeighbridgeDashboardReport = asyncHandler(async (req, res) => {
  const supervisor = await Employee.findById(req.user._id);
  if (!supervisor) {
    return res.status(404).json({ message: "Supervisor not found" });
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Fetch the shift based on supervisor's ID
  const shiftData = await WeighbridgeShift.findOne({
    createdBy: req.user._id,
  }).populate("Weighbridge");

  const shift = shiftData ? shiftData.shiftName : "Unknown Shift";
  const weighbridge = shiftData
    ? shiftData.Weighbridge.WeighbridgeName
    : "Unknown Shift";

  const formatTime = (date) => {
    return new Date(date)
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(":", ".");
  };

  const startShift = shiftData
    ? formatTime(shiftData.startTime)
    : "Unknown Start Time";
  const endShift = shiftData
    ? formatTime(shiftData.endTime)
    : "Unknown End Time";

  // Aggregation pipeline to fetch and group trips by pit, subGrade, and tripStatus
  const aggregatedData = await Trip.aggregate([
    {
      $match: {
        corporation: supervisor.corporation,
        isWeightDone: true,
        material: { $ne: "Waste" },
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      },
    },
    {
      $group: {
        _id: {
          pit: "$pit",
          subGrade: "$subGrade",
          tripStatus: "$tripStatus",
        },
        totalWeight: { $sum: { $toDouble: "$weight" } },
        totalTrips: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "pits",
        localField: "_id.pit",
        foreignField: "_id",
        as: "pitDetails",
      },
    },
    {
      $unwind: {
        path: "$pitDetails",
        preserveNullAndEmptyArrays: true, // Include pits even if no trips
      },
    },
    {
      $project: {
        pitId: "$_id.pit",
        pitName: "$pitDetails.pitName", // Accessing directly if pitDetails is not an array
        mineralName: "$pitDetails.mineralsName", // Accessing directly if pitDetails is not an array
        subGrade: "$_id.subGrade",
        tripStatus: "$_id.tripStatus",
        totalWeight: { $ifNull: ["$totalWeight", 0] },
        totalTrips: { $ifNull: ["$totalTrips", 0] },
        inProgressTrips: {
          $cond: [{ $eq: ["$_id.tripStatus", "InProgress"] }, "$totalTrips", 0],
        },
        completedTrips: {
          $cond: [{ $eq: ["$_id.tripStatus", "Completed"] }, "$totalTrips", 0],
        },
      },
    },
    {
      $sort: { pitName: 1 }, // Sort in ascending order (1 for ascending, -1 for descending)
    },
    // {
    //   $group: {
    //     _id: {
    //       pitId: "$pitId",
    //       pitName: "$pitName",
    //       mineralName: "$mineralName",
    //     },
    //     data: {
    //       $push: {
    //         subGrade: "$subGrade",
    //         tripStatus: "$tripStatus",
    //         totalWeight: "$totalWeight",
    //         totalTrips: "$totalTrips",
    //         inProgressTrips: "$inProgressTrips",
    //         completedTrips: "$completedTrips",
    //       },
    //     },
    //   },
    // },
  ]);

  // Send the structured result
  // return res.status(200).json({
  //   message: "Weighbridge dashboard data fetched successfully",
  //   data: aggregatedData,
  // });

  // Create a grade to ROM mapping
  const gradeToRomMapping = {
    "Rom 1": "Rom 1",
    "Rom 2": "Rom 2",
    "Rom 3": "Rom 3",
  };
  // Create a new Excel workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Weighbridge Report");

  // Add supervisor details at the top
  worksheet.addRow([`Supervisor Name:`, supervisor.fullname]);
  worksheet.addRow([`Date:`, new Date().toLocaleDateString()]);
  worksheet.addRow(["Start Time:", startShift]);
  worksheet.addRow(["End Time:", endShift]);
  worksheet.addRow([`Shift:`, shift]);
  worksheet.addRow(["Weighbridge:", weighbridge]);
  worksheet.addRow([]); // Add an empty row for spacing

  // Add a highlighted heading for the data section
  const headingRow = worksheet.addRow([`Weighbridge Details`]);
  // Merge cells across the width of the table (adjust the range based on your table's columns)
  worksheet.mergeCells(`A${headingRow.number}:H${headingRow.number}`); // Merges cells from column A to H

  headingRow.font = { bold: true, size: 14 };
  headingRow.alignment = { horizontal: "center" };
  headingRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFE0B2" }, // Light orange background
  };
  worksheet.addRow([]); // Add another empty row for spacing
  worksheet.getColumn(1).width = 20; // Weighbridge column
  // Define the header row
  worksheet.addRow([
    "Weighbridge",
    "Pit",
    "Material",
    "Grade",
    "Quantity in tonns",
    "Total Trips",
    "Trip Completed",
    "Trip in Progress",
  ]).font = { bold: true };

  // Create a map to hold the pit data and handle grouping by pit
  const pitData = {};

  aggregatedData.forEach((data) => {
    const {
      pitName,
      mineralName,
      subGrade,
      totalWeight,
      totalTrips,
      completedTrips,
      inProgressTrips,
    } = data;

    const mappedGrade = gradeToRomMapping[subGrade] || subGrade; // Map subGrade to ROM, if no mapping exists, use subGrade

    if (!pitData[pitName]) {
      pitData[pitName] = [];
    }

    // Push each ROM entry (subGrade) under the respective pit
    pitData[pitName].push({
      material: mineralName || "Unknown",
      grade: mappedGrade,
      weight: totalWeight,
      trips: totalTrips,
      completed: completedTrips,
      inProgress: inProgressTrips,
    });
  });

  // Populate the worksheet with the grouped data
  Object.keys(pitData).forEach((pitName) => {
    const pitRows = pitData[pitName];

    // Add the first row for the pit with material info
    worksheet.addRow([
      weighbridge, // Placeholder for weighbridge if needed
      pitName,
      pitRows[0].material,
      pitRows[0].grade,
      pitRows[0].weight,
      pitRows[0].trips,
      pitRows[0].completed,
      pitRows[0].inProgress,
    ]);

    // Add subsequent rows for other subGrades (ROMs) under the same pit
    pitRows.slice(1).forEach((row) => {
      worksheet.addRow([
        "",
        "",
        "",
        row.grade,
        row.weight,
        row.trips,
        row.completed,
        row.inProgress,
      ]);
    });
  });

  // Set the response headers and send the Excel file
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=supervisor_dashboard.xlsx"
  );

  await workbook.xlsx.write(res);
  return res.status(200).end();
});

export {
  createSupervisor,
  loginSupervisor,
  logoutSupervisor,
  getUserProfile,
  getSupervisor,
  deleteSupervisor,
  updateSupervisor,
  getMaterialSupervisorDashboard,
  getMaterialSupervisorReport,
  getStockpileSupervisorDashboard,
  getWeighbridgeDashboard,
  getWeighbridgeDashboardReport,
  getStockpileDashboardReport,
};
