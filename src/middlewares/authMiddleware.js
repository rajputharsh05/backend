import { ApiError } from "../utils/APIerrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.body.accessToken;

    if (!token) {
      throw new ApiError(401, "Unauthorized request ");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const UserInformationFromToken = await User.findById(
      decodedToken?._id
    ).select("-password -refreshToken");

    if (!UserInformationFromToken) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = UserInformationFromToken;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
