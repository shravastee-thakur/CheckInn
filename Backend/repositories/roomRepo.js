import Room from "../models/RoomModel.js";

export const createRoom = (roomData) => Room.create(roomData);

export const findRoomById = (id) => Room.findById(id);



export const updateRoom = (id, updatedData) =>
  Room.findByIdAndUpdate(id, updatedData, { new: true });

export const deleteRoom = (id) => Room.findByIdAndDelete(id);
