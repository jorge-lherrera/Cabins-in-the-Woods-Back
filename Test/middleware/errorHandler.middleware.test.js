const errorHandler = require("../../src/middleware/errorHandler");

describe("errorHandler middleware", () => {
  it("should return error response with correct structure", () => {
    const err = {
      resource: "Test",
      error: "Test error",
      status: 400,
      errorCode: "TEST_ERROR",
    };
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: err });
  });
});
