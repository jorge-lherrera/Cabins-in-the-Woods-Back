const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connection } = require("./database/connection");
const routes = require("./routes/routes");
const errorHandler = require("./middleware/errorHandler");
const PORT_API = process.env.PORT_API;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

class Server {
  constructor(server = express()) {
    this.middlewares(server);
    server.use(routes);
    this.errorMiddleware(server);
    this.database();
    this.initializeServer(server);
  }

  async middlewares(app) {
    app.use(
      cors({
        origin: CORS_ORIGIN,
        credentials: true,
      })
    );
    app.use(express.json());
    app.use(cookieParser());
  }

  errorMiddleware(app) {
    app.use(errorHandler);
  }

  async database() {
    try {
      await connection.authenticate();
      console.log(
        "Conexão com o banco de dados PostgreSQL foi estabelecida com sucesso."
      );
    } catch (error) {
      console.error("Não foi possível conectar o banco de dados", error);
      throw error;
    }
  }

  async initializeServer(app) {
    app.listen(PORT_API, () =>
      console.log(`Servidor executando na porta ${PORT_API}`)
    );
  }
}

module.exports = { Server };
