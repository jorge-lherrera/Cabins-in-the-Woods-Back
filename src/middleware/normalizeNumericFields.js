/**
 * Convierte los campos especificados en req.body a tipo Number si existen y son string.
 * @param {string[]} fields - Lista de nombres de campos a convertir.
 */
function normalizeNumericFields(fields) {
  return function (req, res, next) {
    try {
      fields.forEach((field) => {
        if (
          req.body[field] !== undefined &&
          req.body[field] !== null &&
          req.body[field] !== "" &&
          typeof req.body[field] === "string" &&
          !isNaN(req.body[field])
        ) {
          req.body[field] = Number(req.body[field]);
        }
      });
      next();
    } catch (error) {
      return res.status(400).json({
        error: "Erro ao processar campos numéricos",
        details: [error.message],
      });
    }
  };
}

module.exports = normalizeNumericFields;
