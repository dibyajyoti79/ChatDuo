// import User from "../models/user.model.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { asyncHandler } from "../utils/asyncHandler.js";

// export const getUsersForSidebar = asyncHandler(async (req, res) => {
//   const loggedInUserId = req.user._id;

//   const filteredUsers = await User.find({
//     _id: { $ne: loggedInUserId },
//   }).select("-password");

//   res
//     .status(200)
//     .json(new ApiResponse(200, filteredUsers, "Users Fetched Successsfully"));
// });

import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const getUsersForSidebar = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user._id;

  // Fetch conversations of the logged-in user, sorted by the latest message timestamp
  const conversations = await Conversation.find({
    participants: { $in: [loggedInUserId] },
  })
    .sort({ updatedAt: -1 })
    .populate({
      path: "participants",
      select: "-password",
    });

  // Extract user details and filter out the logged-in user
  const users = [];
  const userIds = new Set();

  conversations.forEach((conversation) => {
    conversation.participants.forEach((participant) => {
      if (
        participant._id.toString() !== loggedInUserId.toString() &&
        !userIds.has(participant._id.toString())
      ) {
        users.push(participant);
        userIds.add(participant._id.toString());
      }
    });
  });

  res
    .status(200)
    .json(new ApiResponse(200, users, "Users Fetched Successfully"));
});

export const searchUser = asyncHandler(async (req, res, next) => {
  const loggedInUserId = req.user._id;
  const { username } = req.params;
  // Search for users by username, excluding the logged-in user
  const users = await User.find({
    username: { $regex: username, $options: "i" },
    _id: { $ne: loggedInUserId },
  }).select("-password");

  res
    .status(200)
    .json(new ApiResponse(200, users, "Users Fetched Successsfully"));
});
export const getUserDetails = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // Search for users by username, excluding the logged-in user
  const user = await User.findById(id).select("-password");
  if (!user) throw new ApiError(400, "User not found");
  res
    .status(200)
    .json(new ApiResponse(200, user, "User Fetched Successsfully"));
});
