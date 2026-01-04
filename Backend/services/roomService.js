import * as roomRepo from "../repositories/roomRepo.js";
import * as hotelRepo from "../repositories/hotelRepo.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadImageToCloudinary } from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

export const createRoom = async (roomData, fileBuffer) => {


  if (
    !roomData.hotelId ||
    !roomData.type ||
    !roomData.description ||
    !roomData.price ||
    !roomData.maxPeople
  ) {
    throw ApiError(400, "Required fields are missing");
  }

  const hotel = await hotelRepo.findHotelById(roomData.hotelId);
  if (!hotel) {
    throw ApiError(404, "Hotel not found");
  }

  if (fileBuffer) {
    const uploadImg = await uploadImageToCloudinary(fileBuffer);
    roomData.image = {
      url: uploadImg.secure_url,
      public_id: uploadImg.public_id,
    };
  }

  return await roomRepo.createRoom(roomData);
};

export const getRoomById = async (id) => {
  const room = await roomRepo.findRoomById(id);
  if (!room) {
    throw ApiError(404, "Rooms not found");
  }

  return room;
};

export const updateRoom = async (id, updatedData, fileBuffer) => {
  const room = await roomRepo.findRoomById(id);
  if (!room) {
    throw ApiError(404, "Room not found");
  }

  let image = room.image;

  if (fileBuffer) {
    if (room.image?.public_id) {
      await cloudinary.uploader.destroy(room.image.public_id);
    }

    const uploadedImg = await uploadImageToCloudinary(fileBuffer);
    image = {
      url: uploadedImg.secure_url,
      public_id: uploadedImg.public_id,
    };
  }

  const updatedRoom = await roomRepo.updateRoom(id, {
    ...updatedData,
    image,
  });
  return updatedRoom;
};

export const deleteRoom = async (id) => {
  const room = await roomRepo.findRoomById(id);
  if (!room) throw ApiError(404, "Room not found");

  if (room.image?.public_id) {
    await cloudinary.uploader.destroy(room.image.public_id);
  }

  const result = await roomRepo.deleteRoom(id);
  return result;
};
