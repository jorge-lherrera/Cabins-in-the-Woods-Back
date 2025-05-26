const { verify } = require("jsonwebtoken");
const Worker = require("../models/Worker");
const MESSAGES = require("../utils/messages");

class SessionController {
  async getSession(req, res, next) {
    try {
      const token = req.cookies?.authToken || null;
      if (!token) {
        return res.status(401).json({ success: false, loggedIn: false });
      }

      const decoded = verify(token, process.env.SECRET_JWT);
      const worker = await Worker.findByPk(decoded.sub);
      if (!worker) {
        return res.status(401).json({
          success: false,
          message: MESSAGES.GENERAL.NOT_FOUND("Usuário"),
          loggedIn: false,
        });
      }

      return res.status(200).json({
        success: true,
        loggedIn: true,
        user: { id: worker.id, name: worker.name },
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.log(error.message);
      }
      return res.status(401).json({ success: false, loggedIn: false });
    }
  }
}

module.exports = new SessionController();
