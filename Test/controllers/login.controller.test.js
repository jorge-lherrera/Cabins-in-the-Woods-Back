const LoginController = require("../../src/controllers/LoginController");
const Worker = require("../../src/models/Worker");
const bcrypt = require("bcrypt");

jest.mock("../../src/models/Worker");
jest.mock("bcrypt");

const mockReq = (body = {}) => ({ body });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("LoginController", () => {
  afterEach(() => jest.clearAllMocks());

  it("should return 401 if user not found", async () => {
    Worker.findOne.mockResolvedValue(null);
    const req = mockReq({ email: "test@test.com", password: "1234" });
    const res = mockRes();
    const next = jest.fn();
    await LoginController.login(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(200);
  });

  it("should return 401 if password is invalid", async () => {
    Worker.findOne.mockResolvedValue({ password: "hashed" });
    bcrypt.compare.mockResolvedValue(false);
    const req = mockReq({ email: "test@test.com", password: "wrong" });
    const res = mockRes();
    const next = jest.fn();
    await LoginController.login(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalledWith(200);
  });
});
