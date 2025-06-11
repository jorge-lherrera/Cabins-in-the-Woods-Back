const MESSAGES = require("../utils/messages");
const successResponse = require("../utils/successResponse");

class LogoutController {
  async logout(req, res, next) {
    try {
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
      return successResponse(res, 200, MESSAGES.LOGIN.LOGOUT_SUCCESS, null);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LogoutController();
