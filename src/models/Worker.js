const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");
const emojiRegex = require("emoji-regex");

function noEmojis(value, field) {
  if (typeof value === "string" && emojiRegex().test(value)) {
    throw new Error(`O campo ${field} não pode conter emoticonos.`);
  }
}

const Worker = connection.define("worker", {
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: { msg: "O nome é obrigatório." },
      notEmpty: { msg: "O nome não pode estar vazio." },
      len: {
        args: [3, 100],
        msg: "O nome deve ter entre 3 e 100 caracteres.",
      },
      noEmojis(value) {
        noEmojis(value, "nome");
      },
    },
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      notNull: { msg: "O e-mail é obrigatório." },
      isEmail: { msg: "O e-mail fornecido não é válido." },
      len: {
        args: [1, 150],
        msg: "O e-mail não pode ter mais de 150 caracteres.",
      },
      noEmojis(value) {
        noEmojis(value, "e-mail");
      },
    },
  },
  avatar: {
    type: DataTypes.STRING,
    validate: {
      isUrl: { msg: "O avatar deve ser uma URL válida." },
      noEmojis(value) {
        noEmojis(value, "avatar");
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "A senha é obrigatória." },
      notEmpty: { msg: "A senha não pode estar vazia." },
      len: {
        args: [8, 100],
        msg: "A senha deve ter entre 8 e 100 caracteres.",
      },
      noEmojis(value) {
        noEmojis(value, "senha");
      },
    },
  },
});

module.exports = Worker;
