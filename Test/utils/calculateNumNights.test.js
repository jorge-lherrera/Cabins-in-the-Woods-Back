const calculateNumNights = require("../../src/utils/calculateNumNights");

describe("calculateNumNights", () => {
  it("should return correct number of nights between two dates", () => {
    expect(calculateNumNights("2024-07-01", "2024-07-05")).toBe(4);
  });

  it("should return 0 if dates are the same", () => {
    expect(calculateNumNights("2024-07-01", "2024-07-01")).toBe(0);
  });
});
