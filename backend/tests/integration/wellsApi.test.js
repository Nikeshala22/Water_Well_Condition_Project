import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { jest } from "@jest/globals";
import Well from "../../models/Well.js";

let app;
let mongoServer;

beforeAll(async () => {
  // Mock auth middleware before importing routes
  jest.unstable_mockModule("../../middleware/authMiddleware.js", () => ({
    protect: (req, res, next) => {
      req.user = { id: "admin123", role: "admin" };
      next();
    },
    authorizeRoles: () => (req, res, next) => next(),
  }));

  // Import routes AFTER mock
  const wellsRoutesModule = await import("../../routes/wellsRoutes.js");
  const wellsRoutes = wellsRoutesModule.default;

  // Setup express app
  app = express();
  app.use(express.json());
  app.use("/api/wells", wellsRoutes);

  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await Well.deleteMany({});
  await mongoose.disconnect();

  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await Well.deleteMany({});
});

describe("Wells API Integration Tests", () => {
  it("POST /api/wells should create a new well in the database", async () => {
    const newWell = {
      wellId: "WELL-005",
      name: "Integration Well",
      village: "Test Village",
      lat: 6.9271,
      lng: 79.8612,
      depth: 30,
      type: "Tube Well",
    };

    const res = await request(app).post("/api/wells").send(newWell);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.wellId).toBe("WELL-005");

    const dbWell = await Well.findOne({ wellId: "WELL-005" });
    expect(dbWell).toBeTruthy();
    expect(dbWell.depth).toBe(30);
  });

  it("GET /api/wells should retrieve active wells", async () => {
    await Well.create({
      wellId: "WELL-100",
      name: "Existing Well",
      village: "Kandy",
      depth: 50,
      type: "Open Well",
      location: { type: "Point", coordinates: [80.636, 7.29] },
    });

    const res = await request(app).get("/api/wells");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].wellId).toBe("WELL-100");
  });
});