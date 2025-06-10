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
  maxGuestsPerBooking: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: "O número máximo de hóspedes deve ser um número inteiro." },
      min: {
        args: 1,
        msg: "O número máximo de hóspedes deve ser pelo menos 1.",
      },
      notNull: { msg: "O número máximo de hóspedes é obrigatório." },
    },
  },
  breakfastPrice: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: "O preço do café da manhã deve ser um número decimal.",
      },
      min: {
        args: [0],
        msg: "O preço não pode ser negativo.",
      },
      notNull: { msg: "O preço do café da manhã é obrigatório." },
    },
  },
});

module.exports = Setting;
