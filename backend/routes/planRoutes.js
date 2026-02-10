const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');

// Get Plan by Body Type
router.get('/:bodyType', async (req, res) => {
  try {
    const { bodyType } = req.params;
    // Case insensitive match
    const plan = await Plan.findOne({ 
      bodyType: { $regex: new RegExp(`^${bodyType}$`, 'i') } 
    });
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found for this body type' });
    }
    
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
