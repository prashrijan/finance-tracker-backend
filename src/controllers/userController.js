import { User } from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = async (req, res, next) => {
  try {
    const { email, userName, password } = req.body;

    if ([email, userName, password].some((input) => input?.trim() === "")) {
      throw new ApiError(404, "All fields are required");
    }

    const existedUser = await User.findOne({
      $or: [{ email }, { userName }],
    });

    if (existedUser) {
      console.log(100, existedUser);
      return res.json(
        new ApiError(409, "", [
          "User with this email or username already exists.",
        ])
      );
    }

    const user = await User.create({
      userName: userName.toLowerCase(),
      email,
      password,
    });

    const createdUser = await User.findById(user._id).select("-password");

    return res
      .status(201)
      .json(new ApiResponse("User Created Successfully", 200, createdUser));
  } catch (error) {
    console.error("Error creating the user.", error);
  }
};

export { registerUser };
