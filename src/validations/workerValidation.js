const Yup = require("yup");
const { validateStringLength, applyNoUnknown } = require("./validationUtils");

const workerValidation = applyNoUnknown(
  Yup.object().shape({
    name: validateStringLength("nome", 3, 100),
    email: Yup.string()
      .email("O e-mail fornecido não é válido.")
      .required("O e-mail é obrigatório."),
    avatar: Yup.string().url("A URL do avatar não é válida.").nullable(),
    password: validateStringLength("senha", 8, 100),
  }),
  "Os campos adicionais não são permitidos. Por favor, verifique os campos."
);

module.exports = workerValidation;
