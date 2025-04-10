const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Cabin = connection.define("cabin", {
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: "El nombre de la cabaña es obligatorio" },
      len: [3, 100],
    },
  },
  maxCapacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 1,
      notNull: { msg: "La capacidad máxima es obligatoria" },
    },
  },
  regularPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: true,
      min: 0,
      notNull: { msg: "El precio regular es obligatorio" },
    },
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      isFloat: true,
      min: 0,
      max: 100,
    },
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true,
    },
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      len: [0, 500],
    },
  },
});

module.exports = Cabin;
