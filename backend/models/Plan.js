const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  bodyType: { type: String, enum: ['Vata', 'Pitta', 'Kapha'], required: true, unique: true },
  description: String,
  dietaryGuidelines: [String],
  workoutGuidelines: [String],
  schedule: [{
    day: { type: String, required: true }, // e.g., "Monday"
    meals: [{
      type: { type: String, enum: ['Breakfast', 'Lunch', 'Snack', 'Dinner'] },
      item: String,
      ingredients: [String], // For Smart Cart
      calories: Number
    }],
    exercises: [{
      name: String,
      duration: String,
      category: { type: String, enum: ['Yoga', 'Cardio', 'Strength', 'HIIT', 'Rest', 'Warm-up', 'Breathing'] }
    }]
  }]
});

module.exports = mongoose.model('Plan', planSchema);
