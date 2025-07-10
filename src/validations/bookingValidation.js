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
    numGuests: positiveInteger("número de hóspedes"),
    extrasPrice: positiveNumber("preço dos extras").nullable(),
    hasBreakfast: Yup.boolean()
      .typeError("O campo de café da manhã deve ser verdadeiro ou falso")
      .required("O campo de café da manhã é obrigatório"),
    observations: Yup.string()
      .max(255, "O campo observações não pode ter mais de 255 caracteres")
      .nullable(),
    isPaid: Yup.boolean()
      .typeError("O campo de pagamento deve ser verdadeiro ou falso")
      .required("O campo de pagamento é obrigatório"),
    status: validateStringLength("status", 0, 20).oneOf(
      ["unconfirmed", "checked-in", "checked-out"],
      "Status deve ser: unconfirmed, checked-in ou checked-out"
    ),
  }),
  "Os campos adicionais não são permitidos. Por favor, verifique os campos."
);

module.exports = bookingValidation;
