const Yup = require("yup");
const { positiveNumber, positiveInteger } = require("./validationUtils");

const settingValidation = Yup.object().shape({
  minBookingLength: positiveInteger("duração mínima"),
  maxBookingLength: positiveInteger("duração máxima"),
  breakfastPrice: positiveNumber("preço do café da manhã").required(
    "O preço do café da manhã é obrigatório."
  ),
});

module.exports = settingValidation;
