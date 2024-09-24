import { Schema } from "mongoose";
import mongoose from "mongoose";

const tripTwoSchema = new Schema(
  {
    loading: {
      type: Schema.Types.ObjectId,
      ref: "Loading",
    },
    plantId: {
      type: Schema.Types.ObjectId,
      ref: "Plant",
    },
    stockpile: {
      type: Schema.Types.ObjectId,
      ref: "Stockpile",
    },
    loadingOperator: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
    },
    loadingStartTime: {
      type: String,
    },
    loadingEndTime: {
      type: String,
    },
    dumperOperator: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
    },
    dumper: {
      type: Schema.Types.ObjectId,
      ref: "Dumper",
    },
    minerals: {
      type: String,
      required :true
    },
    tripStatus: {
      type: String,
      enum: ["InProgress", "Completed"],
      default: "InProgress",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    weight: {
      type: String,
      default: null,
    },
    destination: {
      type: Schema.Types.ObjectId,
      ref: "Destination",
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

export const TripTwo = mongoose.model("TripTwo", tripTwoSchema);
