async function findById(Model, id, res, resourceName, messages) {
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ sucesso: false, mensagem: messages.GENERAL.INVALID_ID });
  }
  const instance = await Model.findByPk(id);
  if (!instance) {
    return res
      .status(404)
      .json({
        sucesso: false,
        mensagem: messages.GENERAL.NOT_FOUND(resourceName),
      });
  }
  return instance;
}
module.exports = findById;
