const validateBusinessRules = require("../../src/utils/validateBusinessRules");

describe("validateBusinessRules", () => {
  it("should return true if all rules pass", () => {
    const rules = [() => true, () => true];
    expect(validateBusinessRules(rules)).toBe(true);
  });

  it("should return false if any rule fails", () => {
    const rules = [() => true, () => false];
    expect(validateBusinessRules(rules)).toBe(false);
  });
});
