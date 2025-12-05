import { redis } from "../config/redis.js";

export const saveResetToken = async (userId, hashedToken) => {
  await redis.set(`reset:${userId}`, hashedToken, { EX: 300 });
};

export const getResetToken = async (userId) => {
  return await redis.get(`reset:${userId}`);
};

export const deleteResetToken = async (userId) => {
  return await redis.del(`reset:${userId}`);
};
