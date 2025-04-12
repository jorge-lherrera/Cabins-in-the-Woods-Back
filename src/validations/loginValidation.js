const yup = require("yup");
const { validateStringLength } = require("./validationUtils");

const loginSchema = yup
  .object()
  .shape({
    email: yup
      .string()
      .email("O email fornecido não é válido.")
      .required("O email é obrigatório."),
    password: validateStringLength("senha", 8, 100),
  })
  .noUnknown(
    true,
    `Os campos adicionais não são permitidos. Campos obrigatórios: email, password`
  );

module.exports = {
  loginSchema,
};
