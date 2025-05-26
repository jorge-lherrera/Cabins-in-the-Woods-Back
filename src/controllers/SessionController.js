const Worker = require("../models/Worker");
const MESSAGES = require("../utils/messages");

class SessionController {
  async getSession(req, res, next) {
    try {
      const worker = await Worker.findByPk(req.user.id);
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
      return res.status(401).json({ success: false, loggedIn: false });
    }
  }
}

module.exports = new SessionController();
