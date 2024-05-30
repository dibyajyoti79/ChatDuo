import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/:id").get(protectRoute, getMessages);
router.route("/send/:id").post(protectRoute, sendMessage);
export default router;
