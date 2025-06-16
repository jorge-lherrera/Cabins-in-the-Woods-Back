// Seeder for Booking model
"use strict";

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const baseDate = new Date("2025-07-01");
    const statuses = ["unconfirmed", "checked-in", "checked-out"];
    const nightRanges = [
      { min: 2, max: 3, count: 10 },
      { min: 4, max: 5, count: 15 },
      { min: 8, max: 14, count: 5 },
    ];
    const numNightsArr = [];
    nightRanges.forEach((range) => {
      for (let i = 0; i < range.count; i++) {
        numNightsArr.push(
          Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
        );
      }
    });
    // Shuffle numNightsArr for randomness
    for (let i = numNightsArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numNightsArr[i], numNightsArr[j]] = [numNightsArr[j], numNightsArr[i]];
    }
    const bookings = Array.from({ length: 30 }, (_, i) => {
      const cabinId = i + 1;
      const guestId = i + 1;
      const startDate = addDays(baseDate, i * 5);
      const numNights = numNightsArr[i];
      const endDate = addDays(startDate, numNights);
      const numGuests = Math.floor(Math.random() * 6) + 1;
      const cabinPrice = 200 + Math.floor(Math.random() * 350); // 200–550
      const extrasPrice = Math.floor(Math.random() * 100); // 0–99
      const totalPrice = cabinPrice + extrasPrice;
      const hasBreakfast = Math.random() < 0.5;
      const isPaid = Math.random() < 0.6;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const observations = [
        "Reserva para casal.",
        "Família com crianças.",
        "Viagem solo.",
        "Grupo de amigos.",
        "Lua de mel.",
        "Férias em família.",
        "Viagem de amigos.",
        "Casal em férias.",
        "Viagem de negócios.",
        "Descanso de fim de semana.",
        "Aventura na natureza.",
        "Trabalho remoto.",
        "Retiro espiritual.",
        "Comemoração de aniversário.",
        "Viagem internacional.",
        "Evento corporativo.",
        "Férias escolares.",
        "Viagem cultural.",
        "Descanso prolongado.",
        "Viagem gastronômica.",
      ];
      return {
        cabinId,
        guestId,
        startDate,
        endDate,
        numNights,
        numGuests,
        cabinPrice,
        extrasPrice,
        totalPrice,
        hasBreakfast,
        observations: observations[i % observations.length],
        isPaid,
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("bookings", bookings);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("bookings", null, {});
  },
};
