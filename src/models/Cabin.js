const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");
const noEmojis = require("../utils/noEmojis");

const Cabin = connection.define("cabin", {
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: "O nome da cabana é obrigatório." },
      len: { args: [3, 100], msg: "O nome deve ter entre 3 e 100 caracteres." },
      noEmojis(value) {
        noEmojis(value, "nome da cabana");
      },
    },
  },
  maxCapacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: "A capacidade máxima deve ser um número inteiro." },
      min: { args: [1], msg: "A capacidade máxima deve ser pelo menos 1." },
      notNull: { msg: "A capacidade máxima é obrigatória." },
    },
  },
  regularPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: "O preço regular deve ser um número decimal." },
      min: { args: [0], msg: "O preço regular não pode ser negativo." },
      notNull: { msg: "O preço regular é obrigatório." },
    },
  },
  discount: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      isDecimal: { msg: "O desconto deve ser um número decimal." },
      min: { args: [0], msg: "O desconto não pode ser negativo." },
      max: { args: [100], msg: "O desconto não pode ser maior que 100%." },
      discountNotGreaterThanPrice() {
        if (this.discount && this.discount > this.regularPrice) {
          throw new Error("O desconto não pode ser maior que o preço regular.");
        }
      },
    },
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: { msg: "A URL da imagem não é válida." },
      isImageUrl(value) {
        if (value && !value.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$/i)) {
          throw new Error(
            "A imagem deve ter extensão válida (jpg, jpeg, png, gif, webp, svg, bmp, tiff)."
          );
        }
      },
      noEmojis(value) {
        noEmojis(value, "imagem");
      },
    },
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      len: {
        args: [0, 500],
        msg: "A descrição deve ter no máximo 500 caracteres.",
      },
      noEmojis(value) {
        noEmojis(value, "descrição");
      },
    },
  },
});

module.exports = Cabin;
