import { Schema } from "mongoose";
import mongoose from "mongoose";

const benchSchema = new Schema(
  {
    pit: {
      type: Schema.Types.ObjectId,
      ref: "Pit",
    },
    benchName: {
      type: String,
    },
    benchLocation: {
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

export const Bench = mongoose.model("Bench", benchSchema);
