import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import ApiResponse from "../utils/ApiResponse.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    if (!decoded?.email) {
      return res
        .status(401)
        .json(new ApiResponse("Unauthorized access. Invalid token.", 401));
    }

    const userData = await User.findOne({
      email: decoded.email,
      userName: decoded.userName,
    });

    if (!userData) {
      return res
        .status(401)
        .json(new ApiResponse("Unauthorized access. Invalid token.", 401));
    }

    req.userData = userData;
    next();
  } catch (error) {
    console.error(`Error authenticating user ${error}`);
    return res
      .status(401)
      .json(new ApiResponse("Error authenticating the token", 401));
  }
};
