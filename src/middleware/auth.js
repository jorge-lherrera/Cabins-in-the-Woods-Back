const { verify } = require("jsonwebtoken");

async function auth(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Token de autenticação ausente ou inválido." });
    }

    const token = authorization.split(" ")[1];

    if (!process.env.SECRET_JWT) {
      return res
        .status(500)
        .json({
          message: "Erro interno no servidor. Chave JWT não configurada.",
        });
    }

    const payload = verify(token, process.env.SECRET_JWT);

    req.userId = payload.sub;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "A autenticação falhou, tente novamente." });
  }
}

module.exports = { auth };
