import * as hotelService from "../services/hotelService.js";
import { uploadImageToCloudinary } from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import logger from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";

export const createHotel = async (req, res, next) => {
  console.log(req.body);

  try {
    const hotelData = req.body;

    if (req.file) {
      const uploadImage = await uploadImageToCloudinary(req.file.buffer);
      hotelData.photos = [
        {
          url: uploadImage.secure_url,
          public_id: uploadImage.public_id,
        },
      ];
    }

    const hotel = await hotelService.createHotel(hotelData);
    return res.status(201).json({
      success: true,
      hotel,
      message: "Hotel created successfully",
    });
  } catch (error) {
    logger.error(`Create Hotel error: ${error.message}`);
    next(error);
  }
};

export const getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hotel = await hotelService.findHotelById(id);
    return res.json({ success: true, hotel });
  } catch (error) {
    logger.error(`Get Hotel by id error: ${error.message}`);
    next(error);
  }
};

export const getAllHotels = async (req, res, next) => {
  try {
    const { city, type, maxPrice } = req.query;
    const hotels = await hotelService.findAllHotels({ city, type, maxPrice });
    return res.json({ success: true, hotels });
  } catch (error) {
    logger.error(`Get all Hotels error: ${error.message}`);
    next(error);
  }
};

export const updateHotel = async (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const hotel = await hotelService.findHotelById(id);
    if (!hotel) {
      throw new ApiError(404, "Hotel not found");
    }

    let updatedImage = hotel.photos;

    if (req.file) {
      if (hotel.photos && hotel.photos[0]?.public_id) {
        await cloudinary.uploader.destroy(hotel.photos[0].public_id);
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

    const updateHotel = await hotelService.updateHotel(id, {
      ...updatedData,
      photos: updatedImage,
    });

    return res.json({
      success: true,
      message: "Hotel updated successfully",
      updateHotel,
    });
  } catch (error) {
    logger.error(`Update Hotel error: ${error.message}`);
    next(error);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await hotelService.deleteHotel(id);
    return res.json({ success: true, message: "Hotel deleted successfully" });
  } catch (error) {
    logger.error(`Delete Hotel error: ${error.message}`);
    next(error);
  }
};
