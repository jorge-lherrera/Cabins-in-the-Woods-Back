const BookingModel = require("../src/models/Booking");

describe("Booking Model", () => {
  it("deve ter as associações corretas", () => {
    expect(typeof BookingModel.associations.cabin).toBe("object");
    expect(typeof BookingModel.associations.guest).toBe("object");
  });

  it("deve não permitir valores negativos em cabinPrice", async () => {
    expect.assertions(1);
    try {
      await BookingModel.build({
        cabinId: 1,
        guestId: 1,
        startDate: new Date("2025-06-01"),
        endDate: new Date("2025-06-02"),
        numNights: 1,
        numGuests: 1,
        cabinPrice: -10,
        extrasPrice: 0,
        totalPrice: 0,
        hasBreakfast: false,
        isPaid: false,
        status: "unconfirmed",
      }).validate();
    } catch (err) {
      expect(
        err.errors.some((e) =>
          e.message.includes("O preço da cabana não pode ser negativo")
        )
      ).toBe(true);
    }
  });
});
