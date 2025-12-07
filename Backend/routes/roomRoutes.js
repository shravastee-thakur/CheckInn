import express from "express";
import * as roomController from "../controllers/RoomController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Create a room
router.post(
  "/createRoom/:hotelId",
  authenticate,
  upload.single("image"),
  roomController.createRoom
);

// Check room availability for selected dates
router.post(
  "/checkAvailability",
  authenticate,
  roomController.checkRoomAvailability
);

// Update room details
router.put(
  "/updateRoom/:id",
  authenticate,
  upload.single("image"),
  roomController.updateRoom
);

export default router;
