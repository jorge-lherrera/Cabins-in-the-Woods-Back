const auth = require("../../src/middleware/auth");

describe("auth middleware", () => {
  it("should return 401 if no token provided", () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        resource: "Auth",
        error: "No token provided.",
        status: 401,
        errorCode: "AUTH_NO_TOKEN",
      },
    });
    expect(next).not.toHaveBeenCalled();
  });
});
