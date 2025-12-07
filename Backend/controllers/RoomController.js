import * as roomService from "../services/roomService.js";
import * as hotelService from "../services/hotelService.js";
import { uploadImageToCloudinary } from "../config/cloudinary.js";
import logger from "../utils/logger.js";

export const createRoom = async (req, res, next) => {

  try {
    const { hotelId } = req.params;
    if (!hotelId) {
      return res.status(400).json({ message: "Hotel ID is required." });
    }

    const hotel = await hotelService.findHotelById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found." });
    }

    // Handle image upload if file exists
    let imageData = null;

    // Check if image is provided via file upload
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
      return res.status(400).json({
        message:
          "Image is required. Please upload an image or provide an image URL.",
      });
    }

    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + 5);

    const roomData = {
      hotelId,
      image: imageData, // Store the image object with url and public_id
      type: req.body.type,
      desc: req.body.desc,
      price: req.body.price,
      maxPeople: req.body.maxPeople,
      availabilityDates: req.body.availabilityDates || [],
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

export const checkRoomAvailability = async (req, res, next) => {
  try {
    const { hotelId, startDate, endDate } = req.body;
    const isAvailable = await roomService.checkRoomAvailability(
      hotelId,
      startDate,
      endDate
    );

    if (isAvailable) {
      return res.status(201).json({
        success: true,
        message: "Room is available for booking.",
      });
    }
  } catch (error) {
    logger.error(`Check room availablity error: ${error.message}`);
    next(error);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedRoom = await roomService.updateRoom(id, updateData);

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
