const bookingValidation = require("../../src/validations/bookingValidation");

describe("Validação de bookingValidation (Yup)", () => {
  it("deve aceitar dados válidos", async () => {
    const validData = {
      cabinId: 1,
      guestId: 2,
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-06-05"),
      numNights: 4,
      numGuests: 2,
      cabinPrice: 500,
      extrasPrice: 100,
      totalPrice: 600,
      hasBreakfast: true,
      observations: "Sem observações",
      isPaid: false,
    };
    await expect(bookingValidation.validate(validData)).resolves.toBeTruthy();
  });

  it("deve rejeitar se faltar campos obrigatórios", async () => {
    const invalidData = {};
    try {
      await bookingValidation.validate(invalidData, { abortEarly: false });
    } catch (err) {
      expect(Array.isArray(err.errors)).toBe(true);
      expect(
        err.errors.some((msg) => msg.includes("A data de início é obrigatória"))
      ).toBe(true);
    }
  });

  it("deve rejeitar se endDate for antes de startDate", async () => {
    const invalidData = {
      cabinId: 1,
      guestId: 2,
      startDate: new Date("2025-06-05"),
      endDate: new Date("2025-06-01"),
      numNights: 4,
      numGuests: 2,
      cabinPrice: 500,
      extrasPrice: 100,
      totalPrice: 600,
      hasBreakfast: true,
      observations: "Sem observações",
      isPaid: false,
    };
    await expect(bookingValidation.validate(invalidData)).rejects.toThrow(
      "A data de término deve ser posterior à data de início"
    );
  });

  it("deve rejeitar campos adicionais não permitidos", async () => {
    const invalidData = {
      cabinId: 1,
      guestId: 2,
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-06-05"),
      numNights: 4,
      numGuests: 2,
      cabinPrice: 500,
      extrasPrice: 100,
      totalPrice: 600,
      hasBreakfast: true,
      observations: "Sem observações",
      isPaid: false,
      campoExtra: "não permitido",
    };
    await expect(bookingValidation.validate(invalidData)).rejects.toThrow(
      "Os campos adicionais não são permitidos. Por favor, verifique os campos."
    );
  });
});
