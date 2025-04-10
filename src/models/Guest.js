const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Guest = connection.define("guest", {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "El nombre completo es obligatorio" },
      len: [3, 100],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: "El correo electrónico no es válido" },
      notNull: { msg: "El correo electrónico es obligatorio" },
    },
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "La nacionalidad es obligatoria" },
      len: [2, 50],
    },
  },
  countryFlag: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nationalIdNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: "El número de identificación nacional es obligatorio" },
      len: [5, 20],
    },
  },
});

module.exports = Guest;
