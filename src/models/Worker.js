const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Worker = connection.define("worker", {
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: {
        msg: "O nome é obrigatório.",
      },
      notEmpty: {
        msg: "O nome não pode estar vazio.",
      },
      is: {
        args: /^[a-zA-ZÀ-ÿ\s]+$/i,
        msg: "O nome deve conter apenas letras e espaços.",
      },
    },
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: "O e-mail é obrigatório.",
      },
      isEmail: {
        msg: "O e-mail fornecido não é válido.",
      },
    },
  },
  avatar: {
    type: DataTypes.STRING,
    validate: {
      isUrl: {
        msg: "O avatar deve ser uma URL válida.",
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "A senha é obrigatória.",
      },
      notEmpty: {
        msg: "A senha não pode estar vazia.",
      },
      len: {
        args: [8, 100],
        msg: "A senha deve ter pelo menos 8 caracteres.",
      },
    },
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Worker;
