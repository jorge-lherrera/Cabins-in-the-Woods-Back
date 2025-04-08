const yup = require("yup");

const loginSchema = yup
  .object()
  .shape({
    email: yup.string().email().required("O email e obrigatorio"),
    password: yup.string().required("A senha é obrigatoria"),
  })
  .noUnknown(
    true,
    `Os campos adicionais não são permitidos. Campos obrigatorios: email, password`
  );

module.exports = {
  loginSchema,
};
