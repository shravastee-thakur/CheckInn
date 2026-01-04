import * as bookingRepo from "../repositories/bookingRepo.js";
import * as hotelRepo from "../repositories/hotelRepo.js";
import * as roomRepo from "../repositories/roomRepo.js";
import { ApiError } from "../utils/ApiError.js";

export const checkAvailability = async (roomId, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    throw ApiError(400, "Check-out date must be after check-in date");
  }

  const overLaps = await bookingRepo.findOverlapping(
    roomId,
    startDate,
    endDate
  );

  return {
    isAvailable: overLaps.length === 0,
    conflictingBookings: overLaps,
  };
};

export const createBookingService = async (bookingData) => {
  const { userId, roomId, hotelId, startDate, endDate, totalAmount } =
    bookingData;

  const room = await roomRepo.findRoomById(roomId);
  const hotel = await hotelRepo.findHotelById(hotelId);
  if (!room || !hotel) throw ApiError(404, "Room or Hotel not found");

  const { isAvailable } = await checkAvailability(roomId, startDate, endDate);
  if (!isAvailable) {
    throw ApiError(400, "Room is already booked for the selected dates.");
  }
  return await bookingRepo.createBooking(bookingData);
};

export const getBookingByIdService = async (userId) => {
  const booking = await bookingRepo.findBookingById(userId);
  if (!booking) {
    throw ApiError(404, "Booking not found");
  }
  return booking;
};

export const getBookingByUserService = async (userId) => {
  const booking = await bookingRepo.findBookingByUser(userId);
  if (!booking) {
    throw ApiError(404, "Booking not found");
  }
  return booking;
};

export const cancelBookingService = async (bookingId) => {
  const booking = await bookingRepo.findBookingById(bookingId);
  if (!booking) {
    throw ApiError(404, "Booking not found");
  }

  if (booking.userId.toString() !== userId && userRole !== "admin") {
    throw ApiError(403, "Not authorized");
  }

  if (booking.status === "cancelled") throw ApiError(400, "Already cancelled");

  return await bookingRepo.updateStatus(bookingId, "cancelled");
};
