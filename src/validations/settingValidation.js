const Yup = require("yup");
const {
  positiveNumber,
  positiveInteger,
  applyNoUnknown,
} = require("./validationUtils");

const settingValidation = applyNoUnknown(
  Yup.object().shape({
    minBookingLength: positiveInteger("duração mínima"),
    maxBookingLength: positiveInteger("duração máxima"),
    breakfastPrice: positiveNumber("preço do café da manhã").required(
      "O preço do café da manhã é obrigatório."
    ),
  }),
  "Os campos adicionais não são permitidos. Por favor, verifique os campos."
);

module.exports = settingValidation;
