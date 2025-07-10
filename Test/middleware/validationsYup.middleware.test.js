const validationsYup = require("../../src/middleware/validationsYup");
const yup = require("yup");

describe("validationsYup middleware", () => {
  it("should call next if validation passes", async () => {
    const schema = yup.object({ name: yup.string().required() });
    const req = { body: { name: "Test" } };
    const res = {};
    const next = jest.fn();
    await validationsYup(schema)(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should return 400 if validation fails", async () => {
    const schema = yup.object({ name: yup.string().required() });
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await validationsYup(schema)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: expect.objectContaining({
        resource: "Validation",
        status: 400,
        errorCode: "VALIDATION_ERROR",
      }),
    });
    expect(next).not.toHaveBeenCalled();
  });
});
