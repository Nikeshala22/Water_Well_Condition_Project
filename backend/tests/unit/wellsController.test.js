import { jest } from '@jest/globals';
import { getAllWells } from '../../controllers/wellsController.js';
import Well from '../../models/Well.js';

describe('Wells Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    // Setup fake request and response objects before each test
    req = { body: {}, query: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Clear all spies/mocks between tests so they don't leak
    jest.restoreAllMocks(); 
  });

  describe('getAllWells', () => {
    it('should return 200 and a list of wells', async () => {
      // 1. Setup mock database response using spyOn
      const mockWells = [{ wellId: 'WELL-001', name: 'Test Well' }];
      
      // Instead of mocking the whole file, we SPY on the 'find' method 
      // and force it to return our fake data!
      jest.spyOn(Well, 'find').mockResolvedValue(mockWells);

      // 2. Execute function
      await getAllWells(req, res);

      // 3. Assertions
      expect(Well.find).toHaveBeenCalledWith({ isArchived: false });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 1,
        data: mockWells,
      });
    });

    it('should handle database errors gracefully', async () => {
      // Force the database to throw an error
      jest.spyOn(Well, 'find').mockRejectedValue(new Error('Database failed'));

      await getAllWells(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database failed' });
    });
  });
});