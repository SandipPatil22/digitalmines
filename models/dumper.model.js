import { Schema } from "mongoose";
import mongoose from "mongoose";

const dumperSchema = new Schema(
  {
    dumperNumber: {
      type: String,
    },
    dumperCapacity: {
      type: String,
    },
    operatorName: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
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

export const Dumper = mongoose.model("Dumper", dumperSchema);
