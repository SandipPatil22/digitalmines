import { Schema } from "mongoose";
import mongoose from "mongoose";

const destinationSchema = new Schema(
  {
    destinationName: {
      type: String,
    },
    destinationLocation: {
      type: String,
    },
    destinationType: {
      type: String,
      enum:["Stockpile","Dumpyard"]
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

export const Destination = mongoose.model("Destination", destinationSchema);
