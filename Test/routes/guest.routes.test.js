const request = require("supertest");
const express = require("express");
const guestRoutes = require("../../src/routes/guest.routes");
const { connection } = require("../../src/database/connection");

const app = express();
app.use(express.json());
app.use("/guests", guestRoutes);

beforeAll(async () => {
  await connection.sync({ force: true });
});
afterAll(async () => {
  await connection.close();
});

describe("Guest API routes", () => {
  it("GET /guests should return empty list initially", async () => {
    const res = await request(app)
      .get("/guests")
      .set("Authorization", "Bearer testtoken");
    expect(res.status).toBe(200);
    expect(res.body.resource.guests).toBeDefined();
  });

  it("POST /guests should create a new guest", async () => {
    const res = await request(app)
      .post("/guests")
      .set("Authorization", "Bearer testtoken")
      .send({
        fullName: "Guest API",
        email: "api@email.com",
        nationality: "Brasil",
        nationalIdNumber: "5555555555",
      });
    expect(res.status).toBe(201);
    expect(res.body.resource.fullName).toBe("Guest API");
  });
});
