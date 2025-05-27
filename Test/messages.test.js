const MESSAGES = require("../src/utils/messages");

describe("MESSAGES util", () => {
  it("deve retornar mensagem de sucesso de criação", () => {
    expect(MESSAGES.GENERAL.CREATE_SUCCESS("Reserva")).toBe(
      "Reserva criado com sucesso."
    );
  });

  it("deve retornar mensagem de não encontrado", () => {
    expect(MESSAGES.GENERAL.NOT_FOUND("Reserva")).toBe(
      "Reserva não encontrado."
    );
  });
});
