const loginValidation = require("../../src/validations/loginValidation");
const yup = require("yup");

describe("loginValidation schema", () => {
  it("should fail if email is missing", async () => {
    await expect(
      loginValidation.validate({ password: "12345678" })
    ).rejects.toThrow(yup.ValidationError);
  });

  it("should pass with valid data", async () => {
    const valid = {
      email: "user@example.com",
      password: "12345678",
    };
    await expect(loginValidation.validate(valid)).resolves.toBeDefined();
  });
});
