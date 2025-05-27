const validationsYup = require("../src/middleware/validationsYup");
const Yup = require("yup");

describe("validationsYup middleware", () => {
  const schema = Yup.object().shape({
    name: Yup.string().required("Nome obrigatório"),
  });

  it("deve chamar next() se os dados forem válidos", async () => {
    const req = { body: { name: "Teste" } };
    const res = {};
    const next = jest.fn();
    await validationsYup(schema)(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("deve retornar erro 400 se os dados forem inválidos", async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await validationsYup(schema)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.any(String),
        detalhes: expect.any(Array),
      })
    );
  });
});
