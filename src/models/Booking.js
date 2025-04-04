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
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  numNights: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  numGuests: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cabinPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  extrasPrice: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  hasBreakfast: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  observations: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

Cabin.hasMany(Booking, { foreignKey: "cabinId" });
Booking.belongsTo(Cabin, { foreignKey: "cabinId" });

Guest.hasMany(Booking, { foreignKey: "guestId" });
Booking.belongsTo(Guest, { foreignKey: "guestId" });

module.exports = Booking;
