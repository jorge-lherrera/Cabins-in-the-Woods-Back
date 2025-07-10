const guestService = require("../../src/services/guestService");
const { connection } = require("../../src/database/connection");
const Guest = require("../../src/models/Guest");

describe("guestService", () => {
  beforeAll(async () => {
    await connection.sync({ force: true });
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should create a new guest", async () => {
    const result = await guestService.createGuest({
      fullName: "Guest Serviço",
      email: "servico@email.com",
      nationality: "Brasil",
      nationalIdNumber: "9999999999",
    });
    expect(result.resource).toBeDefined();
    expect(result.error).toBeNull();
    expect(result.resource.fullName).toBe("Guest Serviço");
  });

  it("should not create a guest with duplicate email", async () => {
    await guestService.createGuest({
      fullName: "Guest Duplicado",
      email: "duplicado@email.com",
      nationality: "Brasil",
      nationalIdNumber: "8888888888",
    });
    const result = await guestService.createGuest({
      fullName: "Outro Guest",
      email: "duplicado@email.com",
      nationality: "Brasil",
      nationalIdNumber: "7777777777",
    });
    expect(result.error).toBeDefined();
    expect(result.error.errorCode).toBe("GUEST_ALREADY_EXISTS");
  });

  it("should return error if guest not found", async () => {
    const result = await guestService.getGuestById(9999);
    expect(result.error).toBeDefined();
    expect(result.error.errorCode).toBe("GUEST_NOT_FOUND");
  });
});
