// import { ApiError } from "../utils/ApiError.js";

// export const validate = (schema) => (req, res, next) => {
//   const { error } = schema.validate(req.body);

//   if (error) {
//     return next(ApiError(400, error.details[0].message));
//   }

//   next();
// };

// Middleware to handle validation with Joi
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    next();
  };
};
