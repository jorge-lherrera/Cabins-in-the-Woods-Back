const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Guest = connection.define("guest", {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  countryFlag: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nationalIdNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Guest;
