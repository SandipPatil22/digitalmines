import { Schema } from "mongoose";
import mongoose from "mongoose";

const minesSchema = new Schema(
  {
    corporation:{
      type:Schema.Types.ObjectId,
      ref:"User",
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    mineCode: {
      type: String,
      required: true,
      unique: true,
    },
    mineralsName: {
      type: String,
      required: true,
    },
    village: {
      type: String,
      required: true,
    },
    taluka: {
      type: String,
      required: true,
    },
    postOffice: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    faxNo: {
      type: String,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobileNo: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Mines = mongoose.model("Mines", minesSchema);
