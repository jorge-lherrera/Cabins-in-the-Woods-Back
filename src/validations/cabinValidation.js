const Yup = require("yup");
const {
  positiveNumber,
  positiveInteger,
  validateStringLength,
  applyNoUnknown,
} = require("./validationUtils");

const cabinValidation = applyNoUnknown(
  Yup.object().shape({
    name: validateStringLength("nome da cabana", 3, 100),
    maxCapacity: positiveInteger("capacidade máxima"),
    regularPrice: positiveNumber("preço regular").required(
      "O preço regular é obrigatório."
    ),
    discount: Yup.number()
      .typeError("O desconto deve ser um número.")
      .min(0, "O desconto não pode ser negativo.")
      .max(100, "O desconto não pode ser maior que 100%.")
      .nullable(),
    image: Yup.string().url("A URL da imagem não é válida.").nullable(),
    description: validateStringLength("descrição", 0, 500).nullable(),
  }),
  "Os campos adicionais não são permitidos. Por favor, verifique os campos."
);

module.exports = cabinValidation;
