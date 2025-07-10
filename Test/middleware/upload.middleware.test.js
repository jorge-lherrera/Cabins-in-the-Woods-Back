const upload = require("../../src/middleware/upload");

describe("upload middleware", () => {
  it("should be defined as a multer instance", () => {
    expect(upload).toBeDefined();
    expect(typeof upload.single).toBe("function");
  });
});
