import { Schema } from "mongoose";
import mongoose from "mongoose";

const weighbridgeSchema = new Schema(
  {
    dumper: {
      type: Schema.Types.ObjectId,
      ref: "Dumper",
    },
    dumperOperator: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
    },
    weight: {
      type: String,
    },
    WeighbridgeName: {
      type: String,
      //   required: true,
    },
    mine: {
      type: Schema.Types.ObjectId,
      ref: "Mines",
    },
    loading: {
      type: Schema.Types.ObjectId,
      ref: "Loading",
    },
    loadingOperator: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
    },
    trip: {
      type: Schema.Types.ObjectId,
      ref: "Trip",
    },
    material: {
      type: String,
    },
    destination: {
      type: Schema.Types.ObjectId,
      ref: "Destination",
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
  },
  { timestamps: true }
);

export const Weighbridge = mongoose.model("Weighbridge", weighbridgeSchema);
