"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { INTEGER, FLOAT, DATE, Op } = Sequelize;

    await queryInterface.createTable("settings", {
      id: {
        type: INTEGER,
        primaryKey: true,
        allowNull: false,
        defaultValue: 1,
        unique: true,
      },
      minBookingLength: {
        type: INTEGER,
        allowNull: false,
      },
      maxBookingLength: {
        type: INTEGER,
        allowNull: false,
      },

      breakfastPrice: {
        type: FLOAT,
        allowNull: false,
      },
      createdAt: {
        type: DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DATE,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint("settings", {
      fields: ["minBookingLength"],
      type: "check",
      where: {
        minBookingLength: { [Op.gte]: 1 },
      },
      name: "check_min_booking_length",
    });

    await queryInterface.addConstraint("settings", {
      fields: ["maxBookingLength"],
      type: "check",
      where: {
        maxBookingLength: { [Op.gt]: Sequelize.col("minBookingLength") },
      },
      name: "check_max_booking_length",
    });

    await queryInterface.addConstraint("settings", {
      fields: ["breakfastPrice"],
      type: "check",
      where: {
        breakfastPrice: { [Op.gte]: 0 },
      },
      name: "check_breakfast_price_positive",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("settings");
  },
};
