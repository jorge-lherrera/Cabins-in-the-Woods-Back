const Yup = require("yup");

const bookingValidation = Yup.object().shape({
  cabinId: Yup.number()
    .integer("O ID da cabana deve ser um número inteiro")
    .required("O ID da cabana é obrigatório"),
  guestId: Yup.number()
    .integer("O ID do hóspede deve ser um número inteiro")
    .required("O ID do hóspede é obrigatório"),
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
  numNights: Yup.number()
    .integer("O número de noites deve ser um número inteiro")
    .min(1, "O número de noites deve ser pelo menos 1")
    .required("O número de noites é obrigatório"),
  numGuests: Yup.number()
    .integer("O número de hóspedes deve ser um número inteiro")
    .min(1, "O número de hóspedes deve ser pelo menos 1")
    .required("O número de hóspedes é obrigatório"),
  cabinPrice: Yup.number()
    .typeError("O preço da cabana deve ser um número")
    .min(0, "O preço da cabana não pode ser negativo")
    .required("O preço da cabana é obrigatório"),
  extrasPrice: Yup.number()
    .typeError("O preço dos extras deve ser um número")
    .min(0, "O preço dos extras não pode ser negativo")
    .nullable(),
  totalPrice: Yup.number()
    .typeError("O preço total deve ser um número")
    .min(0, "O preço total não pode ser negativo")
    .required("O preço total é obrigatório"),
  hasBreakfast: Yup.boolean()
    .typeError("O campo de café da manhã deve ser verdadeiro ou falso")
    .required("O campo de café da manhã é obrigatório"),
  observations: Yup.string()
    .max(255, "As observações não podem ter mais de 255 caracteres")
    .nullable(),
  isPaid: Yup.boolean()
    .typeError("O campo de pagamento deve ser verdadeiro ou falso")
    .required("O campo de pagamento é obrigatório"),
});

module.exports = bookingValidation;
