const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, bodyType, scores, height, weight, healthConditions } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // BMI Calculation Logic
    let bmi = 0;
    let category = 'Normal';
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
      
      if (bmi < 18.5) category = 'Underweight';
      else if (bmi < 25) category = 'Normal';
      else if (bmi < 30) category = 'Overweight';
      else category = 'Obese';
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      bodyType,
      scores,
      physicalStats: { height, weight, bmi, category },
      healthConditions: healthConditions || []
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          user: { 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            bodyType: user.bodyType,
            physicalStats: user.physicalStats,
            healthConditions: user.healthConditions
          } 
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          user: { 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            bodyType: user.bodyType,
            physicalStats: user.physicalStats,
            healthConditions: user.healthConditions
          } 
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get User Profile (Protected)
router.get('/profile', async (req, res) => {
    // This will be protected by middleware later
});

// Update User Profile (Protected)
router.put('/profile', require('../middleware/auth'), async (req, res) => {
  try {
    const { name, bodyType, scores, height, weight, healthConditions } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (bodyType) user.bodyType = bodyType;
    if (scores) user.scores = scores;
    
    // Update physical stats if provided
    if (height !== undefined || weight !== undefined) {
      const h = height !== undefined ? height : user.physicalStats.height;
      const w = weight !== undefined ? weight : user.physicalStats.weight;
      
      let bmi = 0;
      let category = 'Normal';
      if (h > 0 && w > 0) {
        const heightInMeters = h / 100;
        bmi = parseFloat((w / (heightInMeters * heightInMeters)).toFixed(1));
        
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi < 25) category = 'Normal';
        else if (bmi < 30) category = 'Overweight';
        else category = 'Obese';
      }
      
      user.physicalStats = { height: h, weight: w, bmi, category };
    }

    if (healthConditions) {
      user.healthConditions = healthConditions;
    }

    await user.save();

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      bodyType: user.bodyType,
      scores: user.scores,
      physicalStats: user.physicalStats,
      healthConditions: user.healthConditions
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
