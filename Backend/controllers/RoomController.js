import * as roomService from "../services/roomService.js";
import * as hotelService from "../services/hotelService.js";
import { uploadImageToCloudinary } from "../config/cloudinary.js";
import logger from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";

export const createRoom = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    if (!hotelId) {
      throw ApiError(400, "Hotel ID is required.");
    }

    const hotel = await hotelService.findHotelById(hotelId);
    if (!hotel) {
      throw ApiError(404, "Hotel not found.");
    }

    let imageData = null;

    if (req.file) {
      try {
        const uploadImage = await uploadImageToCloudinary(req.file.buffer);
        imageData = {
          url: uploadImage.secure_url,
          public_id: uploadImage.public_id,
        };
      } catch (uploadError) {
        logger.error(`Image upload error: ${uploadError.message}`);
        return res.status(500).json({
          message: "Failed to upload image",
          error: uploadError.message,
        });
      }
    } else {
      throw ApiError(
        400,
        "Image is required. Please upload an image or provide an image URL."
      );
    }

    const roomData = {
      hotelId,
      image: imageData,
      type: req.body.type,
      desc: req.body.desc,
      price: req.body.price,
      maxPeople: req.body.maxPeople,
    };

    const room = await roomService.createRoom(roomData);

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

export const getRooms = async (req, res, next) => {
  try {
    const rooms = await roomService.getRooms();
    if (!rooms) {
      throw ApiError(404, "Rooms not found");
    }

    return res
      .status(200)
      .json({ success: true, message: "Rooms fetched successfully", rooms });
  } catch (error) {
    logger.error(`Get All rooms error: ${error.message}`);
    next(error);
  }
};

export const getRoomById = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const room = await roomService.findRoomById(roomId);
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
    const updateData = req.body;

    const room = await roomService.findRoomById(roomId);
    if (!room) {
      throw ApiError(404, "Rooms not found");
    }

    let updatedImage = room.image;

    if (req.file) {
      if (room.image && room.image[0]?.public_id) {
        await cloudinary.uploader.destroy(room.image[0].public_id);
      }

      // Upload new image
      const uploadedImg = await uploadImageToCloudinary(req.file.buffer);
      updatedImage = [
        {
          url: uploadedImg.secure_url,
          public_id: uploadedImg.public_id,
        },
      ];
    }

    const updatedRoom = await roomService.updateRoom(id, {
      ...updateData,
      image: updatedImage,
    });

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
    const room = await roomService.findRoomById(roomId);
    if (!room) {
      throw ApiError(404, "Rooms not found");
    }
    const result = await roomService.deleteRoom(roomId);
    return res
      .status(200)
      .json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    logger.error(`Delete room error: ${error.message}`);
    next(error);
  }
};
