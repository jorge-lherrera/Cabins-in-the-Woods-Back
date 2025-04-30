const { ValidationError } = require("yup");
const {
  ValidationError: SequelizeValidationError,
  DatabaseError,
} = require("sequelize");

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      message: "Erro de validação",
      detalhes: err.errors,
    });
  }

  if (err instanceof SequelizeValidationError) {
    return res.status(400).json({
      message: "Erro de validação do banco de dados",
      detalhes: err.errors.map((e) => e.message),
    });
  }

  if (err instanceof DatabaseError) {
    return res.status(500).json({
      message: "Erro no banco de dados",
      detalhes: err.message,
    });
  }

  return res.status(500).json({
    message: "Erro interno no servidor",
    detalhes: err.message || "Algo inesperado aconteceu.",
  });
}

module.exports = errorHandler;
