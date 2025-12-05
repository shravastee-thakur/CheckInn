import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { sanitizeMiddleware } from "./middleware/sanitize.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

import userRoutes from "./routes/userRoutes.js";

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
app.use("/api/v1/users", userRoutes);
// http://localhost:3000/api/v1/users/register

app.use(errorHandler);
export default app;
