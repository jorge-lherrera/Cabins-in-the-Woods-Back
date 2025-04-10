const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Cabin = connection.define("cabin", {
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: "O nome da cabana é obrigatório." },
      len: { args: [3, 100], msg: "O nome deve ter entre 3 e 100 caracteres." },
    },
  },
  maxCapacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: "A capacidade máxima deve ser um número inteiro." },
      min: { args: 1, msg: "A capacidade máxima deve ser pelo menos 1." },
      notNull: { msg: "A capacidade máxima é obrigatória." },
    },
  },
  regularPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: { msg: "O preço regular deve ser um número decimal." },
      min: { args: 0, msg: "O preço regular não pode ser negativo." },
      notNull: { msg: "O preço regular é obrigatório." },
    },
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      isFloat: { msg: "O desconto deve ser um número decimal." },
      min: { args: 0, msg: "O desconto não pode ser negativo." },
      max: { args: 100, msg: "O desconto não pode ser maior que 100%." },
    },
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: { msg: "A URL da imagem não é válida." },
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
    },
  },
});

module.exports = Cabin;
