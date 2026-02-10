const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    const users = await User.find({}, 'name email _id');
    console.log('Registered Users:');
    users.forEach(u => console.log(`- ${u.name} (${u.email}) [ID: ${u._id}]`));

    mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
  }
};

listUsers();
