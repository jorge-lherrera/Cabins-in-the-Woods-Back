const Yup = require("yup");

function makeAllFieldsOptional(schema) {
  const fields = schema.fields;
  const shape = {};
  for (const key in fields) {
    shape[key] = fields[key].clone().notRequired();
  }
  return Yup.object().shape(shape);
}

module.exports = makeAllFieldsOptional;
