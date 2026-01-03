import Hotel from "../models/HotelModel.js";
import Room from "../models/RoomModel.js";

export const createHotel = async (data) => await Hotel.create(data);

export const findAllHotels = async () => await Hotel.find();
export const findHotelRooms = (hotelId) => Room.find({ hotelId: hotelId });

export const findHotelById = async (id) => await Hotel.findById(id);

export const updateHotel = (id, updatedData) =>
  Hotel.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

export const deleteHotel = async (id) => await Hotel.findByIdAndDelete(id);
export const deleteManyRooms = (hotelId) =>
  Room.deleteMany({ hotelId: hotelId });
