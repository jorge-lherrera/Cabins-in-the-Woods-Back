"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { INTEGER, DECIMAL, DATE } = Sequelize;

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
      maxGuestsPerBooking: {
        type: INTEGER,
        allowNull: false,
      },

      breakfastPrice: {
        type: DECIMAL(8, 2),
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
      where: Sequelize.literal('"minBookingLength" >= 1'),
      name: "check_min_booking_length",
    });

    await queryInterface.addConstraint("settings", {
      fields: ["maxBookingLength", "minBookingLength"],
      type: "check",
      where: Sequelize.literal('"maxBookingLength" > "minBookingLength"'),
      name: "check_max_booking_length",
    });

    await queryInterface.addConstraint("settings", {
      fields: ["breakfastPrice"],
      type: "check",
      where: Sequelize.literal('"breakfastPrice" >= 0'),
      name: "check_breakfast_price_positive",
    });
    await queryInterface.addConstraint("settings", {
      fields: ["maxGuestsPerBooking"],
      type: "check",
      where: Sequelize.literal('"maxGuestsPerBooking" >= 1'),
      name: "check_max_guests_per_booking_positive",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("settings");
  },
};
