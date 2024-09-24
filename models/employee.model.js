import { Schema } from "mongoose";
import mongoose from "mongoose";

const employeeSchema = new Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
        required: true,
    },
    fullname:{
        type: String,
        trim: true,
    },
    email: {
      type: String,
        required: true,
    },
    phone: {
      type: String,
        required: true,
    },
    corporation: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profilePic: {
      type: String,
      default:
        "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQj5N93dERZzoGwY2hFoIRr435y5gSIUOVlguafyKFlDiKEEL6q",
    },
    mine: {
      type: Schema.Types.ObjectId,
      ref: "Mines",
      default: null,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      default: null
    },
    supervisorId: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    token:{
        type:String,
        default:null,
    },
    address: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null
    },
    state: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },

    status: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
        default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Employee = mongoose.model("Employee", employeeSchema);
