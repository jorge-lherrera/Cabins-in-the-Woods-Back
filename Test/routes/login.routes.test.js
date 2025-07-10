const request = require("supertest");
const express = require("express");
const loginRoutes = require("../../src/routes/login.routes");
const { connection } = require("../../src/database/connection");
const Worker = require("../../src/models/Worker");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use("/login", loginRoutes);

beforeAll(async () => {
  await connection.sync({ force: true });
  // Crea un usuario de prueba
  await Worker.create({
    name: "Usuário Teste",
    email: "login@email.com",
    password: await bcrypt.hash("senhaSegura123", 10),
    avatar: null,
  });
});

afterAll(async () => {
  await connection.close();
});

describe("Login API routes", () => {
  it("POST /login deve autenticar com sucesso", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "login@email.com", password: "senhaSegura123" });
    expect(res.status).toBe(200);
    expect(res.body.resource.worker.email).toBe("login@email.com");
    expect(res.body.resource.token).toBeDefined();
  });

  it("POST /login deve falhar com senha incorreta", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "login@email.com", password: "senhaErrada" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.errorCode).toBe("INVALID_PASSWORD");
  });

  it("POST /login deve falhar com email inexistente", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "naoexiste@email.com", password: "qualquer" });
    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.errorCode).toBe("USER_NOT_FOUND");
  });
});
