const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");
const noEmojis = require("../utils/noEmojis");

const Guest = connection.define("guest", {
  fullName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: { msg: "O nome completo é obrigatório." },
      len: { args: [3, 100], msg: "O nome deve ter entre 3 e 100 caracteres." },
      noEmojis(value) {
        noEmojis(value, "nome completo");
      },
    },
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: "O e-mail fornecido não é válido." },
      notNull: { msg: "O e-mail é obrigatório." },
      noEmojis(value) {
        noEmojis(value, "e-mail");
      },
    },
  },
  nationality: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notNull: { msg: "A nacionalidade é obrigatória." },
      len: {
        args: [2, 50],
        msg: "A nacionalidade deve ter entre 2 e 50 caracteres.",
      },
      noEmojis(value) {
        noEmojis(value, "nacionalidade");
      },
    },
  },
  countryFlag: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: { msg: "A URL da bandeira do país não é válida." },
      noEmojis(value) {
        noEmojis(value, "bandeira do país");
      },
    },
  },
  nationalIdNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: "O número de identificação nacional é obrigatório." },
      len: {
        args: [5, 20],
        msg: "O número de identificação deve ter entre 5 e 20 caracteres.",
      },
      noEmojis(value) {
        noEmojis(value, "número de identificação");
      },
    },
  },
});

module.exports = Guest;
