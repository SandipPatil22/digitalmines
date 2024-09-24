
import { Schema } from "mongoose";
import mongoose from "mongoose";

const pitSchema = new Schema(
  {
    pitCode: {
      type: String,
      required: true,
      unique: true,
    },
    pitName: {
      type: String,
      required: true,
    },
    mineralsName: {
      type: String,
      required: true,
    },
    locationcoords: {
      type: String,
      required: true,
    },
    pitArea: {
      type: String,
      required: true,
    },
    pitLength: {
      type: String,
      required: true,
    },
    pitWidth: {
      type: String,
      required: true,
    },
    pitDepth: {
      type: String,
      required: true,
    },
    pitStatus: {
      type: String,
      enum: ["Active", "Inactive"],
      required: true,
    },
    mineId: {
      type: Schema.Types.ObjectId,
      ref: "Mines",
      required: true,
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

export const Pit = mongoose.model("Pit", pitSchema);
