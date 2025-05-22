const Yup = require("yup");
const {
  positiveNumber,
  positiveInteger,
  applyNoUnknown,
} = require("./validationUtils");

const settingValidation = applyNoUnknown(
  Yup.object().shape({
    minBookingLength: positiveInteger("duração mínima"),
    maxBookingLength: positiveInteger("duração máxima").test(
      "is-greater-than-min",
      "A duração máxima deve ser maior que a duração mínima.",
      function (value) {
        return value > this.parent.minBookingLength;
      }
    ),
    maxGuestsPerBooking: positiveInteger("máximo de hóspedes por reserva")
      .required("O campo máximo de hóspedes por reserva é obrigatório.")
      .min(1, "O número mínimo de hóspedes por reserva deve ser pelo menos 1."),
    breakfastPrice: positiveNumber("preço do café da manhã").required(
      "O preço do café da manhã é obrigatório."
    ),
  }),
  "Os campos adicionais não são permitidos. Por favor, verifique os campos."
);

module.exports = settingValidation;
