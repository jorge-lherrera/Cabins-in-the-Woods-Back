"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookingsToday = Array.from({ length: 7 }, (_, i) => ({
      cabinId: i + 1,
      guestId: i + 1,
      startDate: new Date(today),
      endDate: new Date(today.getTime() + (2 + (i % 3)) * 24 * 60 * 60 * 1000),
      numNights: 2 + (i % 3),
      numGuests: 1 + (i % 4),
      cabinPrice: 300 + i * 10,
      extrasPrice: 50 + (i % 2) * 10,
      totalPrice: 350 + i * 10 + (i % 2) * 10,
      hasBreakfast: i % 2 === 0,
      observations: `Reserva de hoje #${i + 1}`,
      isPaid: i % 2 === 1,
      status:
        i % 3 === 0
          ? "checked-in"
          : i % 3 === 1
          ? "unconfirmed"
          : "checked-out",
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const bookingsPast = Array.from({ length: 12 }, (_, idx) => {
      const daysAgo = Math.floor(Math.random() * 90) + 1;
      const start = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      const end = new Date(
        start.getTime() + (2 + (idx % 5)) * 24 * 60 * 60 * 1000
      );
      return {
        cabinId: 8 + idx,
        guestId: 8 + idx,
        startDate: start,
        endDate: end,
        numNights: Math.ceil((end - start) / (1000 * 60 * 60 * 24)),
        numGuests: 1 + (idx % 4),
        cabinPrice: 200 + idx * 10,
        extrasPrice: 20 + (idx % 3) * 10,
        totalPrice: 220 + idx * 10,
        hasBreakfast: idx % 2 === 0,
        observations: `Reserva passada #${idx + 1}`,
        isPaid: idx % 2 === 1,
        status:
          idx % 3 === 0
            ? "checked-in"
            : idx % 3 === 1
            ? "unconfirmed"
            : "checked-out",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    const bookingsFuture = Array.from({ length: 11 }, (_, idx) => {
      const daysAhead = Math.floor(Math.random() * 90) + 1;
      const start = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);
      const end = new Date(
        start.getTime() + (2 + (idx % 5)) * 24 * 60 * 60 * 1000
      );
      return {
        cabinId: 20 + idx,
        guestId: 20 + idx,
        startDate: start,
        endDate: end,
        numNights: Math.ceil((end - start) / (1000 * 60 * 60 * 24)),
        numGuests: 1 + (idx % 4),
        cabinPrice: 250 + idx * 10,
        extrasPrice: 30 + (idx % 3) * 10,
        totalPrice: 280 + idx * 10,
        hasBreakfast: idx % 2 === 1,
        observations: `Reserva futura #${idx + 1}`,
        isPaid: idx % 2 === 0,
        status:
          idx % 3 === 0
            ? "checked-in"
            : idx % 3 === 1
            ? "unconfirmed"
            : "checked-out",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    const bookings = [...bookingsToday, ...bookingsPast, ...bookingsFuture];
    await queryInterface.bulkInsert("bookings", bookings);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("bookings", null, {});
  },
};
