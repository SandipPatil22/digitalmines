import { Schema } from "mongoose";
import mongoose from "mongoose";

const operatorSchema = new Schema(
  {
    operatorName: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    role: {
      type: String,
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

export const Operator = mongoose.model("Operator", operatorSchema);
