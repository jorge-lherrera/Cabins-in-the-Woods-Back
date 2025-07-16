const { ValidationError } = require("yup");
const {
  ValidationError: SequelizeValidationError,
  DatabaseError,
} = require("sequelize");
const MESSAGES = require("../utils/messages");

function errorHandler(err, req, res, next) {
  function sendError({ status, errorCode, message, source, detalhes }) {
    return res.status(status).json({
      status,
      errorCode,
      message,
      source,
      detalhes,
    });
  }

  if (err instanceof ValidationError) {
    return sendError({
      status: 400,
      errorCode: "VALIDATION_ERROR",
      message: MESSAGES.GENERAL.VALIDATION_ERROR,
      source: "validation - controllers",
      detalhes: err.errors,
    });
  }

  if (err instanceof SequelizeValidationError) {
    return sendError({
      status: 400,
      errorCode: "VALIDATION_ERROR",
      message: MESSAGES.GENERAL.VALIDATION_ERROR,
      source: "validation - models",
      detalhes: err.errors.map((e) => e.message),
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return sendError({
      status: 400,
      errorCode: "UNIQUE_CONSTRAINT_ERROR",
      message: MESSAGES.GENERAL.UNIQUE_CONSTRAINT_ERROR,
      source: "validation - models",
      detalhes: err.errors.map((e) => e.message),
    });
  }

  if (err instanceof DatabaseError) {
    return sendError({
      status: 500,
      errorCode: "DATABASE_ERROR",
      message: MESSAGES.GENERAL.DATABASE_ERROR,
      source: "database - migrations",
      detalhes: err.message,
    });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return sendError({
      status: 401,
      errorCode: "SESSION_ERROR",
      message: MESSAGES.GENERAL.SESSION_ERROR,
      source: "auth - session",
      detalhes: err.message,
    });
  }

  // Manejo de errores con formato anidado en err.error
  if (
    err.error &&
    err.error.errorCode &&
    err.error.status &&
    err.error.message
  ) {
    return sendError({
      status: err.error.status,
      errorCode: err.error.errorCode,
      message: err.error.message,
      source: err.error.source || "server - custom",
      detalhes: err.error.detalhes || null,
    });
  }

  // Manejo de errores con formato plano
  if (err.errorCode && err.status && err.message) {
    return sendError({
      status: err.status,
      errorCode: err.errorCode,
      message: err.message,
      source: err.source || "server - custom",
      detalhes: err.detalhes || null,
    });
  }

  if (err.status === 404) {
    return sendError({
      status: 404,
      errorCode: "NOT_FOUND",
      message: err.message || "Recurso não encontrado.",
      source: err.source || "server - not found",
      detalhes: err.detalhes || null,
    });
  }

  return sendError({
    status: 500,
    errorCode: "SERVER_ERROR",
    message: MESSAGES.GENERAL.SERVER_ERROR,
    source: "server - unknown",
    detalhes: err.message || "Algo inesperado aconteceu.",
  });
}

module.exports = errorHandler;
