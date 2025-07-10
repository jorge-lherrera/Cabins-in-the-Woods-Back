const GuestController = require("../../src/controllers/GuestController");
const guestService = require("../../src/services/guestService");

jest.mock("../../src/services/guestService");

const mockReq = (query = {}, body = {}, params = {}, user = {}) => ({
  query,
  body,
  params,
  user,
});
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("GuestController", () => {
  afterEach(() => jest.clearAllMocks());

  it("should return all guests", async () => {
    guestService.getAllGuests.mockResolvedValue({
      resource: [{ id: 1 }],
      error: null,
    });
    const req = mockReq({});
    const res = mockRes();
    await GuestController.getAllGuests(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("should handle error from service in getAllGuests", async () => {
    const next = jest.fn();
    guestService.getAllGuests.mockResolvedValue({
      resource: null,
      error: { status: 500 },
    });
    const req = mockReq({});
    const res = mockRes();
    await GuestController.getAllGuests(req, res, next);
    expect(next).toHaveBeenCalledWith({ status: 500 });
  });
});
