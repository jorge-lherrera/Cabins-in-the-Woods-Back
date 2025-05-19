const Worker = require("../models/Worker");
const { verify } = require("jsonwebtoken");

class SessionController {
  async getSession(req, res, next) {
    try {
      const token = req.cookies.authToken;

      if (!token) {
        return res.status(401).json({ loggedIn: false });
      }

      const decoded = verify(token, process.env.SECRET_JWT);
      const worker = await Worker.findByPk(decoded.sub);

      if (!worker || !worker.status) {
        return res.status(401).json({ loggedIn: false });
      }

      return res.status(200).json({
        loggedIn: true,
        user: { id: worker.id, name: worker.name },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SessionController();
