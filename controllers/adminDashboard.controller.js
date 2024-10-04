import { Employee } from "../models/employee.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Target } from "../models/target.model.js";
import { Trip } from "../models/Trips.model.js";
import { User } from "../models/user.model.js";
import ExcelJS from "exceljs";
import { Pit } from "../models/pit.model.js";
import { Shift } from "../models/shift.model.js";
import { WeighbridgeShift } from "../models/weighbridgeShift.model.js";
import { StockpileShift } from "../models/stockpileShift.model.js";
import { DashboardSnapshot } from "../models/dashboardSnapshort.model.js";
import { Dashboard } from "../models/adminDashboard.js";

const adminDashboard = asyncHandler(async (req, res) => {
  const adminuser = await User.findById(req.user._id);
  if (!adminuser) {
    return res.status(404).json({ message: "adminuser not found" });
  }
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  // Get the start and end of the current day
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Get the previous day's closing balance for opening balance
  const prevDay = new Date();
  prevDay.setDate(prevDay.getDate() - 1);
  prevDay.setHours(0, 0, 0, 0);

  // target of material and waste per month
  const target = await Target.findOne({
    corporation: adminuser,
    status: true,
    month: currentMonth,
  });

  //   material extracted without moisture

  // retrive the trip data by day in future
  const trips = await Trip.find({
    corporation: adminuser,
    material: "Bauxite",
  });

  const totalWeight = trips.reduce((acc, trip) => acc + Number(trip.weight), 0);

  // Calculate the average moisture content
  const totalMoistureInMiniral = trips.reduce((total, trip) => {
    // Extract the moistureContent as a string and remove any percentage sign
    const moistureString = trip.moistureContent || "0";
    const moistureContent = parseFloat(moistureString.replace("%", "")) || 0; // Convert to a float

    return total + moistureContent;
  }, 0);
  const averageMoistureInMiniral =
    trips.length > 0 ? totalMoistureInMiniral / trips.length : 0;
  const reducedMiniralExtracted =
    totalWeight > 0 ? totalWeight * (1 - averageMoistureInMiniral / 100) : 0;

  // waste extracted without moisture

  const wasteTrips = await Trip.find({
    corporation: adminuser,
    material: "Waste",
  });

  const wasteExtracted =
    wasteTrips.length > 0 ? Number(wasteTrips.length) * 17 : 0;

  // Calculate the average moisture content
  const totalMoisture = wasteTrips.reduce((total, trip) => {
    // Extract the moistureContent as a string and remove any percentage sign
    const moistureString = trip.moistureContent || "0";
    const moistureContent = parseFloat(moistureString.replace("%", "")) || 0; // Convert to a float

    return total + moistureContent;
  }, 0);

  const averageMoisture =
    wasteTrips.length > 0 ? totalMoisture / wasteTrips.length : 0;
  const reducedWasteExtracted =
    wasteExtracted > 0 ? wasteExtracted * (1 - averageMoisture / 100) : 0;

  // weight per day of miniral (Rom1 Rom2 Rom3)

  const ROM1 = await Trip.find({
    corporation: adminuser,
    material: "Bauxite",
    subGrade: "Rom 1",
  });

  const ROM2 = await Trip.find({
    corporation: adminuser,
    material: "Bauxite",
    subGrade: "Rom 2",
  });

  const ROM3 = await Trip.find({
    corporation: adminuser,
    material: "Bauxite",
    subGrade: "Rom 3",
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

  //  GradeWiseTonage
  // Fetch all trips with weight done for the current day
  const completedTrips = await Trip.find({
    corporation: adminuser,
    isWeightDone: true, // Only fetch trips where weight is done
    createdAt: { $gte: startOfDay, $lte: endOfDay }, // Filter for current day
  });

  // Total trips where isWeightDone is true
  const totalTripsWithWeightDone = completedTrips.length;

  // Calculate total weight for all trips where isWeightDone is true
  const totalWeightOfAllTrips = completedTrips.reduce(
    (acc, trip) => acc + Number(trip.weight),
    0
  );

  //   stockpile
  // Find the previous day's dashboard snapshot to get the closing balance as the opening balance
  // Retrieve all complete trips with weight done for the current day
  const completeTrips = await Trip.find({
    corporation: adminuser,
    isWeightDone: true,
    tripStatus: "Completed",
    material: "Bauxite",
    createdAt: { $gte: startOfDay, $lte: endOfDay }, // Filter for current day
  });

  const prevClosingBalance = await DashboardSnapshot.findOne({
    corporation: adminuser,
    date: { $gte: prevDay, $lt: startOfDay }, // Previous day
  });

  const openingBalance = prevClosingBalance
    ? prevClosingBalance.totalClosingBalance
    : 0;

  // Grade-wise filtering
  const StockpileROM1 = completeTrips.filter(
    (trip) => trip.subGrade === "Rom 1"
  );
  const StockpileROM2 = completeTrips.filter(
    (trip) => trip.subGrade === "Rom 2"
  );
  const StockpileROM3 = completeTrips.filter(
    (trip) => trip.subGrade === "Rom 3"
  );

  // Calculate total weight per ROM grade
  const rom1Weight = StockpileROM1.reduce(
    (acc, trip) => acc + Number(trip.weight),
    0
  );
  const rom2Weight = StockpileROM2.reduce(
    (acc, trip) => acc + Number(trip.weight),
    0
  );
  const rom3Weight = StockpileROM3.reduce(
    (acc, trip) => acc + Number(trip.weight),
    0
  );

  // Placeholder values for grade-wise dispatch weight (currently set to zero)
  const rom1DispatchWeight = 0;
  const rom2DispatchWeight = 0;
  const rom3DispatchWeight = 0;

  const totalTripDispatch = 0;
  const totalDispatchWeight =
    rom1DispatchWeight + rom2DispatchWeight + rom3DispatchWeight;

  // Grade-wise closing balance
  const rom1ClosingBalance = rom1Weight - rom1DispatchWeight;
  const rom2ClosingBalance = rom2Weight - rom2DispatchWeight;
  const rom3ClosingBalance = rom3Weight - rom3DispatchWeight;

  // Total weight and total dispatch
  const totalWeightinStockpile = rom1Weight + rom2Weight + rom3Weight;
  const totalWeightStockpileDispatch =
    rom1DispatchWeight + rom2DispatchWeight + rom3DispatchWeight;

  // Total closing balance
  const totalClosingBalance =
    totalWeightinStockpile - totalWeightStockpileDispatch;

  // save the admin dashboard data
  await Dashboard.findOneAndUpdate(
    {
      corporation: adminuser,
    },
    {
      OverburdenExtraction: {
        wasteTarget: target?.wasteTarget,
        wasteExtracted: reducedWasteExtracted.toFixed(2),
      },
      MiniralExtraction: {
        target: target?.materialTarget,
        mineralExtracted: reducedMiniralExtracted.toFixed(2),
      },
      GradeWiseMiniralExtraction: {
        ROM1: rom1weight,
        ROM2: rom2weight,
        ROM3: rom3weight,
      },
      GradeWiseTonage: {
        TotalTrips: totalTripsWithWeightDone,
        TotalWeight: totalWeightOfAllTrips,
        ROM1: rom1weight,
        ROM2: rom2weight,
        ROM3: rom3weight,
      },
      Stockpile1: {
        opening: {
          openingBalance: openingBalance,
          ROM1: {
            weight: prevClosingBalance?.ROM1?.weight,
          },
          ROM2: {
            weight: prevClosingBalance?.ROM2?.weight,
          },
          ROM3: {
            weight: prevClosingBalance?.ROM3?.weight,
          },
        },

        closing: {
          totalClosingBalance: totalClosingBalance,
          ROM1: {
            closingBalance: rom1ClosingBalance,
          },
          ROM2: {
            closingBalance: rom2ClosingBalance,
          },
          ROM3: {
            closingBalance: rom3ClosingBalance,
          },
        },
        Received: {
          TotalWeightReceived: totalWeightinStockpile,
          ROM1: {
            weight: rom1Weight,
          },
          ROM2: {
            weight: rom2Weight,
          },
          ROM3: {
            weight: rom3Weight,
          },
        },
        Dispatch: {
          totalTripDispatch: totalTripDispatch,
          totalWeight: totalDispatchWeight,
          ROM1: {
            dispatchWeight: rom1DispatchWeight,
          },
          ROM2: {
            dispatchWeight: rom2DispatchWeight,
          },
          ROM3: {
            dispatchWeight: rom3DispatchWeight,
          },
        },
      },
      PlantFeeding: {
        totalWeight: "",
        Rom1: "",
        Rom2: "",
        Rom3: "",
      },
      PlantProduction: {
        totalWeight: "",
        PlantProduct1: "",
        PlantProduct2: "",
        PlantProduct3: "",
      },
      Stockpile2: {
        opening: {
          openingBalance: "",
          PlantProduct1: {
            weight: "",
          },
          PlantProduct2: {
            weight: "",
          },
          PlantProduct3: {
            weight: "",
          },
        },

        closing: {
          totalClosingBalance: "",
          PlantProduct1: {
            closingBalance: "",
          },
          PlantProduct2: {
            closingBalance: "",
          },
          PlantProduct3: {
            closingBalance: "",
          },
        },
        Received: {
          TotalWeightReceived: "",
          PlantProduct1: {
            receivedweight: "",
          },
          PlantProduct2: {
            receivedweight: "",
          },
          PlantProduct3: {
            receivedweight: "",
          },
        },
        Dispatch: {
          totalTripDispatch: "",
          totalWeight: "",
          PlantProduct1: {
            dispatchWeight: "",
          },
          PlantProduct2: {
            dispatchWeight: "",
          },
          PlantProduct3: {
            dispatchWeight: "",
          },
        },
      },
      Dispatch: {
        totalTripDispatch: "",
        totalWeight: "",
        PlantProduct1: {
          dispatchWeight: "",
        },
        PlantProduct2: {
          dispatchWeight: "",
        },
        PlantProduct3: {
          dispatchWeight: "",
        },
      },
    },
    { new: true, upsert: true }
  );

  const data = {
    OverburdenExtraction: {
      wasteTarget: target?.wasteTarget,
      wasteExtracted: reducedWasteExtracted.toFixed(2),
    },
    MiniralExtraction: {
      target: target?.materialTarget,
      mineralExtracted: reducedMiniralExtracted.toFixed(2),
    },
    GradeWiseMiniralExtraction: {
      ROM1: rom1weight,
      ROM2: rom2weight,
      ROM3: rom3weight,
    },
    GradeWiseTonage: {
      TotalTrips: totalTripsWithWeightDone,
      TotalWeight: totalWeightOfAllTrips,
      ROM1: rom1weight,
      ROM2: rom2weight,
      ROM3: rom3weight,
    },
    Stockpile1: {
      opening: {
        openingBalance: openingBalance,
        ROM1: {
          weight: prevClosingBalance?.ROM1?.weight,
        },
        ROM2: {
          weight: prevClosingBalance?.ROM2?.weight,
        },
        ROM3: {
          weight: prevClosingBalance?.ROM3?.weight,
        },
      },

      closing: {
        totalClosingBalance: totalClosingBalance,
        ROM1: {
          closingBalance: rom1ClosingBalance,
        },
        ROM2: {
          closingBalance: rom2ClosingBalance,
        },
        ROM3: {
          closingBalance: rom3ClosingBalance,
        },
      },
      Received: {
        TotalWeightReceived: totalWeightinStockpile,
        ROM1: {
          weight: rom1Weight,
        },
        ROM2: {
          weight: rom2Weight,
        },
        ROM3: {
          weight: rom3Weight,
        },
      },
      Dispatch: {
        totalTripDispatch: totalTripDispatch,
        totalWeight: totalDispatchWeight,
        ROM1: {
          dispatchWeight: rom1DispatchWeight,
        },
        ROM2: {
          dispatchWeight: rom2DispatchWeight,
        },
        ROM3: {
          dispatchWeight: rom3DispatchWeight,
        },
      },
    },
    PlantFeeding: {
      totalWeight: "",
      Rom1: "",
      Rom2: "",
      Rom3: "",
    },
    PlantProduction: {
      totalWeight: "",
      PlantProduct1: "",
      PlantProduct2: "",
      PlantProduct3: "",
    },
    Stockpile2: {
      opening: {
        openingBalance: "",
        PlantProduct1: {
          weight: "",
        },
        PlantProduct2: {
          weight: "",
        },
        PlantProduct3: {
          weight: "",
        },
      },

      closing: {
        totalClosingBalance: "",
        PlantProduct1: {
          closingBalance: "",
        },
        PlantProduct2: {
          closingBalance: "",
        },
        PlantProduct3: {
          closingBalance: "",
        },
      },
      Received: {
        TotalWeightReceived: "",
        PlantProduct1: {
          receivedweight: "",
        },
        PlantProduct2: {
          receivedweight: "",
        },
        PlantProduct3: {
          receivedweight: "",
        },
      },
      Dispatch: {
        totalTripDispatch: "",
        totalWeight: "",
        PlantProduct1: {
          dispatchWeight: "",
        },
        PlantProduct2: {
          dispatchWeight: "",
        },
        PlantProduct3: {
          dispatchWeight: "",
        },
      },
    },
    Dispatch: {
      totalTripDispatch: "",
      totalWeight: "",
      PlantProduct1: {
        dispatchWeight: "",
      },
      PlantProduct2: {
        dispatchWeight: "",
      },
      PlantProduct3: {
        dispatchWeight: "",
      },
    },
  };

  return res.status(200).json({
    message: "adminuser dashboard data fetched successfully",
    data: data,
  });
});

export { adminDashboard };
