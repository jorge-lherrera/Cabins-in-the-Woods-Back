const Yup = require("yup");
const { validateStringLength } = require("./validationUtils");

const guestValidation = Yup.object().shape({
  fullName: validateStringLength("nome completo", 3, 100),
  email: Yup.string()
    .email("O e-mail fornecido não é válido.")
    .required("O e-mail é obrigatório."),
  nationality: validateStringLength("nacionalidade", 2, 50),
  countryFlag: Yup.string()
    .url("A URL da bandeira do país não é válida.")
    .nullable(),
  nationalIdNumber: validateStringLength("número de identificação", 5, 20),
});

module.exports = guestValidation;
