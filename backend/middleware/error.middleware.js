const errorMiddleware = (err, req, res, next) => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  // Handle MongoDB duplicate key error (e.g., unique constraint)
  if (err.code === 11000) {
    const error = Object.keys(err.keyPattern).join(",");
    err.message = `Duplicate field - ${error}`;
    err.statusCode = 400;
  }

  // Handle Mongoose CastError (e.g., invalid ObjectId)
  if (err.name === "CastError") {
    const errorPath = err.path;
    err.message = `Invalid Format of ${errorPath}`;
    err.statusCode = 400;
  }

  // Handle Mongoose ValidationError (e.g., enum validation)
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => error.message);
    err.message = errors.join(", ");
    err.statusCode = 400;
  }
  const response = {
    statusCode: err.statusCode,
    success: false,
    message: err.message,
    data: err.data,
  };

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    response.error = err;
  }

  return res.status(err.statusCode).json(response);
};

export { errorMiddleware };
