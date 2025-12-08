import Booking from "../models/BookingModel.js";

export const createBookingRepo = async (data) => {
  const booking = await Booking.create(data);
  return booking;
};

export const getBookingByUserRepo = async (userId) => {
  return await Booking.find({ userId });
};

export const getBookingByIdRepo = async (id) => {
  return await Booking.findById(id);
};

export const cancelBookingRepo = async (id) => {
  return await Booking.findByIdAndUpdate(
    id,
    { status: "canceled" },
    { new: true }
  );
};

export const checkRoomAvailabilityRepo = async (roomId, startDate, endDate) => {
  const conflictingBookings = await Booking.find({
    roomId,
    status: { $ne: "cancelled" },
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
      { startDate: { $gte: startDate }, endDate: { $lte: endDate } },
    ],
  });

  return conflictingBookings.length > 0;
};
