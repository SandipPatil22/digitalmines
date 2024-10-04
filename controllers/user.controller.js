import { User } from "../models/user.model.js";

import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";

import s3Upload from "../global/s3.controller.js";

const createUser = asyncHandler(async (req, res) => {
  const { fname, lname, email, password, role, phone, location } = req.body;
  
  if(!fname || !lname || !email || !password || !role || !phone || !location){
    return res.status(400).json({message: "Please fill in all fields"})
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  const fullname = `${fname} ${lname}`;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    fname,
    lname,
    fullname,
    email,
    password: hashedPassword,
    phone,
    location,
    role,
  });

  if (user) {
    return res.status(200).json({
      message: "User created successfully",
      user,
    });
  } else {
    return res.status(400).json({ message: "User not created" });
  }
});


const loginUser=asyncHandler(async(req,res)=>{
  const {email,password}=req.body;
  if(!email || !password){
    return res.status(400).json({message: "Please fill in all fields"})
  }
  const user=await User.findOne({email}).populate("role");
  if(!user){
    return res.status(404).json({message: "User not found"})
  }
  if(user && (await bcrypt.compare(password,user.password))){
    return res.status(200).json({
      message: "User logged in successfully",
      user,
      token:generateToken(user._id),
    });
  } else {
    return res.status(400).json({message: "Invalid email or password"})
  }

})

const deleteuser = asyncHandler(async(req,res)=>{
  const user= await User.findById(req.params.id)

  if (user) {
user.status=false
await user.save()
res.json({message:"User Removed"})    
  } else {
    res.status(404)
  throw new Error("user not found ")
  }
})
export { createUser , loginUser, deleteuser};
