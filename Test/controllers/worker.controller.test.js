const WorkerController = require("../../src/controllers/WorkerController");
const workerService = require("../../src/services/workerService");

jest.mock("../../src/services/workerService");

const mockReq = (body = {}, params = {}, user = {}) => ({ body, params, user });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("WorkerController", () => {
  afterEach(() => jest.clearAllMocks());

  it("should return worker by id", async () => {
    workerService.getWorkerById.mockResolvedValue({
      resource: { id: 1 },
      error: null,
    });
    const req = mockReq({}, {}, { id: 1 });
    const res = mockRes();
    await WorkerController.getWorkerById(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it("should handle error from service in getWorkerById", async () => {
    const next = jest.fn();
    workerService.getWorkerById.mockResolvedValue({
      resource: null,
      error: { status: 404 },
    });
    const req = mockReq({}, {}, { id: 1 });
    const res = mockRes();
    await WorkerController.getWorkerById(req, res, next);
    expect(next).toHaveBeenCalledWith({ status: 404 });
  });
});
