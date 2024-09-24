import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      (await req.cookies?.accessToken) ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("Unauthorized request");
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken?.userId).select("password ");

    if (!user) {
      throw new Error("Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new Error ("invalid access token")
  }
});
