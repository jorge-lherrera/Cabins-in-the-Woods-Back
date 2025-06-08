const { ValidationError } = require("yup");
const {
  ValidationError: SequelizeValidationError,
  DatabaseError,
} = require("sequelize");
const MESSAGES = require("../utils/messages");

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      source: "validation - controllers",
      message: MESSAGES.GENERAL.VALIDATION_ERROR,
      detalhes: err.errors,
    });
  }

  if (err instanceof SequelizeValidationError) {
    return res.status(400).json({
      source: "validation - models",
      message: MESSAGES.GENERAL.VALIDATION_ERROR,
      detalhes: err.errors.map((e) => e.message),
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      source: "validation - models",
      message: MESSAGES.GENERAL.UNIQUE_CONSTRAINT_ERROR,
      detalhes: err.errors.map((e) => e.message),
    });
  }

  if (err instanceof DatabaseError) {
    return res.status(500).json({
      source: "database - migrations",
      message: MESSAGES.GENERAL.DATABASE_ERROR,
      detalhes: err.message,
    });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      source: "auth - session",
      message: MESSAGES.GENERAL.SESSION_ERROR,
      detalhes: err.message,
      loggedIn: false,
    });
  }

  return res.status(500).json({
    source: "server - unknown",
    message: MESSAGES.GENERAL.SERVER_ERROR,
    detalhes: err.message || "Algo inesperado aconteceu.",
  });
}

module.exports = errorHandler;
