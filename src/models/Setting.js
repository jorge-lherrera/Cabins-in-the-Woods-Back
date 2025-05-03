const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Setting = connection.define("setting", {
  minBookingLength: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: "O comprimento mínimo deve ser um número inteiro." },
      min: { args: 1, msg: "O comprimento mínimo deve ser pelo menos 1." },
      notNull: { msg: "O comprimento mínimo é obrigatório." },
    },
  },
  maxBookingLength: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: "O comprimento máximo deve ser um número inteiro." },
      min: { args: 1, msg: "O comprimento máximo deve ser pelo menos 1." },
      notNull: { msg: "O comprimento máximo é obrigatório." },
      isGreaterThanMin(value) {
        if (value <= this.minBookingLength) {
          throw new Error(
            "O comprimento máximo deve ser maior que o comprimento mínimo."
          );
        }
      },
    },
  },
  breakfastPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: {
        msg: "O preço do café da manhã deve ser um número decimal.",
      },
      notNull: { msg: "O preço do café da manhã é obrigatório." },
    },
  },
});

module.exports = Setting;
