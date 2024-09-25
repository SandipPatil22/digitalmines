import { Schema } from "mongoose";
import mongoose from "mongoose";

const dashboardSnapshotSchema = new Schema(
  {
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    corporation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Corporation",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    totalTrips: {
      type: String,
    },
    mineralTrips: {
      type: String,
    },
    mineralExtracted: {
      type: String,
    },
    totalCompletedTrips: {
      type: String,
    },
    totalInProgressTrips: {
      type: String,
    },
    totalTripDispatch: {
      type: String,
    },
    totalClosingBalance: {
      type: String,
    },
    openingBalance: {
      type: String,
    },
    ROM1: {
      count: {
        type: String,
      },
      weight: {
        type: String,
      },
      dispatchWeight: {
        type: String,
      },
      closingBalance: {
        type: String,
      },
    },
    ROM2: {
      count: {
        type: String,
      },
      weight: {
        type: String,
      },
      dispatchWeight: {
        type: String,
      },
      closingBalance: {
        type: String,
      },
    },
    ROM3: {
      count: {
        type: String,
      },
      weight: {
        type: String,
      },
      dispatchWeight: {
        type: String,
      },
      closingBalance: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const DashboardSnapshot = mongoose.model(
  "DashboardSnapshot",
  dashboardSnapshotSchema
);
