const { ValidationError } = require("yup");
const {
  ValidationError: SequelizeValidationError,
  DatabaseError,
} = require("sequelize");

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      source: "validation - controllers",
      message: "Erro de validação",
      detalhes: err.errors,
    });
  }

  if (err instanceof SequelizeValidationError) {
    return res.status(400).json({
      source: "validation - models",
      message: "Erro de validação do banco de dados",
      detalhes: err.errors.map((e) => e.message),
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      source: "validation - models",
      message: "Erro de unicidade",
      detalhes: err.errors.map((e) => e.message),
    });
  }

  if (err instanceof DatabaseError) {
    return res.status(500).json({
      source: "database - migrations",
      message: "Erro no banco de dados",
      detalhes: err.message,
    });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      source: "auth - session",
      message: "Sessão inválida ou expirada",
      detalhes: err.message,
      loggedIn: false,
    });
  }

  return res.status(500).json({
    source: "server - unknown",
    message: "Erro interno no servidor",
    detalhes: err.message || "Algo inesperado aconteceu.",
  });
}

module.exports = errorHandler;
