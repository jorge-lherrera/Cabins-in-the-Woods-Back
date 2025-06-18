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
        return next({
          status: 401,
          errorCode: "USER_NOT_FOUND",
          message: MESSAGES.GENERAL.NOT_FOUND("Funcionário"),
          source: "auth - login",
          detalhes: MESSAGES.LOGIN.AUTHENTICATION_FAILED,
        });
      }

      const isPasswordCorrect = await bcrypt.compare(password, worker.password);
      if (!isPasswordCorrect) {
        return next({
          status: 401,
          errorCode: "INVALID_PASSWORD",
          message: MESSAGES.GENERAL.INVALID("Senha"),
          source: "auth - login",
          detalhes: MESSAGES.LOGIN.AUTHENTICATION_FAILED,
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
          avatar: worker.avatar,
          email: worker.email,
        },
        token: token,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LoginController();
