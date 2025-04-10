const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

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
  },
  guestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "guest",
      key: "id",
    },
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      notNull: { msg: "La fecha de inicio es obligatoria" },
    },
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      notNull: { msg: "La fecha de fin es obligatoria" },
      isAfterStartDate(value) {
        if (value <= this.startDate) {
          throw new Error(
            "La fecha de fin debe ser posterior a la fecha de inicio"
          );
        }
      },
    },
  },
  numNights: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 1,
      notNull: { msg: "El número de noches es obligatorio" },
    },
  },
  numGuests: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 1,
      notNull: { msg: "El número de huéspedes es obligatorio" },
    },
  },
  cabinPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: true,
      min: 0,
      notNull: { msg: "El precio de la cabaña es obligatorio" },
    },
  },
  extrasPrice: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      isFloat: true,
      min: 0,
    },
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: true,
      min: 0,
      notNull: { msg: "El precio total es obligatorio" },
    },
  },
  hasBreakfast: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  observations: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: [0, 255],
    },
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

Cabin.hasMany(Booking, { foreignKey: "cabinId", as: "bookings" });
Booking.belongsTo(Cabin, { foreignKey: "cabinId", as: "cabin" });

Guest.hasMany(Booking, { foreignKey: "guestId", as: "bookings" });
Booking.belongsTo(Guest, { foreignKey: "guestId", as: "guest" });

module.exports = Booking;
