const AppError = require("../class/errorClass");

const handleValidate = (err) => {
  const messages = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${messages.join(". ")}`;
  return new AppError(message, 400);
};

const handleCasteError = (err) => {
  const message = `invalid ${err.value} in path ${err.path}`;
  return new AppError(message, 400);
};

const handleDuplicateError = (err) => {
  const value = Object.values(err.keyValue)[0];
  const message = `duplicate field ${value}`;
  return new AppError(message, 409);
};

const handleInvalidToken = (err) => {
  const message = `Token invalid ${err.message}`;
  return new AppError(message, 401);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      err,
    });
  }

  if (process.env.NODE_ENV === "production") {
    let error = err;

    if (error.name === "ValidationError") {
      error = handleValidate(error);
    }

    if (error.name === "CastError") {
      error = handleCasteError(error);
    }

    if (error.code === 11000) {
      error = handleDuplicateError(error);
    }

    if (error.name === "JsonWebTokenError") {
      error = handleInvalidToken(error);
    }

    if (error.isOperational) {
      return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }

  res.status(500).json({
    status: "fail",
    message: "something went wrong",
  });
};
