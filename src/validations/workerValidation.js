const Yup = require("yup");
const { validateStringLength, applyNoUnknown } = require("./validationUtils");

const workerValidation = applyNoUnknown(
  Yup.object().shape({
    name: validateStringLength("nome", 3, 100),
    email: Yup.string()
      .typeError("O campo e-mail deve ser uma string.")
      .email("O e-mail fornecido não é válido.")
      .required("O e-mail é obrigatório."),
    avatar: Yup.string().url("A URL do avatar não é válida.").nullable(),
    password: validateStringLength("senha", 8, 100),
    currentPassword: Yup.string()
      .typeError("O campo senha atual deve ser uma string.")
      .min(8, "A senha atual deve ter pelo menos 8 caracteres.")
      .max(100, "A senha atual não pode ter mais de 100 caracteres."),
  }),
  "Os campos adicionais não são permitidos. Por favor, verifique os campos."
);

module.exports = workerValidation;
