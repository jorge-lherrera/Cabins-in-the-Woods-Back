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
      },
      minBookingLength: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      maxBookingLength: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 30,
      },
      breakfastPrice: {
        type: FLOAT,
        allowNull: false,
        defaultValue: 0.0,
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
        maxBookingLength: { [Op.gte]: Sequelize.col("minBookingLength") },
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
