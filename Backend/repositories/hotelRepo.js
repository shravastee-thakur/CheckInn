import Hotel from "../models/HotelModel.js";

export const createHotel = async (data) => await Hotel.create(data);

export const findHotelById = async (id) => await Hotel.findById(id);

export const findAllHotels = async (filters) => {
  const { city, type, maxPrice } = filters;
  let query = {};

  if (city) query.city = city;
  if (type) query.type = type;
  if (maxPrice) query.cheapestPrice = { $lte: maxPrice };

  return await Hotel.find(query);
};

export const updateHotel = async (id, updatedData) => {
  const updatedHotel = await Hotel.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!updatedHotel) {
    throw ApiError(404, "Hotel not found");
  }

  return updatedHotel;
};

export const deleteHotel = async (id) => await Hotel.findByIdAndDelete(id);
