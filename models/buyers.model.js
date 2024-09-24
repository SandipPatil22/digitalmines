import { Schema } from "mongoose";
import mongoose from "mongoose";

const buyersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    corporation: {
      type: Schema.Types.ObjectId,
      ref: "User",
      
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

export const Buyers = mongoose.model("Buyers", buyersSchema);
