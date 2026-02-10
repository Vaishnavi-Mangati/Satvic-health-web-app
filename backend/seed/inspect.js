const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const DailyProgress = require('../models/DailyProgress');

dotenv.config({ path: path.join(__dirname, '../.env') });

const inspectData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    const email = 'test@example.com';
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('Test user not found.');
    } else {
      console.log('User Found:');
      console.log(`ID: ${user._id}`);
      console.log(`Email: ${user.email}`);
      console.log(`BodyType: ${user.bodyType}`);

      const count = await DailyProgress.countDocuments({ userId: user._id });
      console.log(`Total Progress Records for this User ID (ObjectID): ${count}`);

      const countStr = await DailyProgress.countDocuments({ userId: user._id.toString() });
      console.log(`Total Progress Records for this User ID (String): ${countStr}`);

      if (countStr > 0) {
          const sample = await DailyProgress.findOne({ userId: user._id.toString() });
          console.log('Sample Record:');
          console.log(JSON.stringify(sample, null, 2));
      }
    }

    mongoose.connection.close();
  } catch (err) {
    console.error('Inspection error:', err);
  }
};

inspectData();
