import Booking from "../models/BookingModel.js";
import { Stripe } from "stripe";
import dotenv from "dotenv";
import Payment from "../models/PaymentModel.js";
dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const createBooking = (data, options = {}) =>
  Booking.create(data, options);

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

export const findOverlapping = async (roomId, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw ApiError(400, "Invalid date format");
  }

  return await Booking.countDocuments({
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

export const findAllBookings = async (filters = {}) => {
  const query = {};

  if (filters.status) query.status = filters.status;
  if (filters.userId) query.userId = filters.userId;
  if (filters.hotelId) query.hotelId = filters.hotelId;

  if (filters.startDate || filters.endDate) {
    query.startDate = {};
    if (filters.startDate) query.startDate.$gte = new Date(filters.startDate);
    if (filters.endDate) query.startDate.$lte = new Date(filters.endDate);
  }

  return await Booking.find(query)
    .select("userId roomId hotelId startDate endDate totalAmount status")
    .populate("userId", "email")
    .populate("roomId", "type -_id")
    .populate("hotelId", "name city -_id")
    .sort({ createdAt: -1 });
};

export const createCheckoutSession = async (booking, amount) => {
  return await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: booking.hotelId.name,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],

    success_url: `${process.env.FRONTEND_URL}/payment-success/${booking._id}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-failure`,
  });
};

export const createPayment = (paymentData) => Payment.create(paymentData);

export const findPayment = (filter) => Payment.findOne(filter);

export const removeBooking = (id) => Booking.findByIdAndDelete(id);
