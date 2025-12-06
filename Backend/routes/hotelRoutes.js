import express from "express";
import * as hotelController from "../controllers/HotelController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  hotelCreateSchema,
  hotelUpdateSchema,
} from "../validators/hotelValidator.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/createHotel",
  validate(hotelCreateSchema),
  authenticate,
  upload.single("photos"),
  hotelController.createHotel
);

// Get all hotels
router.get("/getHotels", hotelController.getAllHotels);

// Get a hotel by ID
router.get("/getHotelById/:id", hotelController.getHotelById);

// Update a hotel
router.put(
  "/updateHotel/:id",
  validate(hotelUpdateSchema),
  authenticate,
  upload.single("photos"),
  hotelController.updateHotel
);

// Delete a hotel
router.delete("/deleteHotel/:id", authenticate, hotelController.deleteHotel);

export default router;
