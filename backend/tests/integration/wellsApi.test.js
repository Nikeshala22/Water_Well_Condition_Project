import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { jest } from '@jest/globals';

// 1. Mock the auth middleware BEFORE importing routes
jest.unstable_mockModule('../../middleware/authMiddleware.js', () => ({
  protect: (req, res, next) => {
    req.user = { id: 'admin123', role: 'admin' }; // Fake admin user
    next();
  },
  authorizeRoles: (...roles) => (req, res, next) => next(),
}));

// 2. Import routes and model after mocking
const wellsRoutes = (await import('../../routes/wellsRoutes.js')).default;
import Well from '../../models/Well.js';

// 3. Setup a fake Express app just for testing
const app = express();
app.use(express.json());
app.use('/api/wells', wellsRoutes);

let mongoServer;

describe('Wells API Integration Tests', () => {
  
  // Start temporary MongoDB before tests
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  // Clean up database after tests
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Clear data between individual tests
  beforeEach(async () => {
    await Well.deleteMany({});
  });

  it('POST /api/wells should create a new well in the database', async () => {
    const newWell = {
      wellId: 'WELL-005',
      name: 'Integration Well',
      village: 'Test Village',
      lat: 6.9271,
      lng: 79.8612,
      depth: 30,
      type: 'Tube Well'
    };

    const res = await request(app).post('/api/wells').send(newWell);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.wellId).toBe('WELL-005');

    // Verify it actually saved to the fake database
    const dbWell = await Well.findOne({ wellId: 'WELL-005' });
    expect(dbWell).toBeTruthy();
    expect(dbWell.depth).toBe(30);
  });

  it('GET /api/wells should retrieve active wells', async () => {
    // Seed the database
    await Well.create({
      wellId: 'WELL-100',
      name: 'Existing Well',
      village: 'Kandy',
      depth: 50,
      type: 'Open Well',
      location: { type: 'Point', coordinates: [80.636, 7.290] }
    });

    const res = await request(app).get('/api/wells');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(res.body.data[0].wellId).toBe('WELL-100');
  });
});