const mongoose = require('mongoose');

const dailyProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // For now using local ID or mock, later actual user ID
  date: { type: String, required: true }, // Format: YYYY-MM-DD for easy lookup
  completedItems: [{
    itemId: String, // Reference to meal name or exercise name
    type: { type: String, enum: ['Meal', 'Exercise'] }
  }]
}, { timestamps: true });

// Ensure one progress record per user per day
dailyProgressSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyProgress', dailyProgressSchema);
