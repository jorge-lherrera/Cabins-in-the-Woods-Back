const Yup = require("yup");
const { validateStringLength, applyNoUnknown, noEmojis } = require("./validationUtils");

const guestValidation = applyNoUnknown(
  Yup.object().shape({
    fullName: validateStringLength("nome completo", 3, 100).concat(noEmojis("nome completo")),
    email: Yup.string()
      .email("O e-mail fornecido não é válido.")
      .required("O e-mail é obrigatório."),
    nationality: validateStringLength("nacionalidade", 2, 50).concat(noEmojis("nacionalidade")),
    countryFlag: Yup.string()
      .url("A URL da bandeira do país não é válida.")
      .nullable(),
    nationalIdNumber: validateStringLength("número de identificação", 5, 20).concat(noEmojis("número de identificação")),
  }),
  "Os campos adicionais não são permitidos. Por favor, verifique os campos."
);

module.exports = guestValidation;
