import express from 'express';
import { 
    addTestResult, 
    getWellHistory, 
    updateTestResult, 
    deleteTestResult 
} from '../controllers/waterQualityController.js';

const router = express.Router();

// Defined routes for Water Quality Monitoring
router.post('/', addTestResult);
router.get('/well/:wellId', getWellHistory);
router.put('/:id', updateTestResult);
router.delete('/:id', deleteTestResult);

export default router;

