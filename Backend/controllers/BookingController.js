import * as bookingService from "../services/bookingService.js";
import logger from "../utils/logger.js";
import sendMail from "../config/sendMail.js";
import { mailQueue } from "../config/redis.js";

export const checkRoomAvailability = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { startDate, endDate } = req.query;

    const availability = await bookingService.checkAvailability(
      roomId,
      startDate,
      endDate
    );

    res.status(200).json({ success: true, availability });
  } catch (error) {
    next(error);
  }
};

export const createBookingController = async (req, res, next) => {
  try {
    const bookingData = {
      ...req.body,
      userId: req.user.id,
    };

    const { booking } = await bookingService.createBookingService(bookingData);

    return res.status(201).json({
      success: true,
      booking,
      message: "Booking created successfully",
    });
  } catch (error) {
    logger.error(`Create booking error: ${error.message}`);
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const filters = req.query;

    const bookings = await bookingService.getBookingsService(filters);

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    logger.error(`Error in get all bookings: ${error.message}`);
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const bookings = await bookingService.getMyBookingService(userId);

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    logger.error(`Error in get my booking: ${error.message}`);
    next(error);
  }
};

export const cancelBookingcontroller = async (req, res, next) => {
  const { bookingId } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;
  try {
    const booking = await bookingService.cancelBookingService(
      bookingId,
      userId,
      userRole
    );
    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    logger.error(`Cancel booking error: ${error.message}`);
    next(error);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    await bookingService.deleteBookingService(bookingId);

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    logger.error(`Error in delete booking: ${error.message}`);
    next(error);
  }
};

export const stripePayment = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    const { booking, sessionUrl } = await bookingService.paymentService(
      bookingId
    );

    const htmlContent = `
            <h2>Booking Details</h2>
            <p>Dear ${booking.userId.username},</p>
            <p>Thankyou for availing our service.</p>
            <ul>
              <li><strong>Booking ID: </strong>${bookingId}</li>
              <li><strong>Hotel Name: </strong>${booking.hotelId.name}</li>
              <li><strong>Location: </strong>${booking.hotelId.city}</li>
              <li><strong>Date: </strong>${booking.startDate.toLocaleDateString(
                "en-GB"
              )}</li>
              <li><strong>Total Amount: </strong>₹ ${booking.totalAmount.toLocaleString()}</li>
            </ul>
            <p>We look forward to welcome you.</p>
          `;

    await mailQueue.add(
      "sendBookingDetails",
      {
        to: booking.userId.email,
        subject: "Hotel Booking Details",
        htmlContent,
      },
      { attempts: 3, backoff: { type: "exponential", delay: 2000 } }
    );

    res.json({ success: true, url: sessionUrl });
  } catch (error) {
    logger.error(`Error in stripe payment: ${error.message}`);
    next(error);
  }
};
