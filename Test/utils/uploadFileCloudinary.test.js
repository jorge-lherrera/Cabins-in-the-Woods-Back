const uploadFileCloudinary = require("../../src/utils/uploadFileCloudinary");

describe("uploadFileCloudinary util", () => {
  it("should be a function", () => {
    expect(typeof uploadFileCloudinary).toBe("function");
  });
});
