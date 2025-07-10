const successResponse = require("../../src/utils/successResponse");

describe("successResponse", () => {
  it("deve retornar resposta com sucesso e mensagem", () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    successResponse(res, 200, "Mensagem de sucesso");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Mensagem de sucesso",
    });
  });

  it("deve incluir dados adicionais se fornecidos", () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    successResponse(res, 201, "Criado", { id: 1 }, "booking");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Criado",
      booking: { id: 1 },
    });
  });
});
