import { Worker } from "bullmq";
import { redis } from "../config/redis.js";
import sendMail from "../config/sendMail.js";
import logger from "../utils/logger.js";

const mailWorker = new Worker(
  "mailQueue", // Must match the name in your Queue setup
  async (job) => {
    const { email, subject, htmlContent } = job.data;
    await sendMail(email, subject, htmlContent);
  },
  { connection: redis, concurrency: 5 }
);

mailWorker.on("completed", (job) => {
  logger.info(`Email job ${job.id} completed for ${job.data.email}`);
});

mailWorker.on("failed", (job, err) => {
  logger.error(`Email job ${job.id} failed: ${err.message}`);
});

export default mailWorker;
