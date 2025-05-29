const Yup = require("yup");
const {
  validateStringLength,
  noEmojis,
  applyNoUnknown,
} = require("./validationUtils");

const workerValidation = applyNoUnknown(
  Yup.object().shape({
    name: validateStringLength("nome", 3, 100).concat(noEmojis("nome")),
    email: Yup.string()
      .typeError("O campo e-mail deve ser uma string.")
      .email("O e-mail fornecido não é válido.")
      .max(150, "O e-mail não pode ter mais de 150 caracteres.")
      .required("O e-mail é obrigatório.")
      .concat(noEmojis("e-mail")),
    avatar: Yup.string()
      .url("A URL do avatar não é válida.")
      .nullable()
      .concat(noEmojis("avatar")),
    password: validateStringLength("senha", 8, 100).concat(noEmojis("senha")),
    currentPassword: Yup.string()
      .typeError("O campo senha atual deve ser uma string.")
      .min(8, "A senha atual deve ter pelo menos 8 caracteres.")
      .max(100, "A senha atual não pode ter mais de 100 caracteres.")
      .concat(noEmojis("senha atual")),
  }),
  "Os campos adicionais não são permitidos. Por favor, verifique os campos."
);

module.exports = workerValidation;
