const noEmojis = require("../../src/utils/noEmojis");

describe("noEmojis", () => {
  it("should remove emojis from a string", () => {
    expect(noEmojis("Olá 👋 Mundo 🌎!")).toBe("Olá  Mundo !");
  });

  it("should return the same string if no emojis", () => {
    expect(noEmojis("Sem emojis aqui")).toBe("Sem emojis aqui");
  });
});
