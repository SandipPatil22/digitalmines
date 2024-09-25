import { Schema } from "mongoose";
import mongoose from "mongoose";

const targetSchema = new Schema(
  {
    materialTarget: {
      type: String,
      required: true,
    },
    wasteTarget: {
      type: String,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    achiveTarget: {
      type: String,
    },
    corporation: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    Plant: {
      type: Schema.Types.ObjectId,
      ref: "Plant",
      default: null,
    },
    stockpile: {
      type: Schema.Types.ObjectId,
      ref: "Stockpile",
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
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

export const Target = mongoose.model("Target", targetSchema);
