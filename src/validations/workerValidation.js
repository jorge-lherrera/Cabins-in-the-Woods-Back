const Yup = require("yup");

const workerValidation = Yup.object().shape({
  name: Yup.string()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(100, "El nombre no puede tener más de 100 caracteres.")
    .required("El nombre es obligatorio."),
  email: Yup.string()
    .email("El correo electrónico no es válido.")
    .required("El correo electrónico es obligatorio."),
  avatar: Yup.string()
    .url("La URL del avatar no es válida.")
    .nullable(),
  password: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .required("La contraseña es obligatoria."),
});

module.exports = workerValidation;