const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Guest = connection.define("guest", {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "O nome completo é obrigatório." },
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
  nationality: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "A nacionalidade é obrigatória." },
      len: {
        args: [2, 50],
        msg: "A nacionalidade deve ter entre 2 e 50 caracteres.",
      },
    },
  },
  countryFlag: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: { msg: "A URL da bandeira do país não é válida." },
    },
  },
  nationalIdNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: "O número de identificação nacional é obrigatório." },
      len: {
        args: [5, 20],
        msg: "O número de identificação deve ter entre 5 e 20 caracteres.",
      },
    },
  },
});

module.exports = Guest;
