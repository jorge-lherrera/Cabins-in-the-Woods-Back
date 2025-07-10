const { connection } = require("../../src/database/connection");
const Guest = require("../../src/models/Guest");

describe("Guest Model", () => {
  beforeAll(async () => {
    await connection.sync({ force: true });
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should create a valid guest", async () => {
    const guest = await Guest.create({
      fullName: "Teste Guest",
      email: "teste@email.com",
      nationality: "Brasil",
      nationalIdNumber: "1234567890",
    });
    expect(guest.id).toBeDefined();
    expect(guest.fullName).toBe("Teste Guest");
  });

  it("should not allow duplicate email", async () => {
    await Guest.create({
      fullName: "Guest 1",
      email: "duplicado@email.com",
      nationality: "Brasil",
      nationalIdNumber: "1111111111",
    });
    await expect(
      Guest.create({
        fullName: "Guest 2",
        email: "duplicado@email.com",
        nationality: "Brasil",
        nationalIdNumber: "2222222222",
      })
    ).rejects.toThrow(/já existe/);
  });

  it("should not allow short fullName", async () => {
    await expect(
      Guest.create({
        fullName: "AB",
        email: "short@email.com",
        nationality: "Brasil",
        nationalIdNumber: "3333333333",
      })
    ).rejects.toThrow(/deve ter entre 3 e 100 caracteres/);
  });
});
