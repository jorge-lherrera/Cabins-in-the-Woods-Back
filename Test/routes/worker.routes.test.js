const request = require("supertest");
const express = require("express");
const workerRoutes = require("../../src/routes/worker.routes");

const app = express();
app.use(express.json());
app.use("/workers", workerRoutes);

describe("Worker API routes", () => {
  it("GET /workers should return 401 if not authenticated", async () => {
    const res = await request(app).get("/workers");
    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });
});
