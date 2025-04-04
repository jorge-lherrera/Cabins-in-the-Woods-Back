const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Cabin = connection.define("cabin", {
  guestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "guest",
      key: "id",
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  maxCapacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  regularPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Cabin;
