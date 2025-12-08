import * as bookingService from "../services/bookingService.js";
import logger from "../utils/logger.js";

export const createBookingController = async (req, res, next) => {
  try {
    const { userId, roomId, startDate, endDate, totalAmount } = req.body;

    const booking = await bookingService.createBookingService(
      userId,
      roomId,
      startDate,
      endDate,
      totalAmount
    );
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

export const getBookingByUserscontroller = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const bookings = await bookingService.getBookingByUserService(userId);
    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    logger.error(`Get booking by user error: ${error.message}`);
    next(error);
  }
};

export const getBookingByIdController = async (req, res, next) => {
  const { bookingId } = req.params;
  try {
    const booking = await bookingService.getBookingByIdService(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    logger.error(`Get booking by id error: ${error.message}`);
    next(error);
  }
};

export const cancelBookingcontroller = async (req, res, next) => {
  const { bookingId } = req.params;
  try {
    const booking = await bookingService.cancelBookingService(bookingId);
    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    logger.error(`Cancel booking error: ${error.message}`);
    next(error);
  }
};
