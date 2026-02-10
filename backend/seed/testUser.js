const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const DailyProgress = require('../models/DailyProgress');
const Plan = require('../models/Plan');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // 1. Create Test User
    const email = 'test@example.com';
    let user = await User.findOne({ email });
    
    if (user) {
      await DailyProgress.deleteMany({ userId: user._id });
      await User.deleteOne({ _id: user._id });
      console.log('Existing test user and their progress cleared.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    user = new User({
      name: 'Test User',
      email: email,
      password: hashedPassword,
      bodyType: 'Vata',
      scores: { vata: 10, pitta: 5, kapha: 2 }
    });

    await user.save();
    console.log('Test User created: test@example.com / password123');

    // 2. Seed Progress History (Last 30 days)
    const history = [];
    const now = new Date();
    
    // Get Vata plan to know what items to "complete"
    const vataPlan = await Plan.findOne({ bodyType: 'Vata' });
    const possibleItems = [];
    if (vataPlan) {
        vataPlan.schedule.forEach(day => {
            day.meals.forEach(m => possibleItems.push({ id: m._id || m.time, type: 'meal' }));
            day.exercises.forEach(e => possibleItems.push({ id: e._id || e.name, type: 'workout' }));
        });
    }

    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      // Higher chance for more recent days, guaranteed for first 10 days of history
      const completionChance = i < 10 ? 1.0 : (0.7 - (i * 0.015)); 
      const completedItems = [];

      // Add some items if chance hits
      if (Math.random() <= completionChance) {
          const numItems = Math.floor(Math.random() * 8) + 3; // 3 to 10 items
          for(let j=0; j<numItems; j++) {
              completedItems.push({
                  itemId: `item_${j}`, 
                  type: j % 2 === 0 ? 'Meal' : 'Exercise',
                  completed: true
              });
          }
      }

      history.push({
        userId: user._id,
        date: dateString,
        completedItems
      });
    }

    await DailyProgress.insertMany(history);
    console.log('Seeded 30 days of progress history.');

    mongoose.connection.close();
    console.log('Seeding complete.');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedTestData();
