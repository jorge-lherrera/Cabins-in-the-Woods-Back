const Yup = require("yup");
const {
  positiveNumber,
  positiveInteger,
  validateStringLength,
  applyNoUnknown,
} = require("./validationUtils");

const bookingValidation = applyNoUnknown(
  Yup.object().shape({
    cabinId: positiveInteger("ID da cabana"),
    guestId: positiveInteger("ID do hóspede"),
    startDate: Yup.date()
      .typeError("A data de início deve ser uma data válida")
      .required("A data de início é obrigatória"),
    endDate: Yup.date()
      .typeError("A data de término deve ser uma data válida")
      .min(
        Yup.ref("startDate"),
        "A data de término deve ser posterior à data de início"
      )
      .required("A data de término é obrigatória"),
    numNights: positiveInteger("número de noites"),
    numGuests: positiveInteger("número de hóspedes"),
    cabinPrice: positiveNumber("preço da cabana").required(
      "O preço da cabana é obrigatório"
    ),
    extrasPrice: positiveNumber("preço dos extras").nullable(),
    totalPrice: positiveNumber("preço total").required(
      "O preço total é obrigatório"
    ),
    hasBreakfast: Yup.boolean()
      .typeError("O campo de café da manhã deve ser verdadeiro ou falso")
      .required("O campo de café da manhã é obrigatório"),
    observations: validateStringLength("observações", 0, 255).nullable(),
    isPaid: Yup.boolean()
      .typeError("O campo de pagamento deve ser verdadeiro ou falso")
      .required("O campo de pagamento é obrigatório"),
  }),
  "Os campos adicionais não são permitidos. Por favor, verifique os campos."
);

module.exports = bookingValidation;
