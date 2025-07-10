const bookingService = require("../../src/services/bookingService");
const Booking = require("../../src/models/Booking");
const Cabin = require("../../src/models/Cabin");
const Guest = require("../../src/models/Guest");
const Setting = require("../../src/models/Setting");

jest.mock("../../src/models/Booking");
jest.mock("../../src/models/Cabin");
jest.mock("../../src/models/Guest");
jest.mock("../../src/models/Setting");

describe("bookingService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar erro se cabana não existir", async () => {
    Cabin.findByPk.mockResolvedValue(null);
    Guest.findByPk.mockResolvedValue({ id: 1 });
    const result = await bookingService.createBooking({
      cabinId: 1,
      guestId: 1,
      startDate: new Date(),
      endDate: new Date(),
      numNights: 1,
      numGuests: 1,
      cabinPrice: 100,
      extrasPrice: 0,
      totalPrice: 100,
      hasBreakfast: false,
      isPaid: false,
    });
    expect(result.error).toMatch(/Cabana não encontrado/);
  });

  // Agrega mais testes para sobreposição, regras de negócio, criação, etc.
});
