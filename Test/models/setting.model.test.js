const { connection } = require("../../src/database/connection");
const Setting = require("../../src/models/Setting");

describe("Setting Model", () => {
  beforeAll(async () => {
    await connection.sync({ force: true });
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should create a valid setting", async () => {
    const setting = await Setting.create({
      minBookingLength: 2,
      maxBookingLength: 10,
      maxGuestsPerBooking: 5,
      breakfastPrice: 20.0,
    });
    expect(setting.id).toBeDefined();
    expect(setting.minBookingLength).toBe(2);
  });

  it("should not allow maxBookingLength <= minBookingLength", async () => {
    await expect(
      Setting.create({
        minBookingLength: 5,
        maxBookingLength: 3,
        maxGuestsPerBooking: 2,
        breakfastPrice: 10.0,
      })
    ).rejects.toThrow(/maior que o comprimento mínimo/);
  });
});
