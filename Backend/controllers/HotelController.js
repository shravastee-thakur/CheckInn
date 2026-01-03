import * as hotelService from "../services/hotelService.js";
import logger from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";

export const createHotel = async (req, res, next) => {
  console.log(req.body);

  try {
    const hotelData = req.body;
    const fileBuffer = req.file ? req.file.buffer : null;

    const hotel = await hotelService.createHotel(hotelData, fileBuffer);
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

export const getAllHotels = async (req, res, next) => {
  try {
    const hotels = await hotelService.findAllHotels();
    return res.status(200).json({ success: true, hotels });
  } catch (error) {
    logger.error(`Get all Hotels error: ${error.message}`);
    next(error);
  }
};

export const getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hotel = await hotelService.findHotelById(id);
    return res.status(200).json({ success: true, hotel });
  } catch (error) {
    logger.error(`Get Hotel by id error: ${error.message}`);
    next(error);
  }
};

export const updateHotel = async (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body;
  const fileBuffer = req.file ? req.file.buffer : null;
  try {
    const updateHotel = await hotelService.updatedHotel(
      id,
      updatedData,
      fileBuffer
    );

    return res.status(200).json({
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
    await hotelService.deleteHotel(id);
    return res.json({ success: true, message: "Hotel deleted successfully" });
  } catch (error) {
    logger.error(`Delete Hotel error: ${error.message}`);
    next(error);
  }
};
