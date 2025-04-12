const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Setting = connection.define("setting", {
  minBookingLength: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    // validate: {
    //   isInt: { msg: "O comprimento mínimo deve ser um número inteiro." },
    //   min: { args: 1, msg: "O comprimento mínimo deve ser pelo menos 1." },
    //   notNull: { msg: "O comprimento mínimo é obrigatório." },
    // },
  },
  maxBookingLength: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30,
    // validate: {
    //   isInt: { msg: "O comprimento máximo deve ser um número inteiro." },
    //   min: { args: 1, msg: "O comprimento máximo deve ser pelo menos 1." },
    //   notNull: { msg: "O comprimento máximo é obrigatório." },
    //   isGreaterThanMin(value) {
    //     if (!this.minBookingLength || value <= this.minBookingLength) {
    //       throw new Error(
    //         "O comprimento máximo deve ser maior que o comprimento mínimo."
    //       );
    //     }
    //   },
    // },
  },
  breakfastPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
    // validate: {
    //   isFloat: { msg: "O preço do café da manhã deve ser um número decimal." },
    //   min: { args: 0, msg: "O preço do café da manhã não pode ser negativo." },
    //   notNull: { msg: "O preço do café da manhã é obrigatório." },
    //   max: {
    //     args: 100,
    //     msg: "O preço do café da manhã não pode ser maior que 100.",
    //   },
    // },
  },
});

module.exports = Setting;
