import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  searchUser,
  getUserDetails,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);
router.get("/search/:username", protectRoute, searchUser);
router.get("/:id", protectRoute, getUserDetails);

export default router;
