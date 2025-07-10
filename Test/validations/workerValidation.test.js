const workerValidation = require("../../src/validations/workerValidation");
const yup = require("yup");

describe("workerValidation schema", () => {
  it("should fail if name is missing", async () => {
    await expect(
      workerValidation.validate({
        email: "worker@example.com",
        password: "12345678",
      })
    ).rejects.toThrow(yup.ValidationError);
  });

  it("should pass with valid data", async () => {
    const valid = {
      name: "Worker 1",
      email: "worker@example.com",
      password: "12345678",
    };
    await expect(workerValidation.validate(valid)).resolves.toBeDefined();
  });
});
