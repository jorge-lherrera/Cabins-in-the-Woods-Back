const normalizeBookingDates = require("../../src/middleware/normalizeBookingDates");

describe("normalizeBookingDates middleware", () => {
  it("should normalize date fields in req.body", () => {
    const req = {
      body: {
        startDate: "2024-01-01T00:00:00.000Z",
        endDate: "2024-01-05T00:00:00.000Z",
      },
    };
    const res = {};
    const next = jest.fn();
    normalizeBookingDates(req, res, next);
    expect(req.body.startDate).toBe("2024-01-01");
    expect(req.body.endDate).toBe("2024-01-05");
    expect(next).toHaveBeenCalled();
  });
});
