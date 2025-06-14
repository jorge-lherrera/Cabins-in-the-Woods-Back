function validate(schema) {
  return async (req, res, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false, strict: true });
      next();
    } catch (error) {
      next(error);
    }
  };
}
module.exports = validate;
