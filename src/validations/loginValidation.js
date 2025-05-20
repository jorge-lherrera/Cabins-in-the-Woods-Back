const yup = require("yup");
const { validateStringLength, applyNoUnknown } = require("./validationUtils");

const loginValidation = applyNoUnknown(
  yup.object().shape({
    email: yup
      .string()
      .email("O email fornecido não é válido.")
      .required("O email é obrigatório."),
    password: validateStringLength("senha", 8, 100),
  }),
  "Os campos adicionais não são permitidos. Campos obrigatórios: email, password."
);

module.exports = {
  loginValidation,
};
