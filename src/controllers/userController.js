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
      res.json(
        new ApiError(
          409,
          "",
          "User with this email or username already exists."
        )
      );
      return;
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
    res.json(new ApiError(404, "", ["Error while creating the user", error]));
  }
  next();
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.json(new ApiError(401, "", "Please provide both fields."));
      return;
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      res.json(new ApiError("404", "", "User not found."));
      return;
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      res.json(new ApiError(404, "", "Invalid Password"));
      return;
    }

    const accessToken = await user.generateAccessToken();

    const data = {
      accessToken,
    };

    return res.status(201).json(new ApiResponse("Login Successful", 200, data));
  } catch (error) {
    console.log(error);
    res.json(new ApiError(404, "", "Error while login the user"));
  }
};

export { registerUser, loginUser };
