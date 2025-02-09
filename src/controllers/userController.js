import { User } from "../models/userModel.js";
import ApiResponse from "../utils/ApiResponse.js";
import { isPasswordStrong } from "../utils/passwordStrength.js";

// register user
const registerUser = async (req, res) => {
    try {
        const { email, userName, password, confirmPassword } = req.body;

        if ([email, userName, password].some((input) => input?.trim() === "")) {
            return res
                .status(400)
                .json(new ApiResponse("All fields are required", 400));
        }

        const isPassStrong = isPasswordStrong(password);

        if (!isPassStrong) {
            return res
                .status(400)
                .json(
                    new ApiResponse(
                        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.",
                        409
                    )
                );
        }

        if (password !== confirmPassword) {
            return res
                .status(400)
                .json(
                    new ApiResponse(
                        "Password and confirm password must match.",
                        409
                    )
                );
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
            .json(
                new ApiResponse("User created successfully", 201, createdUser)
            );
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json(new ApiResponse("Error while creating the user", 500, error));
    }
};

// login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json(
                    new ApiResponse(
                        "Please provide both email and password",
                        400
                    )
                );
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json(new ApiResponse("User not found", 404));
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json(new ApiResponse("Invalid password", 401));
        }

        const accessToken = await user.generateAccessToken();

        const data = {
            accessToken,
            user,
        };

        return res
            .status(200)
            .json(new ApiResponse("Login successful", 200, data));
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json(
                new ApiResponse("Error while logging in the user", 500, error)
            );
    }
};

// get user
const getUser = async (req, res) => {
    const userData = req.userData;

    if (!userData) {
        return res.status(404).json({
            status: "Failed",
            message: "User not found",
        });
    }

    return res.status(200).json({
        status: "success",
        message: "User found",
        userData,
    });
};

// reset password
const resetPassword = async (req, res) => {
    try {
        const userData = req.userData;
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        if (!oldPassword && !newPassword && !confirmNewPassword) {
            return res.status(400).json({
                status: "failed",
                message: "All fields are required",
            });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({
                status: "failed",
                message: "New password cannot be the same as the old password",
            });
        }

        const user = await User.findOne({ _id: userData._id });

        if (!user) {
            return res.status(404).json({
                status: "failed",
                message: "User not found",
            });
        }

        const isPasswordValid = await user.isPasswordCorrect(oldPassword);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json(new ApiResponse("Invalid password", 401));
        }

        const isNewPassStrong = isPasswordStrong(newPassword);

        if (!isNewPassStrong) {
            return res
                .status(400)
                .json(
                    new ApiResponse(
                        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.",
                        409
                    )
                );
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                status: "failed",
                message: "New password and confirm password do not match",
            });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({
            status: "success",
            message: "Password reset successful",
        });
    } catch (error) {
        console.error("Error reseting the password: ", error);
        return res.status(500).json({
            status: "failed",
            message: "Internal Server Error",
        });
    }
};
export { registerUser, loginUser, getUser, resetPassword };
