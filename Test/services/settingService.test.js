const settingService = require("../../src/services/settingService");
const { connection } = require("../../src/database/connection");
const Setting = require("../../src/models/Setting");

describe("settingService", () => {
  beforeAll(async () => {
    await connection.sync({ force: true });
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should create a unique setting", async () => {
    const result = await settingService.createUniqueSetting({
      minBookingLength: 2,
      maxBookingLength: 10,
      maxGuestsPerBooking: 5,
      breakfastPrice: 20.0,
    });
    expect(result.resource).toBeDefined();
    expect(result.error).toBeNull();
    expect(result.resource.minBookingLength).toBe(2);
  });

  it("should not allow creating a second setting", async () => {
    const result = await settingService.createUniqueSetting({
      minBookingLength: 1,
      maxBookingLength: 5,
      maxGuestsPerBooking: 2,
      breakfastPrice: 10.0,
    });
    expect(result.error).toBeDefined();
    expect(result.error.errorCode).toBe("SETTING_ALREADY_EXISTS");
  });

  it("should get the unique setting", async () => {
    const result = await settingService.getUniqueSetting();
    expect(result.resource).toBeDefined();
    expect(result.error).toBeNull();
  });

  it("should update the unique setting", async () => {
    const result = await settingService.updateUniqueSetting({
      minBookingLength: 3,
      maxBookingLength: 12,
      maxGuestsPerBooking: 6,
      breakfastPrice: 25.0,
    });
    expect(result.resource).toBeDefined();
    expect(result.error).toBeNull();
    expect(result.resource.minBookingLength).toBe(3);
  });

  it("should not allow maxBookingLength <= minBookingLength", async () => {
    const result = await settingService.updateUniqueSetting({
      minBookingLength: 10,
      maxBookingLength: 5,
    });
    expect(result.error).toBeDefined();
    expect(result.error.errorCode).toBe("INVALID_BOOKING_LENGTH");
  });
});
