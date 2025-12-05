import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/connectDb.js";
import logger from "./utils/logger.js";

connectDB();
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  logger.info(`Server running on port: http://localhost:${PORT}`);
});
