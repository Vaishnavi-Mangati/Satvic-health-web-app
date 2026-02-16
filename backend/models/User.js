const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bodyType: { 
    type: String, 
    enum: ['Vata', 'Pitta', 'Kapha'], 
    default: null 
  },
  scores: {
    vata: { type: Number, default: 0 },
    pitta: { type: Number, default: 0 },
    kapha: { type: Number, default: 0 }
  },
  physicalStats: {
    height: { type: Number, default: 0 }, // in cm
    weight: { type: Number, default: 0 }, // in kg
    bmi: { type: Number, default: 0 },
    category: { type: String, default: null } // Underweight, Normal, Overweight, Obese
  },
  healthConditions: [{
    type: String,
    enum: ['Diabetes', 'High BP', 'Low BP', 'PCOS/PCOD', 'Thyroid', 'IBS', 'None']
  }],
  cartItems: [{
    name: { type: String, required: true },
    isBought: { type: Boolean, default: false },
    category: { type: String, default: 'General' },
    quantity: { type: Number, default: 1 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
