function validate(schema) {
  return async (req, res, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false, strict: true });
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Erros de validação nos dados fornecidos.",
        detalhes: error.errors,
      });
    }
  };
}
module.exports = validate;
