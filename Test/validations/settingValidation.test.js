const settingValidation = require("../../src/validations/settingValidation");
const yup = require("yup");

describe("settingValidation schema", () => {
  it("should fail if minBookingLength is missing", async () => {
    await expect(settingValidation.validate({})).rejects.toThrow(
      yup.ValidationError
    );
  });

  it("should pass with valid data", async () => {
    const valid = {
      minBookingLength: 2,
      maxBookingLength: 10,
      maxGuestsPerBooking: 5,
      breakfastPrice: 20.0,
    };
    await expect(settingValidation.validate(valid)).resolves.toBeDefined();
  });
});
