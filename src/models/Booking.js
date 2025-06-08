const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");
const noEmojis = require("../utils/noEmojis");

const Cabin = require("./Cabin");
const Guest = require("./Guest");

const Booking = connection.define("booking", {
  cabinId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "cabin",
      key: "id",
    },
    validate: {
      isInt: { msg: "O ID da cabana deve ser um número inteiro." },
      notNull: { msg: "O ID da cabana é obrigatório." },
    },
  },
  guestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "guest",
      key: "id",
    },
    validate: {
      isInt: { msg: "O ID do hóspede deve ser um número inteiro." },
      notNull: { msg: "O ID do hóspede é obrigatório." },
    },
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: { msg: "A data de início deve ser válida." },
      notNull: { msg: "A data de início é obrigatória." },
      isNotPast(value) {
        if (new Date(value) < new Date().setHours(0, 0, 0, 0)) {
          throw new Error("A data de início não pode ser no passado.");
        }
      },
    },
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: { msg: "A data de término deve ser válida." },
      notNull: { msg: "A data de término é obrigatória." },
      isAfterStartDate(value) {
        if (!this.startDate || value <= this.startDate) {
          throw new Error(
            "A data de término deve ser posterior à data de início."
          );
        }
      },
    },
  },
  numNights: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: "O número de noites deve ser um número inteiro." },
      min: { args: 1, msg: "O número de noites deve ser pelo menos 1." },
      notNull: { msg: "O número de noites é obrigatório." },
    },
  },
  numGuests: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: "O número de hóspedes deve ser um número inteiro." },
      min: { args: 1, msg: "O número de hóspedes deve ser pelo menos 1." },
      notNull: { msg: "O número de hóspedes é obrigatório." },
    },
  },
  cabinPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: "O preço da cabana deve ser um número decimal." },
      min: { args: 0, msg: "O preço da cabana não pode ser negativo." },
      notNull: { msg: "O preço da cabana é obrigatório." },
    },
  },
  extrasPrice: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    validate: {
      isDecimal: { msg: "O preço dos extras deve ser um número decimal." },
      min: { args: 0, msg: "O preço dos extras não pode ser negativo." },
    },
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: "O preço total deve ser um número decimal." },
      min: { args: 0, msg: "O preço total não pode ser negativo." },
      notNull: { msg: "O preço total é obrigatório." },
    },
  },
  hasBreakfast: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    validate: {
      notNull: { msg: "O campo café da manhã é obrigatório." },
    },
  },
  observations: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: {
        args: [0, 255],
        msg: "As observações devem ter no máximo 255 caracteres.",
      },
      noEmojis(value) {
        noEmojis(value, "observações");
      },
    },
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    validate: {
      notNull: { msg: "O campo pagamento é obrigatório." },
    },
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "unconfirmed",
    validate: {
      isIn: {
        args: [["unconfirmed", "checked-in", "checked-out"]],
        msg: "Status inválido para a reserva.",
      },
      notNull: { msg: "O status é obrigatório." },
      noEmojis(value) {
        noEmojis(value, "status");
      },
    },
  },
});

Cabin.hasMany(Booking, { foreignKey: "cabinId", as: "bookings" });
Booking.belongsTo(Cabin, { foreignKey: "cabinId", as: "cabin" });

Guest.hasMany(Booking, { foreignKey: "guestId", as: "bookings" });
Booking.belongsTo(Guest, { foreignKey: "guestId", as: "guest" });

module.exports = Booking;
