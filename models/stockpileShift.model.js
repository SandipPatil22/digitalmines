import { Schema } from "mongoose";
import mongoose from "mongoose";

const stockpileShiftSchema = new Schema(
  {
    shiftName: {
      type: String,
      enum: ["Shift 1", "Shift 2"],
      //   required: true,
    },
   
    stockpile: {
        type: Schema.Types.ObjectId,
        ref: "Stockpile",
       
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

export const StockpileShift = mongoose.model(
  "StockpileShift",
  stockpileShiftSchema
);
