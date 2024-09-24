import { Schema } from "mongoose";
import mongoose from "mongoose";

const loadingSchema = new Schema(
  {
    operatorName: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
      required: false,
    },
    unitId: {
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

export const Loading = mongoose.model("Loading", loadingSchema);
