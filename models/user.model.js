import { Schema } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      trim: true,
    },
   
    email: {
      type: String,

      trim: true,
      lowercase: true,
    },
    password: {
      type: String,

      minLength: 6,
    },
    profilePic: {
      type: String,
      default:
        "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQj5N93dERZzoGwY2hFoIRr435y5gSIUOVlguafyKFlDiKEEL6q",
    },
    phone: {
      type: String,
      default: "",

      trim: true,
    },
    location: {
      type: String,
      default: "",
    },
    role:{
      type:Schema.Types.ObjectId,
      ref:"Role",
    },
    status:{
      type:Boolean,
      default:true,
    }
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
