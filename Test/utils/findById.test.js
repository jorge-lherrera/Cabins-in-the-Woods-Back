const findById = require("../../src/utils/findById");

describe("findById util", () => {
  it("deve retornar null se id não for número", async () => {
    const result = await findById({ findByPk: jest.fn() }, "abc");
    expect(result).toBeNull();
  });

  it("deve chamar findByPk com id correto", async () => {
    const mockModel = { findByPk: jest.fn().mockResolvedValue({ id: 1 }) };
    const result = await findById(mockModel, 1);
    expect(mockModel.findByPk).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1 });
  });
});
