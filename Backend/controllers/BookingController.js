import * as bookingService from "../services/bookingService.js";
import logger from "../utils/logger.js";

export const createBookingController = async (req, res, next) => {
  try {
    const bookingData = {
      ...req.body,
      userId: req.user.id,
    };

    const booking = await bookingService.createBookingService(bookingData);

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

export const getBookingByIdController = async (req, res, next) => {
  const { bookingId } = req.params;
  try {
    const booking = await bookingService.getBookingByIdService(bookingId);

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
