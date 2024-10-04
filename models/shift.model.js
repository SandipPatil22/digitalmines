import { Schema } from "mongoose";
import mongoose from "mongoose";

const shiftSchema = new Schema(
  {
    shiftName: {
      type: String,
      enum: ["Shift 1", "Shift 2"],
      //   required: true,
    },
    pit: {
      type: Schema.Types.ObjectId,
      ref: "Pit",
      //   required: true,
    },
    section: {
      type: String,
      //   required: true,
      default: null,
    },
    whyRestart: {
      type: String,
    },
    hourMeterStart: {
      type: String,
      default: null,
    },
    hourMeterEnd: {
      type: String,
      default: null,
    },
    loadingUnit: {
      type: Schema.Types.ObjectId,
      ref: "Loading",
      //   required: true,
    },
    loadingLat: {
      type: String,
      default: null,
    },
    loadingLong: {
      type: String,
      default: null,
    },
    machineStart: {
      type: Date,
      default: null,
    },
    machineEnd: {
      type: Date,
      default: null,
    },

    shiftStartTime: {
      type: String,
      //   required: true,
    },
    shiftEndTime: {
      type: String,
      //   required: true,
    },
    MachineStartTime: {
      type: String,
      //   required: true,
    },
    MachineEndTime: {
      type: String,
      //   required: true,
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

export const Shift = mongoose.model("Shift", shiftSchema);
