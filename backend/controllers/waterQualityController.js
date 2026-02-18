import WaterQuality from '../models/WaterQuality.js';

// 1. Requirement: Record Test Result 
export const addTestResult = async (req, res) => {
    try {
        const { phLevel, bacteriaCount, turbidity, temperature } = req.body;
        
        // Safety Logic 
        let status = 'Safe';
        if (phLevel < 6.5 || phLevel > 8.5 || bacteriaCount > 0 || turbidity > 5.0 || temperature > 35) {
            status = 'Unsafe';
        } else if (phLevel < 6.8 || phLevel > 8.2 || turbidity > 4.0 || temperature > 30) {
            status = 'Warning';
        }

        const newTest = new WaterQuality({ ...req.body, status });
        const savedTest = await newTest.save();
        res.status(201).json(savedTest);
    } catch (err) {
        res.status(400).json({ message: "Validation Error", error: err.message });
    }
};

// 2. Get History for a Specific Well
export const getWellHistory = async (req, res) => {
    try {
        const history = await WaterQuality.find({ wellId: req.params.wellId }).sort({ testDate: -1 });
        res.status(200).json(history);
    } catch (err) {
        res.status(500).json({ message: "Fetch Error", error: err.message });
    }
};

// 3. Update a Test Result
export const updateTestResult = async (req, res) => {
    try {
        const updated = await WaterQuality.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ message: "Update Error", error: err.message });
    }
};

export const deleteTestResult = async (req, res) => {
    try {
        await WaterQuality.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Record deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed", error: err.message });
    }
};