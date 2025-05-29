// Seeder for Setting model
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("settings", [
      {
        minBookingLength: 2,
        maxBookingLength: 14,
        maxGuestsPerBooking: 6,
        breakfastPrice: 50.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("settings", null, {});
  },
};
