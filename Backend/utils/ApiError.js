export const ApiError = (
  statusCode = 500,
  message = "Server Error",
  meta = null
) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.meta = meta;
  return err;
};
