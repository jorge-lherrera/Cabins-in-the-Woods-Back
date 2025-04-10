const Yup = require("yup");

const cabinValidation = Yup.object().shape({
  name: Yup.string()
    .min(3, "O nome da cabana deve ter pelo menos 3 caracteres.")
    .max(100, "O nome da cabana não pode ter mais de 100 caracteres.")
    .required("O nome da cabana é obrigatório."),
  maxCapacity: Yup.number()
    .integer("A capacidade máxima deve ser um número inteiro.")
    .min(1, "A capacidade máxima deve ser pelo menos 1.")
    .required("A capacidade máxima é obrigatória."),
  regularPrice: Yup.number()
    .typeError("O preço regular deve ser um número.")
    .min(0, "O preço regular não pode ser negativo.")
    .required("O preço regular é obrigatório."),
  discount: Yup.number()
    .typeError("O desconto deve ser um número.")
    .min(0, "O desconto não pode ser negativo.")
    .max(100, "O desconto não pode ser maior que 100%.")
    .nullable(),
  image: Yup.string().url("A URL da imagem não é válida.").nullable(),
  description: Yup.string()
    .max(500, "A descrição não pode ter mais de 500 caracteres.")
    .nullable(),
});

module.exports = cabinValidation;
