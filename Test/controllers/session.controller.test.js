const SessionController = require("../../src/controllers/SessionController");
const workerService = require("../../src/services/workerService");

jest.mock("../../src/services/workerService");

const mockReq = (user = {}) => ({ user });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("SessionController", () => {
  afterEach(() => jest.clearAllMocks());

  it("should return 401 if user is not authenticated", async () => {
    const req = mockReq();
    const res = mockRes();
    await SessionController.getSession(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        resource: "Session",
        error: "User not authenticated.",
        status: 401,
        errorCode: "SESSION_UNAUTHORIZED",
      },
    });
  });

  it("should return user session if authenticated", async () => {
    const user = { id: 1, name: "Test User" };
    workerService.findById.mockResolvedValue(user);
    const req = mockReq(user);
    const res = mockRes();
    await SessionController.getSession(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ resource: user });
  });
});
