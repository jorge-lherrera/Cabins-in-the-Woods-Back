const Yup = require("yup");

const guestValidation = Yup.object().shape({
  fullName: Yup.string()
    .min(3, "O nome completo deve ter pelo menos 3 caracteres.")
    .max(100, "O nome completo não pode ter mais de 100 caracteres.")
    .required("O nome completo é obrigatório."),
  email: Yup.string()
    .email("O e-mail fornecido não é válido.")
    .required("O e-mail é obrigatório."),
  nationality: Yup.string()
    .min(2, "A nacionalidade deve ter pelo menos 2 caracteres.")
    .max(50, "A nacionalidade não pode ter mais de 50 caracteres.")
    .required("A nacionalidade é obrigatória."),
  countryFlag: Yup.string()
    .url("A URL da bandeira do país não é válida.")
    .nullable(),
  nationalIdNumber: Yup.string()
    .min(5, "O número de identificação deve ter pelo menos 5 caracteres.")
    .max(20, "O número de identificação não pode ter mais de 20 caracteres.")
    .required("O número de identificação é obrigatório."),
});

module.exports = guestValidation;
