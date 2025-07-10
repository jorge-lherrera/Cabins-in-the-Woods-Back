const BookingController = require("../../src/controllers/BookingController");
const bookingService = require("../../src/services/bookingService");

jest.mock("../../src/services/bookingService");

const mockReq = (query = {}, body = {}, params = {}, user = {}) => ({ query, body, params, user });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("BookingController", () => {
  afterEach(() => jest.clearAllMocks());

  it("should return bookings dashboard", async () => {
    bookingService.getAllBookingsDashboard.mockResolvedValue({ resource: [{ id: 1 }], error: null });
    const req = mockReq({ days: 7 });
    const res = mockRes();
    await BookingController.getAllBookingsDashboard(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("should handle error from service in getAllBookingsDashboard", async () => {
    const next = jest.fn();
    bookingService.getAllBookingsDashboard.mockResolvedValue({ resource: null, error: { status: 500 } });
    const req = mockReq({ days: 7 });
    const res = mockRes();
    await BookingController.getAllBookingsDashboard(req, res, next);
    expect(next).toHaveBeenCalledWith({ status: 500 });
  });
});
