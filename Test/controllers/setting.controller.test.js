const SettingController = require("../../src/controllers/SettingController");
const settingService = require("../../src/services/settingService");

jest.mock("../../src/services/settingService");

const mockReq = (body = {}, params = {}, user = {}) => ({ body, params, user });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("SettingController", () => {
  afterEach(() => jest.clearAllMocks());

  it("should return 404 if no setting found", async () => {
    settingService.getSetting.mockResolvedValue(null);
    const req = mockReq();
    const res = mockRes();
    await SettingController.getSetting(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        resource: "Setting",
        error: "Setting not found.",
        status: 404,
        errorCode: "SETTING_NOT_FOUND",
      },
    });
  });

  it("should return setting if found", async () => {
    const setting = { minBookingLength: 2 };
    settingService.getSetting.mockResolvedValue(setting);
    const req = mockReq();
    const res = mockRes();
    await SettingController.getSetting(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ resource: setting });
  });
});
