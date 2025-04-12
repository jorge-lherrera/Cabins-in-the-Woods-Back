const Yup = require("yup");
const { validateStringLength } = require("./validationUtils");

const workerValidation = Yup.object().shape({
  name: validateStringLength("nome", 3, 100),
  email: Yup.string()
    .email("O e-mail fornecido não é válido.")
    .required("O e-mail é obrigatório."),
  avatar: Yup.string().url("A URL do avatar não é válida.").nullable(),
  password: validateStringLength("senha", 8, 100),
});

module.exports = workerValidation;
