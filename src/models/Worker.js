const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Worker = connection.define("worker", {
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: { msg: "O nome é obrigatório." },
      len: { args: [3, 100], msg: "O nome deve ter entre 3 e 100 caracteres." },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: "O e-mail fornecido não é válido." },
      notNull: { msg: "O e-mail é obrigatório." },
    },
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: { msg: "A URL fornecida não é válida." },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "A senha é obrigatória." },
      len: { args: [8, 100], msg: "A senha deve ter pelo menos 8 caracteres." },
    },
  },
});

module.exports = Worker;
