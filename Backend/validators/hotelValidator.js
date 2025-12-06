import Joi from "joi";

// Hotel creation validation
export const hotelCreateSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Hotel name is required",
  }),
  type: Joi.string().required().messages({
    "string.empty": "Hotel type is required",
  }),
  city: Joi.string().required().messages({
    "string.empty": "City is required",
  }),
  address: Joi.string().required().messages({
    "string.empty": "Address is required",
  }),
  distance: Joi.string().required().messages({
    "string.empty": "Distance is required",
  }),
  photos: Joi.array().items(Joi.string().uri()).optional().messages({
    "array.base": "Photos should be an array of image URLs",
  }),
  desc: Joi.string().required().messages({
    "string.empty": "Description is required",
  }),
  rating: Joi.number().min(0).max(5).optional(),
  cheapestPrice: Joi.number().required().messages({
    "number.base": "Cheapest Price is required",
  }),
  featured: Joi.boolean().optional(),
});

export const hotelUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  type: Joi.string().optional(),
  city: Joi.string().optional(),
  address: Joi.string().optional(),
  distance: Joi.string().optional(),
  photos: Joi.array().items(Joi.string().uri()).optional(),
  desc: Joi.string().optional(),
  rating: Joi.number().min(0).max(5).optional(),
  cheapestPrice: Joi.number().optional(),
  featured: Joi.boolean().optional(),
});
