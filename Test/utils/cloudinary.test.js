const cloudinary = require("../../src/utils/cloudinary");

describe("cloudinary util", () => {
  it("should have upload and delete methods", () => {
    expect(typeof cloudinary.upload).toBe("function");
    expect(typeof cloudinary.delete).toBe("function");
  });
});
