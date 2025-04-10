const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Worker = connection.define("worker", {
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: { msg: "El nombre es obligatorio" },
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
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: { msg: "La URL del avatar no es válida" },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "La contraseña es obligatoria" },
    },
  },
});

module.exports = Worker;
