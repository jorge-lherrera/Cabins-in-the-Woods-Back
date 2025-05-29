const Yup = require("yup");
const emojiRegex = require("emoji-regex");

const positiveNumber = (fieldName) =>
  Yup.number()
    .typeError(`O campo ${fieldName} deve ser um número`)
    .min(0, `O campo ${fieldName} não pode ser negativo`);

const positiveInteger = (fieldName) =>
  Yup.number()
    .typeError(`O campo ${fieldName} deve ser um número inteiro`)
    .integer(`O campo ${fieldName} deve ser um número inteiro`)
    .min(1, `O campo ${fieldName} deve ser pelo menos 1`)
    .required(`O campo ${fieldName} é obrigatório`);

const validateStringLength = (fieldName, min, max) =>
  Yup.string()
    .typeError(`O campo ${fieldName} deve ser uma string`)
    .min(min, `O campo ${fieldName} deve ter pelo menos ${min} caracteres`)
    .max(max, `O campo ${fieldName} não pode ter mais de ${max} caracteres`)
    .required(`O campo ${fieldName} é obrigatório`);

const noEmojis = (fieldName) =>
  Yup.string().test(
    "no-emojis",
    `O campo ${fieldName} não pode conter emoticonos.`,
    (value) => !value || !emojiRegex().test(value)
  );

const applyNoUnknown = (schema, message) =>
  schema.noUnknown(true, message || "Campos adicionais não são permitidos.");

module.exports = {
  positiveNumber,
  positiveInteger,
  validateStringLength,
  noEmojis,
  applyNoUnknown,
};
