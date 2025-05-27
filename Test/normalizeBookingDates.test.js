const normalizeBookingDates = require("../src/middleware/normalizeBookingDates");

describe("normalizeBookingDates middleware", () => {
  it("deve converter startDate e endDate para Date se forem string", () => {
    const req = {
      body: {
        startDate: "2025-06-01",
        endDate: "2025-06-05",
      },
    };
    const next = jest.fn();
    normalizeBookingDates(req, {}, next);
    expect(req.body.startDate instanceof Date).toBe(true);
    expect(req.body.endDate instanceof Date).toBe(true);
    expect(next).toHaveBeenCalled();
  });

  it("não deve modificar se já forem Date", () => {
    const req = {
      body: {
        startDate: new Date("2025-06-01"),
        endDate: new Date("2025-06-05"),
      },
    };
    const next = jest.fn();
    normalizeBookingDates(req, {}, next);
    expect(req.body.startDate instanceof Date).toBe(true);
    expect(req.body.endDate instanceof Date).toBe(true);
    expect(next).toHaveBeenCalled();
  });
});
