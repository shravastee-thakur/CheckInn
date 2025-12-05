import sanitize from "mongo-sanitize";

export const sanitizeMiddleware = (req, res, next) => {
  try {
    // Sanitize req.body (overwrite allowed)
    if (req.body) req.body = sanitize(req.body);

    // Sanitize req.query (must mutate, NOT reassign)
    if (req.query) {
      Object.keys(req.query).forEach((key) => {
        req.query[key] = sanitize(req.query[key]);
      });
    }

    // Sanitize req.params (must mutate)
    if (req.params) {
      Object.keys(req.params).forEach((key) => {
        req.params[key] = sanitize(req.params[key]);
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
