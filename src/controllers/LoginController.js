const Worker = require("../models/Worker");
const { sign } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const MESSAGES = require("../utils/messages");
const successResponse = require("../utils/successResponse");

class LoginController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const worker = await Worker.findOne({
        where: { email: email },
      });

      if (!worker) {
        return res.status(401).json({
          resource: null,
          error: MESSAGES.GENERAL.NOT_FOUND("Funcionário"),
          status: 401,
        });
      }

      const isPasswordCorrect = await bcrypt.compare(password, worker.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          resource: null,
          error: MESSAGES.INVALID("Senha ou email"),
          status: 401,
        });
      }

      const payload = { sub: worker.id, name: worker.name };
      const token = sign(payload, process.env.SECRET_JWT, { expiresIn: "60m" });

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      return successResponse(res, 200, MESSAGES.LOGIN.LOGIN_SUCCESS, {
        worker: {
          id: worker.id,
          name: worker.name,
        },
        token: token,
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.log(error.message);
      }
      next(error);
    }
  }
}

module.exports = new LoginController();
