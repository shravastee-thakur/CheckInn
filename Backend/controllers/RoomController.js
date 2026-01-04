import * as roomService from "../services/roomService.js";
import logger from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";

export const createRoom = async (req, res, next) => {
  const { hotelId, type, description, price, maxPeople } = req.body;

  try {
    const fileBuffer = req.file ? req.file.buffer : null;
    console.log(fileBuffer);

    const roomData = {
      hotelId,
      type,
      description,
      price,
      maxPeople,
    };

    const room = await roomService.createRoom(roomData, fileBuffer);
    console.log("r", room);
    

    return res.status(201).json({
      success: true,
      room,
      message: "Room created successfully",
    });
  } catch (error) {
    logger.error(`Create room error: ${error.message}`);
    next(error);
  }
};

export const getRoomById = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const room = await roomService.getRoomById(roomId);
    if (!room) {
      throw ApiError(404, "Rooms not found");
    }

    return res
      .status(200)
      .json({ success: true, message: "Room fetched successfully", room });
  } catch (error) {
    logger.error(`Get room by id error: ${error.message}`);
    next(error);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const fileBuffer = req.file ? req.file.buffer : null;

    const updatedRoom = await roomService.updateRoom(
      roomId,
      req.body,
      fileBuffer
    );

    return res.status(201).json({
      success: true,
      updatedRoom,
      message: "Room updated successfully",
    });
  } catch (error) {
    logger.error(`Update room error: ${error.message}`);
    next(error);
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    await roomService.deleteRoom(roomId);
    return res
      .status(200)
      .json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    logger.error(`Delete room error: ${error.message}`);
    next(error);
  }
};
