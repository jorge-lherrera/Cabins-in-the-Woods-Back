const cabinValidation = require("../../src/validations/cabinValidation");
const yup = require("yup");

describe("cabinValidation schema", () => {
  it("should fail if name is missing", async () => {
    await expect(cabinValidation.validate({})).rejects.toThrow(
      yup.ValidationError
    );
  });

  it("should pass with valid data", async () => {
    const valid = {
      name: "Cabin 1",
      maxCapacity: 4,
      regularPrice: 100,
      discount: 10,
      description: "Nice cabin",
      image: "http://example.com/image.jpg",
    };
    await expect(cabinValidation.validate(valid)).resolves.toBeDefined();
  });
});
