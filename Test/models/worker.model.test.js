const { DataTypes, ValidationError } = require("sequelize");
const { connection } = require("../../src/database/connection");
const Worker = require("../../src/models/Worker");

describe("Worker Model", () => {
  beforeAll(async () => {
    await connection.sync({ force: true });
  });
  afterAll(async () => {
    await connection.close();
  });

  it("should not allow password shorter than 8 chars", async () => {
    await expect(
      Worker.create({
        name: "Test User",
        email: "test@user.com",
        password: "short123",
      })
    ).rejects.toThrow(ValidationError);
  });

  it("should not allow password with emojis", async () => {
    await expect(
      Worker.create({
        name: "Test User",
        email: "test2@user.com",
        password: "senha1234😀",
      })
    ).rejects.toThrow(ValidationError);
  });

  it("should create a worker with valid data", async () => {
    const worker = await Worker.create({
      name: "Valid User",
      email: "valid@user.com",
      password: "senha1234",
    });
    expect(worker).toBeDefined();
    expect(worker.password).toBe("senha1234");
  });
});
