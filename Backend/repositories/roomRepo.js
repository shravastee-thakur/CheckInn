import Room from "../models/RoomModel.js";

export const createRoomsForHotel = async (roomData) => {
  console.log("repo", roomData);

  return await Room.create(roomData);
};

export const findRoom = async () => {
  return await Room.find();
};

export const findRoomById = async (id) => {
  return await Room.findById(id);
};

// export const findRoomsWithConflict = async (hotelId, startDate, endDate) => {
//   return await Room.find({
//     hotelId,
//     availabilityDates: {
//       $elemMatch: {
//         $or: [
//           { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
//           { startDate: { $gte: startDate }, endDate: { $lte: endDate } },
//         ],
//       },
//     },
//   });
// };

export const updateRoom = async (id, updatedData) => {
  return await Room.findByIdAndUpdate(id, updatedData, { new: true });
};

export const deleteRoom = async (id) => {
  return await Room.findByIdAndDelete(id);
};
