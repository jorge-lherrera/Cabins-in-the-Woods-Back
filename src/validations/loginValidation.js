const yup = require("yup");

const loginSchema = yup
  .object()
  .shape({
    email: yup
      .string()
      .email("O email fornecido não é válido.")
      .required("O email é obrigatório."),
    password: yup
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres.")
      .required("A senha é obrigatória."),
  })
  .noUnknown(
    true,
    `Os campos adicionais não são permitidos. Campos obrigatórios: email, password`
  );

module.exports = {
  loginSchema,
};
