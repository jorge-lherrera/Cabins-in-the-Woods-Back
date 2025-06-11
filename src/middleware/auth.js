const { verify } = require("jsonwebtoken");
const MESSAGES = require("../utils/messages");

async function auth(req, res, next) {
  try {
    let token = null;
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith("Bearer ")) {
      token = authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.authToken) {
      token = req.cookies.authToken;
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: MESSAGES.AUTH("ausente ou inválido") });
    }

    if (!process.env.SECRET_JWT) {
      return res.status(500).json({
        message: { message: MESSAGES.AUTH.JWT_NOT_CONFIGURED },
      });
    }

    const payload = verify(token, process.env.SECRET_JWT);

    if (!payload.sub) {
      return res.status(401).json({
        error: MESSAGES.AUTH("inválido"),
      });
    }

    req.user = { id: payload.sub, name: payload.name };

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: MESSAGES.LOGIN.AUTHENTICATION_FAILED });
  }
}

module.exports = auth;
