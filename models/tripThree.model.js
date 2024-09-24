import { Schema } from "mongoose";
import mongoose from "mongoose";

const tripThreeSchema = new Schema(
  {
    loading: {
      type: Schema.Types.ObjectId,
      ref: "Loading",
    },
    plantId: {
      type: Schema.Types.ObjectId,
      ref: "Plant",
    },
    trackingId: {
      type: String,
      default: null,
    },
    minerals: {
      type: String,
    },
    stockpile: {
      type: Schema.Types.ObjectId,
      ref: "Stockpile",
    },
    loadingOperator: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    dumperOperator: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
    },
    tripStatus: {
      type: String,
      enum: ["InProgress", "Completed"],
      default: "InProgress",
    },
    dumper: {
      type: Schema.Types.ObjectId,
      ref: "Dumper",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    weight: {
      type: String,
      default: null,
    },
    isweightDone: {
      type: Boolean,
      default: false,
    },
    destination: {
      type: Schema.Types.ObjectId,
      ref: "Destination",
      default: null,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "Buyers",
      default: null,
    },
    feedback: {
      type: String,
      default: null,
    },
    corporation: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TripThree = mongoose.model("TripThree", tripThreeSchema);
