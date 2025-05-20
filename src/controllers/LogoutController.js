class LogoutController {
  async logout(req, res) {
    try {
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
      return res.status(200).json({ message: "Logout realizado com sucesso!" });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.log(error.message);
      }
      return res.status(500).json({ erro: "Erro ao fazer logout." });
    }
  }
}

module.exports = new LogoutController();
