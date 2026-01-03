import express from "express";
import * as roomController from "../controllers/RoomController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import { allowRole } from "../middleware/roleMidleware.js";

const router = express.Router();

// Create a room
router.post(
  "/createRoom/:hotelId",
  authenticate,
  allowRole("admin"),
  upload.single("image"),
  roomController.createRoom
);

// Get rooms
router.get("/getRooms", roomController.getRooms);

// Get room by id
router.get("/getRoomById/:roomId", roomController.getRoomById);

// Update room details
router.put(
  "/updateRoom/:roomId",
  authenticate,
  allowRole("admin"),
  upload.single("image"),
  roomController.updateRoom
);

router.delete(
  "/deleteRoom/:roomId",
  authenticate,
  allowRole("admin"),
  roomController.deleteRoom
);

export default router;
