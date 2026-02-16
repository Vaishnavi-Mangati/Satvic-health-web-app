const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');

// Helper to calculate BMI category
const getBMICategory = (height, weight) => {
    if (!height || !weight) return null;
    const heightInMeters = height / 100;
    const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
};

// Adaptive Transformation Logic
const applyIntelligenceTransform = (plan, height, weight, conditions = []) => {
    const category = getBMICategory(height, weight);
    const transformedSchedule = JSON.parse(JSON.stringify(plan.schedule)); // Deep copy

    transformedSchedule.forEach(day => {
        day.meals.forEach(meal => {
            // 1. Weight Management Adjustments
            if (category === 'Obese' || category === 'Overweight') {
                meal.item = `${meal.item} (Controlled Portion)`;
                meal.calories = Math.round(meal.calories * 0.85); // 15% calorie reduction
                meal.notes = "Portion control active for weight optimization.";
            } else if (category === 'Underweight') {
                meal.item = `${meal.item} (Nourishing+)`;
                meal.calories = Math.round(meal.calories * 1.2); // 20% calorie increase
                meal.ingredients.push('Extra Ghee/Nuts');
                meal.notes = "Extra healthy fats added for nourishment.";
            }

            // 2. Condition-Specific Ingredient Swaps
            if (conditions.includes('Diabetes')) {
                // Swap High GI ingredients
                meal.ingredients = meal.ingredients.map(ing => {
                    if (ing === 'Honey' || ing === 'Jaggery' || ing === 'Maple Syrup') return 'Stevia (Zero-GI)';
                    if (ing === 'Rice' || ing === 'Basmati Rice') return 'Millet (Low-GI)';
                    if (ing === 'Bread' || ing === 'Whole Wheat Bread') return 'Multi-grain Sourdough';
                    return ing;
                });
                meal.item = meal.item.replace(/Rice/g, 'Millet').replace(/Honey|Jaggery/g, 'Natural Sweetener');
                meal.diabetesOverlay = "Low-GI swap active.";
            }

            if (conditions.includes('High BP')) {
                meal.hpnOverlay = "Low-sodium preparation. Added Potassium rich greens.";
                if (!meal.ingredients.includes('Spinach') && !meal.ingredients.includes('Kale')) {
                    meal.ingredients.push('Fresh Greens');
                }
            }
        });

        // 3. Exercise Adaptation
        if (category === 'Obese') {
            day.exercises = day.exercises.map(ex => {
                if (ex.category === 'HIIT' || ex.category === 'Cardio') {
                    return { ...ex, name: `${ex.name} (Joint-Friendly Pace)`, duration: 'Moderate ' + ex.duration };
                }
                return ex;
            });
        }
    });

    return {
        ...plan.toObject(),
        schedule: transformedSchedule,
        intelligenceActive: true,
        userSnapshot: { category, conditions }
    };
};

// @route   GET /api/plans/:bodyType
// @desc    Get Plan by Body Type with Health Intelligence
router.get('/:bodyType', async (req, res) => {
  try {
    const { bodyType } = req.params;
    const { height, weight, conditions } = req.query;
    
    // Parse conditions if provided as comma-separated string
    const healthConditions = conditions ? conditions.split(',') : [];

    const plan = await Plan.findOne({ 
      bodyType: { $regex: new RegExp(`^${bodyType}$`, 'i') } 
    });
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found for this body type' });
    }

    // Apply Health Intelligence Transformation
    const intelligentPlan = applyIntelligenceTransform(plan, height, weight, healthConditions);
    
    res.json(intelligentPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
