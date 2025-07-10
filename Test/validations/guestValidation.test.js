const guestValidation = require("../../src/validations/guestValidation");
const yup = require("yup");

describe("guestValidation schema", () => {
  it("should fail if name is missing", async () => {
    await expect(guestValidation.validate({})).rejects.toThrow(
      yup.ValidationError
    );
  });

  it("should pass with valid data", async () => {
    const valid = {
      name: "Guest 1",
      email: "guest@example.com",
      nationality: "BR",
      nationalId: "12345678900",
    };
    await expect(guestValidation.validate(valid)).resolves.toBeDefined();
  });
});
