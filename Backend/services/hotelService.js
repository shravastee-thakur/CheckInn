import * as hotelRepo from "../repositories/hotelRepo.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadImageToCloudinary } from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import logger from "../utils/logger.js";

export const createHotel = async (hotelData, fileBuffer) => {
  if (
    !hotelData.name ||
    !hotelData.city ||
    !hotelData.address ||
    !hotelData.distance ||
    !hotelData.description
  ) {
    throw ApiError(400, "All fields are required.");
  }

  if (fileBuffer) {
    const uploadImage = await uploadImageToCloudinary(fileBuffer);
    hotelData.image = {
      url: uploadImage.secure_url,
      public_id: uploadImage.public_id,
    };
  }

  const hotel = await hotelRepo.createHotel(hotelData);
  return hotel;
};

export const findAllHotels = async () => {
  const hotels = await hotelRepo.findAllHotels();
  if (!hotels) throw ApiError(404, "Hotels not found");
  return hotels;
};

export const findHotelById = async (id) => {
  const hotel = await hotelRepo.findHotelById(id);
  if (!hotel) {
    throw ApiError(404, "Hotel not found");
  }
  return hotel;
};

export const findHotelRelatedRooms = async (id) => {
  const hotels = await hotelRepo.findHotelById(id);
  if (!hotels) {
    throw ApiError(404, "Hotels not found");
  }

  const rooms = await hotelRepo.findHotelRooms(id);
  return rooms;
};

export const updatedHotel = async (id, updatedData, fileBuffer) => {
  const hotel = await hotelRepo.findHotelById(id);
  if (!hotel) {
    throw ApiError(404, "Hotel not found");
  }

  let image = hotel.image;

  if (fileBuffer) {
    if (hotel.image?.public_id) {
      await cloudinary.uploader.destroy(hotel.image.public_id);
    }

    // Upload new image
    const uploadedImg = await uploadImageToCloudinary(fileBuffer);
    image = {
      url: uploadedImg.secure_url,
      public_id: uploadedImg.public_id,
    };
  }

  const finalData = {
    ...updatedData,
    image,
  };

  const updatedHotel = await hotelRepo.updateHotel(id, finalData);

  return updatedHotel;
};

export const deleteHotel = async (id) => {
  const hotel = await hotelRepo.findHotelById(id);
  if (!hotel) {
    throw ApiError(404, "Hotel not found");
  }

  if (hotel.image?.public_id) {
    try {
      await cloudinary.uploader.destroy(hotel.image.public_id);
    } catch (cloudinaryError) {
      logger.error(
        `Error deleting image from Cloudinary: ${cloudinaryError.message}`
      );
    }
  }

  const hotelRooms = await hotelRepo.findHotelRooms(id);
  for (const room of hotelRooms) {
    if (room.image?.public_id) {
      try {
        await cloudinary.uploader.destroy(room.image.public_id);
      } catch (roomImageError) {
        logger.error(
          `Error deleting room image from Cloudinary for room ${room._id}: ${roomImageError.message}`
        );
      }
    }
  }

  await hotelRepo.deleteManyRooms(id);
  return await hotelRepo.deleteHotel(id);
};
