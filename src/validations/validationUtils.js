const Yup = require("yup");

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
    .min(min, `O campo ${fieldName} deve ter pelo menos ${min} caracteres`)
    .max(max, `O campo ${fieldName} não pode ter mais de ${max} caracteres`)
    .required(`O campo ${fieldName} é obrigatório`);

module.exports = { positiveNumber, positiveInteger, validateStringLength };
