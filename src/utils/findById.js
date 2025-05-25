async function findById(Model, id) {
  if (isNaN(id)) return null;
  const instance = await Model.findByPk(id);
  return instance;
}
module.exports = findById;
