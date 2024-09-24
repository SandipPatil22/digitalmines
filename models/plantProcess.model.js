import { Schema } from "mongoose";
import mongoose from "mongoose";

const plantProcessProductSchema = new Schema(
  {
    loading: {
      type: Schema.Types.ObjectId,
      ref: "Loading",
    },
    plantId: {
      type: Schema.Types.ObjectId,
      ref: "Plant",
    },
    // stockpile: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Stockpile",
    // },
    loadingOperator: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    dumperOperator: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
    },
    dumper: {
      type: Schema.Types.ObjectId,
      ref: "Dumper",
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
    // weight: {
    //   type: String,
    //   default: null,
    // },
    // destination: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Destination",
    // },
    // buyer: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Buyers",
    // },
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
  {
    timestamps: true,
  }
);

export const PlantProcessProduct = mongoose.model(
  "PlantProcessProduct",
  plantProcessProductSchema
);
