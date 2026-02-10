const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Plan = require('../models/Plan');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') }); // reliably points to backend/.env

const vataSchedule = [
  {
    day: "Monday",
    meals: [
      { type: 'Breakfast', item: 'Oatmeal with Almonds and Cinnamon', ingredients: ['Oats', 'Almonds', 'Cinnamon', 'Milk'], calories: 350 },
      { type: 'Lunch', item: 'Quinoa Bowl with Roasted Root Vegetables', ingredients: ['Quinoa', 'Sweet Potato', 'Carrots', 'Ghee'], calories: 500 },
      { type: 'Snack', item: 'Warm Spiced Milk', ingredients: ['Milk', 'Cardamom', 'Honey'], calories: 150 },
      { type: 'Dinner', item: 'Lentil Soup with Rice', ingredients: ['Lentils', 'Rice', 'Ginger', 'Turmeric'], calories: 450 }
    ],
    exercises: [
      { name: 'Joint Rotation Warm-up', duration: '5 mins', category: 'Warm-up' },
      { name: 'Sun Salutations (Surya Namaskar)', duration: '15 mins', category: 'Yoga' },
      { name: 'Mindful Walking', duration: '10 mins', category: 'Cardio' }
    ]
  },
  {
    day: "Tuesday",
    meals: [
      { type: 'Breakfast', item: 'Stewed Apples with Cloves', ingredients: ['Apples', 'Cloves', 'Ghee'], calories: 300 },
      { type: 'Lunch', item: 'Basmati Rice and Mung Dal Kitchari', ingredients: ['Rice', 'Mung Dal', 'Cumin'], calories: 550 },
      { type: 'Snack', item: 'Soaked Walnuts', ingredients: ['Walnuts'], calories: 200 },
      { type: 'Dinner', item: 'Steamed Sweet Potatoes with Butter', ingredients: ['Sweet Potato', 'Butter'], calories: 400 }
    ],
    exercises: [
      { name: 'Cat-Cow Gental Stretch', duration: '10 mins', category: 'Yoga' },
      { name: 'Restorative Child\'s Pose', duration: '10 mins', category: 'Yoga' },
      { name: 'Anulom Vilom Pranayama', duration: '10 mins', category: 'Breathing' }
    ]
  },
  {
    day: "Wednesday",
    meals: [
      { type: 'Breakfast', item: 'Warm Rice Pudding', ingredients: ['Rice', 'Milk', 'Cardamom', 'Raisins'], calories: 350 },
      { type: 'Lunch', item: 'Roasted Pumpkin Soup with Toast', ingredients: ['Pumpkin', 'Cream', 'Whole Wheat Bread'], calories: 450 },
      { type: 'Snack', item: 'Sesame Seeds and Jaggery', ingredients: ['Sesame Seeds', 'Jaggery'], calories: 180 },
      { type: 'Dinner', item: 'Zucchini and Carrot Stew', ingredients: ['Zucchini', 'Carrot', 'Coconut Milk'], calories: 400 }
    ],
    exercises: [
      { name: 'Tai Chi Basic Flow', duration: '20 mins', category: 'Yoga' },
      { name: 'Neck & Shoulder Release', duration: '10 mins', category: 'Warm-up' },
      { name: 'Light Outdoor Walk', duration: '15 mins', category: 'Cardio' }
    ]
  },
  {
    day: "Thursday",
    meals: [
      { type: 'Breakfast', item: 'Cream of Wheat w/ Dates', ingredients: ['Wheat', 'Dates', 'Milk', 'Ghee'], calories: 320 },
      { type: 'Lunch', item: 'Butternut Squash Risotto', ingredients: ['Butternut Squash', 'Arborio Rice', 'Parmesan'], calories: 550 },
      { type: 'Snack', item: 'Almond Butter on Toast', ingredients: ['Almond Butter', 'Bread'], calories: 250 },
      { type: 'Dinner', item: 'Miso Soup with Tofu', ingredients: ['Miso', 'Tofu', 'Seaweed', 'Scallions'], calories: 350 }
    ],
    exercises: [
      { name: 'Yin Yoga (Deep Stretch)', duration: '25 mins', category: 'Yoga' },
      { name: 'Body Scan Meditation', duration: '15 mins', category: 'Rest' }
    ]
  },
  {
    day: "Friday",
    meals: [
      { type: 'Breakfast', item: 'Scrambled Eggs with Avocado', ingredients: ['Eggs', 'Avocado', 'Ghee', 'Toast'], calories: 400 },
      { type: 'Lunch', item: 'Khichdi with Ghee', ingredients: ['Rice', 'Lentils', 'Ghee', 'Cumin'], calories: 500 },
      { type: 'Snack', item: 'Warm Berry Compote', ingredients: ['Mixed Berries', 'Cinnamon', 'Honey'], calories: 150 },
      { type: 'Dinner', item: 'Roasted Beets and Asparagus', ingredients: ['Beets', 'Asparagus', 'Olive Oil'], calories: 350 }
    ],
    exercises: [
      { name: 'Gentle Dance / Rhythmic Movement', duration: '15 mins', category: 'Cardio' },
      { name: 'Legs-up-the-wall Pose', duration: '10 mins', category: 'Rest' },
      { name: 'Guided Meditation', duration: '10 mins', category: 'Rest' }
    ]
  },
  {
    day: "Saturday",
    meals: [
      { type: 'Breakfast', item: 'Pancakes with Maple Syrup', ingredients: ['Flour', 'Milk', 'Maple Syrup', 'Butter'], calories: 450 },
      { type: 'Lunch', item: 'Pasta with Creamy Spinach Sauce', ingredients: ['Pasta', 'Spinach', 'Cream', 'Nutmeg'], calories: 550 },
      { type: 'Snack', item: 'Chai Tea Latte', ingredients: ['Black Tea', 'Milk', 'Spices'], calories: 120 },
      { type: 'Dinner', item: 'Vegetable Stir-fry with Tofu', ingredients: ['Tofu', 'Broccoli', 'Carrots', 'Soy Sauce'], calories: 400 }
    ],
    exercises: [
      { name: 'Slow Nature Walk', duration: '30 mins', category: 'Cardio' },
      { name: 'Tree Pose Practice', duration: '10 mins', category: 'Yoga' }
    ]
  },
  {
    day: "Sunday",
    meals: [
      { type: 'Breakfast', item: 'Sweet Potato Hash', ingredients: ['Sweet Potato', 'Onion', 'Paprika'], calories: 300 },
      { type: 'Lunch', item: 'Hearty Vegetable Stew', ingredients: ['Potatoes', 'Carrots', 'Peas', 'Tomatoes'], calories: 450 },
      { type: 'Snack', item: 'Yogurt with Honey', ingredients: ['Yogurt', 'Honey'], calories: 150 },
      { type: 'Dinner', item: 'Avocado Toast', ingredients: ['Avocado', 'Bread', 'Lemon'], calories: 350 }
    ],
    exercises: [
      { name: 'Full Body Relaxation', duration: '20 mins', category: 'Rest' },
      { name: 'Gentle Spinal Twists', duration: '10 mins', category: 'Yoga' }
    ]
  }
];

const pittaSchedule = [
  {
    day: "Monday",
    meals: [
      { type: 'Breakfast', item: 'Fruit Salad (Melon, Pear)', ingredients: ['Melon', 'Pear', 'Mint'], calories: 300 },
      { type: 'Lunch', item: 'Basmati Rice with Kidney Beans', ingredients: ['Rice', 'Kidney Beans', 'Coconut Oil'], calories: 600 },
      { type: 'Snack', item: 'Sunflower Seeds', ingredients: ['Sunflower Seeds'], calories: 180 },
      { type: 'Dinner', item: 'Steamed Vegetables with Barley', ingredients: ['Barley', 'Kale', 'Broccoli'], calories: 450 }
    ],
    exercises: [
      { name: 'Shoulder Opener Stretch', duration: '5 mins', category: 'Warm-up' },
      { name: 'Lane Swimming (Cool Temp)', duration: '20 mins', category: 'Cardio' },
      { name: 'Sitali Cooling Breath', duration: '10 mins', category: 'Breathing' }
    ]
  },
  {
    day: "Tuesday",
    meals: [
      { type: 'Breakfast', item: 'Avocado Toast with Cucumber', ingredients: ['Bread', 'Avocado', 'Cucumber'], calories: 350 },
      { type: 'Lunch', item: 'Quinoa Salad with Chickpeas', ingredients: ['Quinoa', 'Chickpeas', 'Cucumber', 'Lemon'], calories: 500 },
      { type: 'Snack', item: 'Coconut Water', ingredients: ['Coconut Water'], calories: 60 },
      { type: 'Dinner', item: 'Zucchini Noodles with Pesto', ingredients: ['Zucchini', 'Basil', 'Pine Nuts', 'Olive Oil'], calories: 400 }
    ],
    exercises: [
      { name: 'Brisk Cycling (Early Morning)', duration: '25 mins', category: 'Cardio' },
      { name: 'Forward Fold Stretches', duration: '10 mins', category: 'Yoga' }
    ]
  },
  {
    day: "Wednesday",
    meals: [
      { type: 'Breakfast', item: 'Smoothie Bowl (Mango/Coconut)', ingredients: ['Mango', 'Coconut Milk', 'Granola'], calories: 400 },
      { type: 'Lunch', item: 'Lentil Soup with Rice', ingredients: ['Lentils', 'Rice', 'Cilantro'], calories: 500 },
      { type: 'Snack', item: 'Celery Sticks with Almond Butter', ingredients: ['Celery', 'Almond Butter'], calories: 150 },
      { type: 'Dinner', item: 'Stir-fried Asparagus and Tofu', ingredients: ['Asparagus', 'Tofu', 'Soy Sauce', 'Ginger'], calories: 400 }
    ],
    exercises: [
      { name: 'Moderate Intensity Badminton/Tennis', duration: '35 mins', category: 'Cardio' },
      { name: 'Calming Moon Salutations', duration: '15 mins', category: 'Yoga' }
    ]
  },
  {
    day: "Thursday",
    meals: [
      { type: 'Breakfast', item: 'Oatmeal with Raisins', ingredients: ['Oats', 'Raisins', 'Milk'], calories: 320 },
      { type: 'Lunch', item: 'Wrap with Hummus and Veggies', ingredients: ['Tortilla', 'Hummus', 'Cucumber', 'Spinach'], calories: 450 },
      { type: 'Snack', item: 'Rice Cakes with Avocado', ingredients: ['Rice Cakes', 'Avocado'], calories: 180 },
      { type: 'Dinner', item: 'Pumpkin Soup', ingredients: ['Pumpkin', 'Coconut Milk', 'Thyme'], calories: 350 }
    ],
    exercises: [
      { name: 'Hatha Yoga (Pitta Focus)', duration: '30 mins', category: 'Yoga' },
      { name: 'Abdominal Breathing', duration: '10 mins', category: 'Breathing' }
    ]
  },
  {
    day: "Friday",
    meals: [
      { type: 'Breakfast', item: 'Granola with Yogurt', ingredients: ['Granola', 'Yogurt', 'Berries'], calories: 350 },
      { type: 'Lunch', item: 'Vegetable Biryani', ingredients: ['Rice', 'Mixed Veggies', 'Spices', 'Yogurt'], calories: 550 },
      { type: 'Snack', item: 'Sliced Apple', ingredients: ['Apple'], calories: 80 },
      { type: 'Dinner', item: 'Sweet Potato and Kale Salad', ingredients: ['Sweet Potato', 'Kale', 'Tahini Dressing'], calories: 400 }
    ],
    exercises: [
      { name: 'Water Aerobics', duration: '30 mins', category: 'Cardio' },
      { name: 'Gentle Hip Openers', duration: '15 mins', category: 'Yoga' }
    ]
  },
  {
    day: "Saturday",
    meals: [
      { type: 'Breakfast', item: 'Pancakes with Fresh Fruit', ingredients: ['Flour', 'Milk', 'Strawberries', 'Blueberries'], calories: 450 },
      { type: 'Lunch', item: 'Caprese Sandwich', ingredients: ['Bread', 'Mozzarella', 'Tomato', 'Basil'], calories: 500 },
      { type: 'Snack', item: 'Cucumber Juice with Mint', ingredients: ['Cucumber', 'Mint', 'Lime'], calories: 60 },
      { type: 'Dinner', item: 'Roasted Cauliflower Tacos', ingredients: ['Tortilla', 'Cauliflower', 'Cabbage Slaw'], calories: 400 }
    ],
    exercises: [
      { name: 'Shaded Hiking / Forest Bathing', duration: '45 mins', category: 'Cardio' },
      { name: 'Savasana with Eye Pillow', duration: '10 mins', category: 'Rest' }
    ]
  },
  {
    day: "Sunday",
    meals: [
      { type: 'Breakfast', item: 'Scrambled Tofu', ingredients: ['Tofu', 'Turmeric', 'Spinach'], calories: 300 },
      { type: 'Lunch', item: 'Pasta Primavera', ingredients: ['Pasta', 'Bell Peppers', 'Zucchini', 'Olive Oil'], calories: 500 },
      { type: 'Snack', item: 'Dried Figs', ingredients: ['Figs'], calories: 150 },
      { type: 'Dinner', item: 'Minestrone Soup', ingredients: ['Beans', 'Pasta', 'Vegetables', 'Tomato Broth'], calories: 350 }
    ],
    exercises: [
      { name: 'Meditation near Water', duration: '20 mins', category: 'Rest' },
      { name: 'Cooling Stretch Flow', duration: '15 mins', category: 'Yoga' }
    ]
  }
];

const kaphaSchedule = [
  {
    day: "Monday",
    meals: [
      { type: 'Breakfast', item: 'Stewed Pears with Ginger', ingredients: ['Pear', 'Ginger', 'Honey'], calories: 250 },
      { type: 'Lunch', item: 'Spicy Chickpea Curry with Quinoa', ingredients: ['Chickpeas', 'Quinoa', 'Chili', 'Spinach'], calories: 500 },
      { type: 'Snack', item: 'Roasted Pumpkin Seeds', ingredients: ['Pumpkin Seeds', 'Paprika'], calories: 160 },
      { type: 'Dinner', item: 'Grilled Vegetables with Millet', ingredients: ['Millet', 'Peppers', 'Zucchini'], calories: 400 }
    ],
    exercises: [
      { name: 'Dynamic Jumping Jacks', duration: '5 mins', category: 'Warm-up' },
      { name: 'Steady Jogging', duration: '20 mins', category: 'Cardio' },
      { name: 'Vinyasa Flow (Fast)', duration: '15 mins', category: 'Yoga' }
    ]
  },
  {
    day: "Tuesday",
    meals: [
      { type: 'Breakfast', item: 'Green Smoothie (Spinach/Apple)', ingredients: ['Spinach', 'Apple', 'Lemon', 'Ginger'], calories: 200 },
      { type: 'Lunch', item: 'Lentil Soup with Barley', ingredients: ['Lentils', 'Barley', 'Cumin', 'Mustard Seeds'], calories: 450 },
      { type: 'Snack', item: 'Popcorn (Air-popped, Spicy)', ingredients: ['Popcorn', 'Cayenne Pepper'], calories: 100 },
      { type: 'Dinner', item: 'Stir-fry Broccoli and Tofu', ingredients: ['Broccoli', 'Tofu', 'Soy Sauce', 'Garlic'], calories: 350 }
    ],
    exercises: [
      { name: 'High Intensity Intervals (Tabata)', duration: '15 mins', category: 'HIIT' },
      { name: 'Mountain Climbers', duration: '5 mins', category: 'Strength' },
      { name: 'Bellows Breath (Bhastrika)', duration: '5 mins', category: 'Breathing' }
    ]
  },
  {
    day: "Wednesday",
    meals: [
      { type: 'Breakfast', item: 'Oat Bran Muffin', ingredients: ['Oat Bran', 'Honey', 'Raisins'], calories: 250 },
      { type: 'Lunch', item: 'Black Bean Salad', ingredients: ['Black Beans', 'Corn', 'Peppers', 'Lime'], calories: 400 },
      { type: 'Snack', item: 'Grapefruit', ingredients: ['Grapefruit'], calories: 80 },
      { type: 'Dinner', item: 'Spicy Pumpkin Soup', ingredients: ['Pumpkin', 'Chili', 'Onion'], calories: 300 }
    ],
    exercises: [
      { name: 'Power Cycling / Spin Session', duration: '40 mins', category: 'Cardio' },
      { name: 'Core Crusher Plank Holds', duration: '10 mins', category: 'Strength' }
    ]
  },
  {
    day: "Thursday",
    meals: [
      { type: 'Breakfast', item: 'Poached Eggs with Spinach', ingredients: ['Eggs', 'Spinach', 'Pepper'], calories: 300 },
      { type: 'Lunch', item: 'Curried Cauliflower and Peas', ingredients: ['Cauliflower', 'Peas', 'Curry Powder'], calories: 350 },
      { type: 'Snack', item: 'Roasted Chickpeas', ingredients: ['Chickpeas', 'Cumin'], calories: 150 },
      { type: 'Dinner', item: 'Quinoa Stuffed Peppers', ingredients: ['Bell Peppers', 'Quinoa', 'Tomato'], calories: 350 }
    ],
    exercises: [
      { name: 'Power Yoga Flow', duration: '30 mins', category: 'Yoga' },
      { name: 'Sun Salutations (Fast Pace)', duration: '15 mins', category: 'Yoga' }
    ]
  },
  {
    day: "Friday",
    meals: [
      { type: 'Breakfast', item: 'Toast with Honey and Cinnamon', ingredients: ['Toast', 'Honey', 'Cinnamon'], calories: 200 },
      { type: 'Lunch', item: 'Mung Bean Soup', ingredients: ['Mung Beans', 'Ginger', 'Turmeric'], calories: 400 },
      { type: 'Snack', item: 'Carrot Sticks with Hummus', ingredients: ['Carrots', 'Hummus'], calories: 150 },
      { type: 'Dinner', item: 'Baked Fish/Tofu with Asparagus', ingredients: ['Fish/Tofu', 'Asparagus', 'Lemon'], calories: 400 }
    ],
    exercises: [
      { name: 'Outdoor Running', duration: '35 mins', category: 'Cardio' },
      { name: 'High Knee Drills', duration: '10 mins', category: 'Warm-up' }
    ]
  },
  {
    day: "Saturday",
    meals: [
      { type: 'Breakfast', item: 'Buckwheat Pancakes', ingredients: ['Buckwheat Flour', 'Blueberries'], calories: 300 },
      { type: 'Lunch', item: 'Spicy Noodle Soup', ingredients: ['Rice Noodles', 'Bok Choy', 'Chili Oil'], calories: 450 },
      { type: 'Snack', item: 'Green Tea and Rice Cake', ingredients: ['Green Tea', 'Rice Cake'], calories: 50 },
      { type: 'Dinner', item: 'Grilled Eggplant and Zucchini', ingredients: ['Eggplant', 'Zucchini', 'Balsamic Vinegar'], calories: 300 }
    ],
    exercises: [
      { name: 'Full Body Circuit Training', duration: '45 mins', category: 'Strength' },
      { name: 'Active Recovery Stretching', duration: '15 mins', category: 'Yoga' }
    ]
  },
  {
    day: "Sunday",
    meals: [
      { type: 'Breakfast', item: 'Fruit Salad (Berries/Apple)', ingredients: ['Berries', 'Apple', 'Pomegranate'], calories: 200 },
      { type: 'Lunch', item: 'Vegetable Curry with Brown Rice', ingredients: ['Mixed Veggies', 'Curry Paste', 'Brown Rice'], calories: 500 },
      { type: 'Snack', item: 'Handful of Pumpkin Seeds', ingredients: ['Pumpkin Seeds'], calories: 100 },
      { type: 'Dinner', item: 'Clear Vegetable Soup', ingredients: ['Broth', 'Celery', 'Carrots', 'Kale'], calories: 250 }
    ],
    exercises: [
      { name: 'Uphill Hike', duration: '60 mins', category: 'Cardio' },
      { name: 'Cool Down Mindfulness', duration: '15 mins', category: 'Rest' }
    ]
  }
];

const plans = [
  {
    bodyType: 'Vata',
    description: "Vata types need grounding, warming, and nourishing foods and routines.",
    dietaryGuidelines: ["Eat warm, cooked foods", "Use healthy oils (ghee, sesame)", "Avoid dry/cold foods"],
    workoutGuidelines: ["Focus on balance and flexibility", "Low impact cardio", "Yoga and Tai Chi"],
    schedule: vataSchedule
  },
  {
    bodyType: 'Pitta',
    description: "Pitta types need cooling, stabilizing, and moderately energizing foods.",
    dietaryGuidelines: ["Eat cooling foods", "Avoid spicy/sour/salty", "Favor sweet/bitter/astringent tastes"],
    workoutGuidelines: ["Moderate cardio", "Swimming", "Team sports"],
    schedule: pittaSchedule
  },
  {
    bodyType: 'Kapha',
    description: "Kapha types need stimulating, warming, and lightening foods and routines.",
    dietaryGuidelines: ["Eat warm, light foods", "Favor pungent/bitter/astringent", "Avoid dairy/sugar/oil"],
    workoutGuidelines: ["Vigorous cardio", "Running", "HIIT"],
    schedule: kaphaSchedule
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    await Plan.deleteMany({});
    console.log('Old plans removed');

    await Plan.insertMany(plans);
    console.log('Seeding Success: Plans Added');

    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
