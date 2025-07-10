const request = require("supertest");
const express = require("express");
const settingRoutes = require("../../src/routes/setting.routes");
const { connection } = require("../../src/database/connection");

const app = express();
app.use(express.json());
app.use("/settings", settingRoutes);

beforeAll(async () => {
  await connection.sync({ force: true });
});
afterAll(async () => {
  await connection.close();
});

describe("Setting API routes", () => {
  it("GET /settings should return 404 if not exists", async () => {
    const res = await request(app)
      .get("/settings")
      .set("Authorization", "Bearer testtoken");
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
    expect(res.body.error.errorCode).toBe("SETTING_NOT_FOUND");
  });

  it("POST /settings should create a new setting", async () => {
    const res = await request(app)
      .post("/settings")
      .set("Authorization", "Bearer testtoken")
      .send({
        minBookingLength: 2,
        maxBookingLength: 10,
        maxGuestsPerBooking: 5,
        breakfastPrice: 20.0,
      });
    expect(res.status).toBe(201);
    expect(res.body.resource.minBookingLength).toBe(2);
  });
});
