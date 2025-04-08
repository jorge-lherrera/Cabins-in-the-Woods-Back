const Worker = require("../models/Worker");
const { sign } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { loginSchema } = require("../validations/loginValidation");
const { strict } = require("assert");

class LoginController {
  async login(req, res) {
    try {
      await loginSchema.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

      const { email, password } = req.body;

      const worker = await Worker.findOne({
        where: { email: email },
      });

      if (!worker) {
        return res.status(401).json({ erro: "Email e senha inválida." });
      }

      const hashSenha = await bcrypt.compare(password, worker.password);
      if (!hashSenha) {
        return res.status(400).json({ mensagem: "Email e senha inválida." });
      }

      const payload = { sub: worker.id, name: worker.name };
      const token = sign(payload, process.env.SECRET_JWT, { expiresIn: "60m" });

      return res.status(200).json({
        worker: {
          id: worker.id,
          name: worker.name,
        },
        token: token,
      });
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ erro: "Solicitação não pôde ser atendida." });
    }
  }
}

module.exports = new LoginController();
