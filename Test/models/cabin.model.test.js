const { connection } = require("../../src/database/connection");
const Cabin = require("../../src/models/Cabin");

describe("Cabin Model", () => {
  beforeAll(async () => {
    await connection.sync({ force: true });
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should create a valid cabin", async () => {
    const cabin = await Cabin.create({
      name: "Cabana Teste",
      maxCapacity: 4,
      regularPrice: 200.0,
      discount: 10.0,
      image: "https://example.com/cabana.jpg",
      description: "Cabana confortável para família.",
    });
    expect(cabin.id).toBeDefined();
    expect(cabin.name).toBe("Cabana Teste");
  });

  it("should not allow negative regularPrice", async () => {
    await expect(
      Cabin.create({
        name: "Cabana Preço Negativo",
        maxCapacity: 2,
        regularPrice: -100.0,
      })
    ).rejects.toThrow(/não pode ser negativo/);
  });

  it("should not allow discount greater than regularPrice", async () => {
    await expect(
      Cabin.create({
        name: "Cabana Desconto Inválido",
        maxCapacity: 2,
        regularPrice: 100.0,
        discount: 200.0,
      })
    ).rejects.toThrow(/não pode ser maior que o preço regular/);
  });

  it("should not allow name shorter than 3 characters", async () => {
    await expect(
      Cabin.create({
        name: "AB",
        maxCapacity: 2,
        regularPrice: 100.0,
      })
    ).rejects.toThrow(/deve ter entre 3 e 100 caracteres/);
  });
});
