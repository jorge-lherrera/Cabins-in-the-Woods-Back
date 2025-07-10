const request = require("supertest");
const express = require("express");
const sessionRoute = require("../../src/routes/session.route");

const app = express();
app.use(express.json());
app.use("/session", sessionRoute);

describe("Session API routes", () => {
  it("GET /session should return 401 if not authenticated", async () => {
    const res = await request(app).get("/session");
    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });
});
