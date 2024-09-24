import { Schema } from "mongoose";
import mongoose from "mongoose";

const tripSchema = new Schema(
  {
    pit: {
      type: Schema.Types.ObjectId,
      ref: "Pit",
    },
    section: {
      type: String,
      default: null,
    },
    bench: {
      type: Schema.Types.ObjectId,
      ref: "Bench",
    },
    loading: {
      type: Schema.Types.ObjectId,
      ref: "Loading",
    },
    material: {
      type: String,
    },
    moistureContent: {
      type: String,
      default: null,
    },
    dumper: {
      type: Schema.Types.ObjectId,
      ref: "Dumper",
    },
    loadingOperator: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
    },
    dumperOperator: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
    },
    subGrade: {
      type: String,
      default: "Below 40% Al2O3",
    },
    loadingStartTime: {
      type: String,
    },
    loadingEndTime: {
      type: String,
    },
    destination: {
      type: Schema.Types.ObjectId,
      ref: "Destination",
    },
    tripStatus: {
      type: String,
      enum: ["InProgress", "Completed"],
      default: "InProgress",
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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    weight: {
      type: String,
      default: null,
    },
    isWeightDone: {
      type: Boolean,
      default: false,
    },
    weightUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  {
    timestamps: true,
  }
);

export const Trip = mongoose.model("Trip", tripSchema);
