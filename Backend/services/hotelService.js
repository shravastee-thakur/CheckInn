import * as hotelRepo from "../repositories/hotelRepo.js";
import { ApiError } from "../utils/ApiError.js";

export const createHotel = async (hotelData) => {
  if (
    !hotelData.name ||
    !hotelData.city ||
    !hotelData.type ||
    !hotelData.address ||
    !hotelData.distance ||
    !hotelData.desc ||
    !hotelData.cheapestPrice
  ) {
    throw ApiError(400, "All fields are required.");
  }

  const hotel = await hotelRepo.createHotel(hotelData);
  return hotel;
};

export const findAllHotels = async (filters) => {
  const hotels = await hotelRepo.findAllHotels(filters);
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

export const updateHotel = async (id, updatedData) => {
  const hotel = await hotelRepo.findHotelById(id);

  if (!hotel) {
    throw ApiError(404, "Hotel not found");
  }

  const finalData = {
    name: updatedData.name || hotel.name,
    type: updatedData.type || hotel.type,
    city: updatedData.city || hotel.city,
    address: updatedData.address || hotel.address,
    distance: updatedData.distance || hotel.distance,
    photos: updatedData.photos || hotel.photos,
    desc: updatedData.desc || hotel.desc,
    rating: updatedData.rating || hotel.rating,
    cheapestPrice: updatedData.cheapestPrice || hotel.cheapestPrice,
    featured:
      updatedData.featured !== undefined
        ? updatedData.featured
        : hotel.featured,
  };

  const updatedHotel = await hotelRepo.updateHotel(id, finalData);

  return updatedHotel;
};

export const deleteHotel = async (id) => {
  const result = await hotelRepo.deleteHotel(id);
  if (!result) {
    throw ApiError(404, "Hotel not found");
  }
  return result;
};
