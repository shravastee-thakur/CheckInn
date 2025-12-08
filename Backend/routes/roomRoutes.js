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

// Get rooms
router.get("/getRooms", roomController.getRooms);

// Get room by id
router.get("/getRoomById/:roomId", roomController.getRoomById);

// Check room availability for selected dates
// router.post(
//   "/checkAvailability",
//   authenticate,
//   roomController.checkRoomAvailability
// );

// Update room details
router.put(
  "/updateRoom/:roomId",
  authenticate,
  upload.single("image"),
  roomController.updateRoom
);

router.delete("/deleteRoom/:roomId", authenticate, roomController.deleteRoom);

export default router;
