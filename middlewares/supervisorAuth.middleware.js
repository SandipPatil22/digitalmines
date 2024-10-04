import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Employee } from "../models/employee.model.js";



export const checkAuth=asyncHandler(async(req,res,next)=>{
    try {
        const token=await req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
      return res.status(400).json({message:"Unauthorized request"});
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await Employee.findById(decodedToken?.userId).select(
      "-password "
    );

    if(!user){
        return res.status(400).json({message:"Invalid Access Token"});
    }

    req.user = user;
    next();
    } catch (error) {
        throw new Error("Invalid access token");
    }
})