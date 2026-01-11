import * as bookingRepo from "../repositories/bookingRepo.js";
import * as roomRepo from "../repositories/roomRepo.js";
import { ApiError } from "../utils/ApiError.js";
import { redis } from "../config/redis.js";
import mongoose from "mongoose";

export const checkAvailability = async (roomId, startDate, endDate) => {
  const room = await roomRepo.findRoomById(roomId);
  if (!room) throw ApiError(404, "Room not found");

  const bookedCount = await bookingRepo.findOverlapping(
    roomId,
    startDate,
    endDate
  );

  const availableRooms = room.quantity - bookedCount;

  return {
    isAvailable: availableRooms > 0,
    remainingQuantity: availableRooms > 0 ? availableRooms : 0,
  };
};

export const createBookingService = async (bookingData) => {
  const { roomId, startDate, endDate } = bookingData;

  // 1. REDIS LOCK: Prevent two users from checking availability for the same room simultaneously
  const lockKey = `lock:room:${roomId}`;
  const acquired = await redis.set(lockKey, "locked", "NX", "EX", 10);

  if (!acquired) {
    throw ApiError(
      429,
      "This room is currently being processed. Please try again in a few seconds."
    );
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // 2. CHECK INVENTORY
    const room = await roomRepo.findRoomById(roomId);
    if (!room) throw ApiError(404, "Room not found");

    const activeBookingsCount = await bookingRepo.findOverlapping(
      roomId,
      startDate,
      endDate
    );

    if (activeBookingsCount >= room.quantity) {
      throw ApiError(
        400,
        `No ${room.type} rooms available for the selected dates.`
      );
    }

    const booking = await bookingRepo.createBooking([bookingData], { session });

    await session.commitTransaction();
    return { booking: booking[0] };
  } catch (error) {
    await session.abortTransaction();
    if (error.code === 11000) {
      throw ApiError(409, "This booking request has already been processed.");
    }
    throw error;
  } finally {
    session.endSession();
    await redis.del(lockKey);
  }
};

export const getBookingsService = async (queryParams) => {
  return await bookingRepo.findByQuery(queryParams);
};

export const getMyBookingService = async (userId) => {
  const booking = await bookingRepo
    .findBookingByUser(userId)
    .select("roomId hotelId startDate endDate totalAmount status")
    .populate("roomId", "type -_id")
    .populate("hotelId", "name city -_id")
    .sort({ createdAt: -1 });

  if (!booking) {
    throw ApiError(404, "Bookings not found");
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

export const deleteBookingService = async (bookingId) => {
  const booking = await bookingRepo.findBookingById(bookingId);
  if (!booking) {
    throw ApiError(404, "Booking not found");
  }

  return await bookingRepo.removeBooking(bookingId);
};

export const paymentService = async (bookingId) => {
  const booking = await bookingRepo
    .findBookingById(bookingId)
    .select("userId hotelId totalAmount startDate")
    .populate("userId", "username email -_id")
    .populate("hotelId", "name city -_id");

  if (!booking) {
    throw ApiError(404, "Booking not found");
  }

  const amountToCharge = booking.totalAmount;

  const session = await bookingRepo.createCheckoutSession(
    booking,
    amountToCharge
  );

  await booking.updateOne({ status: "confirmed" });

  return { booking, sessionUrl: session.url };
};
