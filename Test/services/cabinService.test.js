const cabinService = require("../../src/services/cabinService");
const { connection } = require("../../src/database/connection");
const Cabin = require("../../src/models/Cabin");

describe("cabinService", () => {
  beforeAll(async () => {
    await connection.sync({ force: true });
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should create a new cabin", async () => {
    const result = await cabinService.createCabin({
      name: "Cabana Serviço",
      maxCapacity: 3,
      regularPrice: 150.0,
      discount: 5.0,
      description: "Cabana de serviço para teste.",
    });
    expect(result.resource).toBeDefined();
    expect(result.error).toBeNull();
    expect(result.resource.name).toBe("Cabana Serviço");
  });

  it("should not create a cabin with duplicate name", async () => {
    await cabinService.createCabin({
      name: "Cabana Duplicada",
      maxCapacity: 2,
      regularPrice: 100.0,
    });
    const result = await cabinService.createCabin({
      name: "Cabana Duplicada",
      maxCapacity: 2,
      regularPrice: 100.0,
    });
    expect(result.error).toBeDefined();
    expect(result.error.errorCode).toBe("CABIN_ALREADY_EXISTS");
  });

  it("should return error if cabin not found", async () => {
    const result = await cabinService.getCabinById(9999);
    expect(result.error).toBeDefined();
    expect(result.error.errorCode).toBe("CABIN_NOT_FOUND");
  });
});
