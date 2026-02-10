const express = require('express');
const router = express.Router();
const DailyProgress = require('../models/DailyProgress');
const auth = require('../middleware/auth');

// Get progress history for a user (last N days)
router.get('/history/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const days = parseInt(req.query.days) || 30;
    
    // Calculate the date range
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);
    
    const formattedStart = startDate.toISOString().split('T')[0];
    
    // Find all progress records for this user within the range
    const history = await DailyProgress.find({
      userId,
      date: { $gte: formattedStart }
    }).sort({ date: 1 });
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get progress for a specific date
router.get('/:userId/:date', auth, async (req, res) => {
  try {
    const { userId, date } = req.params;
    let progress = await DailyProgress.findOne({ userId, date });
    
    if (!progress) {
      // Return empty if no entry exists yet
      return res.json({ completedItems: [] });
    }
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle completion of an item
router.post('/toggle', auth, async (req, res) => {
  try {
    const { userId, date, itemId, type } = req.body;
    
    // Ensure user is only updating their own progress
    if (req.user.id !== userId && userId !== 'guest_user') {
      return res.status(401).json({ message: 'User not authorized to update this progress' });
    }
    
    let progress = await DailyProgress.findOne({ userId, date });
    
    if (!progress) {
      progress = new DailyProgress({ userId, date, completedItems: [] });
    }
    
    const existingIndex = progress.completedItems.findIndex(item => item.itemId === itemId);
    
    if (existingIndex > -1) {
      // Remove if exists (uncheck)
      progress.completedItems.splice(existingIndex, 1);
    } else {
      // Add if not exists (check)
      progress.completedItems.push({ itemId, type });
    }
    
    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
