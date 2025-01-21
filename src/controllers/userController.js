import { User } from "../models/userModel.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = async (req, res, next) => {
  try {
    const { email, userName, password } = req.body;

    if ([email, userName, password].some((input) => input?.trim() === "")) {
      return res
        .status(400)
        .json(new ApiResponse("All fields are required", 400));
    }

    const existedUser = await User.findOne({
      $or: [{ email }, { userName }],
    });

    if (existedUser) {
      return res
        .status(409)
        .json(
          new ApiResponse(
            "User with this email or username already exists.",
            409
          )
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
      .json(new ApiResponse("User created successfully", 201, createdUser));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse("Error while creating the user", 500, error));
  }
  next();
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json(new ApiResponse("Please provide both email and password", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json(new ApiResponse("User not found", 404));
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json(new ApiResponse("Invalid password", 401));
    }

    const accessToken = await user.generateAccessToken();

    const data = {
      accessToken,
    };

    return res.status(200).json(new ApiResponse("Login successful", 200, data));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse("Error while logging in the user", 500, error));
  }
};

export { registerUser, loginUser };
