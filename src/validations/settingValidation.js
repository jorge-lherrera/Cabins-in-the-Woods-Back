const Yup = require("yup");

const settingValidation = Yup.object().shape({
  minBookingLength: Yup.number()
    .integer("La duración mínima debe ser un número entero.")
    .min(1, "La duración mínima debe ser al menos 1.")
    .required("La duración mínima es obligatoria."),
  maxBookingLength: Yup.number()
    .integer("La duración máxima debe ser un número entero.")
    .min(1, "La duración máxima debe ser al menos 1.")
    .required("La duración máxima es obligatoria."),
  breakfastPrice: Yup.number()
    .typeError("El precio del desayuno debe ser un número.")
    .min(0, "El precio del desayuno no puede ser negativo.")
    .required("El precio del desayuno es obligatorio."),
});

module.exports = settingValidation;
