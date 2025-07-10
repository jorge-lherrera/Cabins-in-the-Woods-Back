const { isValidCPF } = require("../../src/utils/yupUtils");

describe("yupUtils", () => {
  it("should validate a correct CPF", () => {
    expect(isValidCPF("52998224725")).toBe(true);
  });

  it("should invalidate an incorrect CPF", () => {
    expect(isValidCPF("12345678900")).toBe(false);
  });
});
