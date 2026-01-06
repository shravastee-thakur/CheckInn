import express from "express";
import * as bookingController from "../controllers/BookingController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { allowRole } from "../middleware/roleMidleware.js";

const router = express.Router();

router.post(
  "/createBooking",
  authenticate,
  bookingController.createBookingController
);
router.get("/getMyBookings", authenticate, bookingController.getMyBookings);
router.get(
  "/checkRoomAvailability/:roomId",
  bookingController.checkRoomAvailability
);
router.put(
  "/cancelBooking/:bookingId",
  authenticate,
  bookingController.cancelBookingcontroller
);
router.post("/payment", authenticate, bookingController.stripePayment);

//admin
router.get(
  "/getAllBookings",
  authenticate,
  allowRole("admin"),
  bookingController.getAllBookings
);
router.delete(
  "/deleteBooking/:bookingId",
  authenticate,
  allowRole("admin"),
  bookingController.deleteBooking
);

export default router;
