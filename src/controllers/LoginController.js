const Worker = require("../models/Worker");
const { sign } = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class LoginController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const worker = await Worker.findOne({
        where: { email: email },
      });

      if (!worker) {
        return res
          .status(401)
          .json({ erro: "Usuário não encontrado ou senha inválida." });
      }

      const hashSenha = await bcrypt.compare(password, worker.password);
      if (!hashSenha) {
        return res
          .status(401)
          .json({ erro: "Usuário não encontrado ou senha inválida." });
      }

      const payload = { sub: worker.id, name: worker.name };
      const token = sign(payload, process.env.SECRET_JWT, { expiresIn: "60m" });

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      return res.status(200).json({
        worker: {
          id: worker.id,
          name: worker.name,
        },
        token: token,
        message: "Login realizado com sucesso. Token armazenado no cookie.",
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.log(error.message);
      }
      return res.status(500).json({ erro: "Erro interno no servidor." });
    }
  }
}

module.exports = new LoginController();
