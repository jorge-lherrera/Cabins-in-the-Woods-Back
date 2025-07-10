const request = require("supertest");
const express = require("express");
const cabinRoutes = require("../../src/routes/cabin.routes");
const { connection } = require("../../src/database/connection");

const app = express();
app.use(express.json());
app.use("/cabins", cabinRoutes);

beforeAll(async () => {
  await connection.sync({ force: true });
});
afterAll(async () => {
  await connection.close();
});

describe("Cabin API routes", () => {
  it("GET /cabins should return empty list initially", async () => {
    const res = await request(app).get("/cabins").set("Authorization", "Bearer testtoken");
    expect(res.status).toBe(200);
    expect(res.body.resource.cabins).toBeDefined();
  });

  it("POST /cabins should create a new cabin", async () => {
    const res = await request(app)
      .post("/cabins")
      .set("Authorization", "Bearer testtoken")
      .send({
        name: "Cabana API",
        maxCapacity: 5,
        regularPrice: 300.0,
        discount: 20.0,
        description: "Cabana criada pela API.",
      });
    expect(res.status).toBe(201);
    expect(res.body.resource.name).toBe("Cabana API");
  });
});
