import { Redis } from "ioredis";
import { Queue } from "bullmq";
import dotenv from "dotenv";
dotenv.config();

export const redis = new Redis(process.env.IOREDIS_URL, {
  maxRetriesPerRequest: null,
});

export const mailQueue = new Queue("mailQueue", { connection: redis });
