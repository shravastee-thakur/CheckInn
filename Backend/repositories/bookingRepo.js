import Booking from "../models/BookingModel.js";

export const createBooking = (data) => Booking.create(data);

export const findBookingByUser = (userId) => Booking.find({ userId });

export const findBookingById = (id) => Booking.findById(id);

export const findByQuery = (query) =>
  Booking.find(query)
    .populate("userId", "email")
    .populate("roomId", "type")
    .populate("hotelId", "name city")
    .sort({ createdAt: -1 });

export const updateStatus = (id, status) =>
  Booking.findByIdAndUpdate(id, { status }, { new: true });

export const findOverlapping = (roomId, startDate, endDate) => {
  return Booking.find({
    roomId,
    status: { $in: ["pending", "confirmed"] },
    $or: [
      {
        startDate: { $lt: new Date(endDate) },
        endDate: { $gt: new Date(startDate) },
      },
    ],
  });
};

export const removeBooking = (id) => Booking.findByIdAndDelete(id);
