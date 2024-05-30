import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const signup = asyncHandler(async (req, res) => {
  const { fullName, username, password, confirmPassword, gender } = req.body;

  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords don't match");
  }
  if (password.length < 6) {
    throw new ApiError(400, "Password should be greater then 6 character");
  }

  const user = await User.findOne({ username });

  if (user) {
    throw new ApiError(400, "Username already taken");
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // https://avatar-placeholder.iran.liara.run/

  const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
  const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

  const newUser = new User({
    fullName,
    username: username,
    password: hashedPassword,
    gender,
    profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
  });

  if (newUser) {
    generateTokenAndSetCookie(newUser._id, res);
    await newUser.save();

    res.status(201).json(
      new ApiResponse(
        201,
        {
          _id: newUser._id,
          fullName: newUser.fullName,
          username: newUser.username,
          profilePic: newUser.profilePic,
        },
        "User Registration Successfull"
      )
    );
  } else {
    throw new ApiError(400, "Invalid user data");
  }
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user?.password || ""
  );

  if (!user || !isPasswordCorrect) {
    throw new ApiError(400, "Invalid username or password");
  }

  generateTokenAndSetCookie(user._id, res);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        profilePic: user.profilePic,
      },
      "Login Successfull"
    )
  );
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});
