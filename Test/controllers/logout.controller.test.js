const LogoutController = require("../../src/controllers/LogoutController");

const mockReq = () => ({});
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("LogoutController", () => {
  it("should return 200 and success message", async () => {
    const req = mockReq();
    const res = mockRes();
    await LogoutController.logout(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      resource: { message: "Logout successful." },
    });
  });
});
