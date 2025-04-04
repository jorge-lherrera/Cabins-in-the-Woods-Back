const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Setting = connection.define("setting", {
  minBookingLength: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  maxBookingLength: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30,
  },
  breakfastPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
});

module.exports = Setting;
