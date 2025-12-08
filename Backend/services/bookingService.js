import * as bookingRepo from "../repositories/bookingRepo.js";
import * as roomRepo from "../repositories/roomRepo.js";
import { ApiError } from "../utils/ApiError.js";

export const createBookingService = async (
  userId,
  roomId,
  startDate,
  endDate,
  totalAmount
) => {
  const isAvailable = await bookingRepo.checkRoomAvailabilityRepo(
    roomId,
    startDate,
    endDate
  );
  if (isAvailable) {
    throw ApiError(400, "Room is already booked for the selected dates.");
  }

  const bookingData = {
    userId,
    roomId,
    hotelId: (await roomRepo.findRoomById(roomId)).hotelId,
    startDate,
    endDate,
    totalAmount,
    paymentStatus: "pending",
  };

  const booking = await bookingRepo.createBookingRepo(bookingData);
  return booking;
};

export const getBookingByIdService = async (userId) => {
  return await bookingRepo.getBookingByIdRepo(userId);
};

export const getBookingByUserService = async (userId) => {
  return await bookingRepo.getBookingByUserRepo(userId);
};

export const cancelBookingService = async (bookingId) => {
  const booking = await bookingRepo.getBookingByIdRepo(bookingId);
  if (!booking) {
    return res.status(400).json({
      success: false,
      message: "Booking not found",
    });
  }

  booking.status = "cancelled";
  await booking.save();
  return booking;
};
