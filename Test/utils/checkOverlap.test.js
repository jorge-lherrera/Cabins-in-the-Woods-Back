const checkOverlap = require("../../src/utils/checkOverlap");

describe("checkOverlap", () => {
  it("should return true if ranges overlap", () => {
    expect(
      checkOverlap("2024-07-01", "2024-07-05", "2024-07-03", "2024-07-07")
    ).toBe(true);
  });

  it("should return false if ranges do not overlap", () => {
    expect(
      checkOverlap("2024-07-01", "2024-07-05", "2024-07-06", "2024-07-10")
    ).toBe(false);
  });
});
