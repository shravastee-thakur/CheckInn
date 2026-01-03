import * as roomRepo from "../repositories/roomRepo.js";
import { ApiError } from "../utils/ApiError.js";

export const createRoom = async (roomData) => {
  return await roomRepo.createRoomsForHotel(roomData);
};

// export const checkRoomAvailability = async (hotelId, startDate, endDate) => {
//   const conflictingRooms = await roomRepo.findRoomsWithConflict(
//     hotelId,
//     startDate,
//     endDate
//   );
//   if (conflictingRooms.length > 0) {
//     throw ApiError(400, "Room is already booked for the selected dates.");
//   }
//   return true;
// };

export const updateRoom = async (id, updatedData) => {
  const room = await roomRepo.findRoomById(id);
  if (!room) {
    throw ApiError(404, "Room not found");
  }

  const finalUpdate = {
    image: updatedData.image || room.image,
    type: updatedData.type || room.type,
    desc: updatedData.desc || room.desc,
    price: updatedData.price || room.price,
    maxPeople: updatedData.maxPeople || room.maxPeople,
  };
  const updatedRoom = await roomRepo.updateRoom(id, finalUpdate);
  return updatedRoom;
};

export const getRooms = async () => {
  return await roomRepo.findRoom();
};

export const findRoomById = async (id) => {
  const room = await roomRepo.findRoomById(id);
  if (!room) {
    throw ApiError(404, "Rooms not found");
  }

  return room;
};

export const deleteRoom = async (id) => {
  const result = await roomRepo.deleteRoom(id);
  return result;
};
