const updatedFields = require("../../src/utils/updatedFields");

describe("updatedFields", () => {
  it("should return only updated fields", () => {
    const oldData = { a: 1, b: 2, c: 3 };
    const newData = { a: 1, b: 5, c: 3 };
    expect(updatedFields(oldData, newData)).toEqual({ b: 5 });
  });

  it("should return empty object if nothing changed", () => {
    const oldData = { a: 1 };
    const newData = { a: 1 };
    expect(updatedFields(oldData, newData)).toEqual({});
  });
});
