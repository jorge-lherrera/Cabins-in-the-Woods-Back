const MESSAGES = require("../utils/messages");

class LogoutController {
  async logout(req, res) {
    try {
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
      return res.status(200).json({
        success: true,
        message: MESSAGES.LOGIN.LOGOUT_SUCCESS,
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.log(error.message);
      }
      return res.status(500).json({
        success: false,
        error: MESSAGES.LOGIN.LOGOUT_ERROR,
      });
    }
  }
}

module.exports = new LogoutController();
