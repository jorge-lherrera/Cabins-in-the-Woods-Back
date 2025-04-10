const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Setting = connection.define("setting", {
  minBookingLength: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      isInt: true,
      min: 1,
      notNull: { msg: "La longitud mínima de la reserva es obligatoria" },
    },
  },
  maxBookingLength: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30,
    validate: {
      isInt: true,
      min: 1,
      notNull: { msg: "La longitud máxima de la reserva es obligatoria" },
      isGreaterThanMin(value) {
        if (value <= this.minBookingLength) {
          throw new Error("La longitud máxima debe ser mayor que la mínima");
        }
      },
    },
  },
  breakfastPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
    validate: {
      isFloat: true,
      min: 0,
      notNull: { msg: "El precio del desayuno es obligatorio" },
    },
  },
});

module.exports = Setting;
