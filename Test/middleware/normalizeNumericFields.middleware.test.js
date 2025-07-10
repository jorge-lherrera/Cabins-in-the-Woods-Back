const normalizeNumericFields = require("../../src/middleware/normalizeNumericFields");

describe("normalizeNumericFields middleware", () => {
  it("should convert numeric fields to numbers", () => {
    const req = { body: { price: "100", guests: "2" } };
    const res = {};
    const next = jest.fn();
    normalizeNumericFields(req, res, next);
    expect(req.body.price).toBe(100);
    expect(req.body.guests).toBe(2);
    expect(next).toHaveBeenCalled();
  });
});
