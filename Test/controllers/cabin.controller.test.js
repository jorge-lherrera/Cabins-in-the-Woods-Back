const CabinController = require("../../src/controllers/CabinController");
const cabinService = require("../../src/services/cabinService");

jest.mock("../../src/services/cabinService");

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

describe("CabinController", () => {
  afterEach(() => jest.clearAllMocks());

  it("should return all cabins", async () => {
    cabinService.getAllCabins.mockResolvedValue({
      resource: [{ id: 1 }],
      error: null,
    });
    const req = mockReq({});
    const res = mockRes();
    await CabinController.getAllCabins(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("should handle error from service in getAllCabins", async () => {
    const next = jest.fn();
    cabinService.getAllCabins.mockResolvedValue({
      resource: null,
      error: { status: 500 },
    });
    const req = mockReq({});
    const res = mockRes();
    await CabinController.getAllCabins(req, res, next);
    expect(next).toHaveBeenCalledWith({ status: 500 });
  });
});
