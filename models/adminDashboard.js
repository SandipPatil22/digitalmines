import { Schema } from "mongoose";
import mongoose from "mongoose";

const dashboardSchema = new Schema({
  corporation: {
    type: String,
    required: true,
  },
  data: {
    OverburdenExtraction: {
      wasteTarget: { type: Number },
      wasteExtracted: { type: Number },
    },
    MiniralExtraction: {
      target: { type: Number },
      mineralExtracted: { type: Number },
    },
    GradeWiseMiniralExtraction: {
      ROM1: { type: Number },
      ROM2: { type: Number },
      ROM3: { type: Number },
    },
    GradeWiseTonage: {
      TotalTrips: { type: Number },
      TotalWeight: { type: Number },
      ROM1: { type: Number },
      ROM2: { type: Number },
      ROM3: { type: Number },
    },
    Stockpile1: {
      opening: {
        openingBalance: { type: Number },
        ROM1: {
          weight: { type: Number },
        },
        ROM2: {
          weight: { type: Number },
        },
        ROM3: {
          weight: { type: Number },
        },
      },
      closing: {
        totalClosingBalance: { type: Number },
        ROM1: {
          closingBalance: { type: Number },
        },
        ROM2: {
          closingBalance: { type: Number },
        },
        ROM3: {
          closingBalance: { type: Number },
        },
      },
      Received: {
        TotalWeightReceived: { type: Number },
        ROM1: {
          weight: { type: Number },
        },
        ROM2: {
          weight: { type: Number },
        },
        ROM3: {
          weight: { type: Number },
        },
      },
      Dispatch: {
        totalTripDispatch: { type: Number },
        totalWeight: { type: Number },
        ROM1: {
          dispatchWeight: { type: Number },
        },
        ROM2: {
          dispatchWeight: { type: Number },
        },
        ROM3: {
          dispatchWeight: { type: Number },
        },
      },
    },
    PlantFeeding: {
      totalWeight: { type: Number },
      Rom1: { type: Number },
      Rom2: { type: Number },
      Rom3: { type: Number },
    },
    PlantProduction: {
      totalWeight: { type: Number },
      PlantProduct1: { type: Number },
      PlantProduct2: { type: Number },
      PlantProduct3: { type: Number },
    },
    Stockpile2: {
      opening: {
        openingBalance: { type: Number },
        PlantProduct1: {
          weight: { type: Number },
        },
        PlantProduct2: {
          weight: { type: Number },
        },
        PlantProduct3: {
          weight: { type: Number },
        },
      },

      closing: {
        totalClosingBalance: { type: Number },
        PlantProduct1: {
          closingBalance: { type: Number },
        },
        PlantProduct2: {
          closingBalance: { type: Number },
        },
        PlantProduct3: {
          closingBalance: { type: Number },
        },
      },
      Received: {
        TotalWeightReceived: { type: Number },
        PlantProduct1: {
          receivedweight: { type: Number },
        },
        PlantProduct2: {
          receivedweight: { type: Number },
        },
        PlantProduct3: {
          receivedweight: { type: Number },
        },
      },
      Dispatch: {
        totalTripDispatch: { type: Number },
        totalWeight: { type: Number },
        PlantProduct1: {
          dispatchWeight: { type: Number },
        },
        PlantProduct2: {
          dispatchWeight: { type: Number },
        },
        PlantProduct3: {
          dispatchWeight: { type: Number },
        },
      },
    },
    Dispatch: {
      totalTripDispatch: { type: Number },
      totalWeight: { type: Number },
      PlantProduct1: {
        dispatchWeight: { type: Number },
      },
      PlantProduct2: {
        dispatchWeight: { type: Number },
      },
      PlantProduct3: {
        dispatchWeight: { type: Number },
      },
    },
  },
});

export const Dashboard = mongoose.model("Dashboard", dashboardSchema);
