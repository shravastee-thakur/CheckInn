import express from "express";
import * as bookingController from "../controllers/BookingController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new booking
router.post(
  "/createBooking",
  authenticate,
  bookingController.createBookingController
);

// Get booking by ID
router.get(
  "/getBookingById/:bookingId",
  authenticate,
  bookingController.getBookingByIdController
);

// Get bookings by user
router.get(
  "/getBookingsByUser/:userId",
  authenticate,
  bookingController.getBookingByUserscontroller
);

// Cancel a booking
router.put(
  "/cancelBooking/:bookingId",
  authenticate,
  bookingController.cancelBookingcontroller
);

export default router;
