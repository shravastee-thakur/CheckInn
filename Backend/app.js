import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { sanitizeMiddleware } from "./middleware/sanitize.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

import userRoutes from "./routes/userRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(sanitizeMiddleware);

// Routes
app.use("/api/v1/user", userRoutes);
// http://localhost:3000/api/v1/user/register

app.use("/api/v1/hotel", hotelRoutes);
// http://localhost:3000/api/v1/hotel/createHotel

app.use("/api/v1/room", roomRoutes);
// http://localhost:3000/api/v1/room/createRoom

app.use("/api/v1/booking", bookingRoutes);
// http://localhost:3000/api/v1/booking/createBooking

app.use(errorHandler);
export default app;
