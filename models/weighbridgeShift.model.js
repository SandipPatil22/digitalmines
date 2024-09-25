import { Schema } from "mongoose";
import mongoose from "mongoose";

const weighbridgeShiftSchema = new Schema(
  {
    shiftName: {
      type: String,
      enum: ["Shift 1", "Shift 2"],
      //   required: true,
    },
    Weighbridge: {
      type: Schema.Types.ObjectId,
      ref: "Weighbridge",
    },
    startTime: {
      type: String,
      //   required: true,
    },
    endTime: {
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

export const WeighbridgeShift = mongoose.model(
  "WeighbridgeShift",
  weighbridgeShiftSchema
);
