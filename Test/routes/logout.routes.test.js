const request = require("supertest");
const express = require("express");
const logoutRoutes = require("../../src/routes/logout.routes");

const app = express();
app.use(express.json());
app.use("/logout", logoutRoutes);

describe("Logout API routes", () => {
  it("POST /logout should return 200 and success message", async () => {
    const res = await request(app).post("/logout");
    expect(res.status).toBe(200);
    expect(res.body.resource).toBeDefined();
  });
});
