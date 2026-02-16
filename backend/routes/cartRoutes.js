const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Master Product Catalog - Grouped by Main Category (Diet/Workout)
const PRODUCT_CATALOG = [
    // === DIET CATEGORY ===
    
    // HEALING SPICES
    { name: 'Organic Turmeric Powder', mainCategory: 'Diet', subCategory: 'Healing Spices', benefits: ['Inflammation', 'Sugar-Balance'], cautions: [] },
    { name: 'Ceylon Cinnamon Sticks', mainCategory: 'Diet', subCategory: 'Healing Spices', benefits: ['Sugar-Balance', 'Metabolism'], cautions: [] },
    { name: 'Whole Cloves', mainCategory: 'Diet', subCategory: 'Healing Spices', benefits: ['Digestion', 'Pain-Relief'], cautions: [] },
    { name: 'Black Peppercorns', mainCategory: 'Diet', subCategory: 'Healing Spices', benefits: ['Bio-availability', 'Weight-Loss'], cautions: ['IBS'] },
    { name: 'Dry Ginger Powder', mainCategory: 'Diet', subCategory: 'Healing Spices', benefits: ['Digestion', 'Immunity'], cautions: ['High BP'] },
    
    // ANCIENT GRAINS
    { name: 'Organic Quinoa', mainCategory: 'Diet', subCategory: 'Ancient Grains', benefits: ['Protein', 'Metabolism'], cautions: [] },
    { name: 'Brown Basmati Rice', mainCategory: 'Diet', subCategory: 'Ancient Grains', benefits: ['Energy', 'Fiber'], cautions: ['Diabetes'] },
    { name: 'Foxtail Millet', mainCategory: 'Diet', subCategory: 'Ancient Grains', benefits: ['Sugar-Balance', 'Heart-Health'], cautions: [] },
    { name: 'Steel Cut Oats', mainCategory: 'Diet', subCategory: 'Ancient Grains', benefits: ['Heart-Health', 'Weight-Loss'], cautions: ['Diabetes'] },
    
    // NUTS & SEEDS
    { name: 'Premium Almonds', mainCategory: 'Diet', subCategory: 'Health Boosters', benefits: ['Brain-Power', 'Skin-Health'], cautions: [] },
    { name: 'Walnut Kernels', mainCategory: 'Diet', subCategory: 'Health Boosters', benefits: ['Brain-Power', 'Omega-3'], cautions: [] },
    { name: 'Organic Chia Seeds', mainCategory: 'Diet', subCategory: 'Health Boosters', benefits: ['Omega-3', 'Fiber'], cautions: [] },
    { name: 'Flax Seeds', mainCategory: 'Diet', subCategory: 'Health Boosters', benefits: ['Omega-3', 'Hormone-Balance'], cautions: ['PCOS/PCOD'] },
    
    // HEALTHY FATS
    { name: 'Organic A2 Ghee', mainCategory: 'Diet', subCategory: 'Healthy Fats', benefits: ['Brain-Power', 'Joint-Health'], cautions: ['Obese'] },
    { name: 'Cold-pressed Coconut Oil', mainCategory: 'Diet', subCategory: 'Healthy Fats', benefits: ['Metabolism', 'Immunity'], cautions: [] },
    { name: 'Extra Virgin Olive Oil', mainCategory: 'Diet', subCategory: 'Healthy Fats', benefits: ['Heart-Health', 'Anti-aging'], cautions: [] },
    
    // HERBAL SUPPLEMENTS
    { name: 'Ashwagandha Extract', mainCategory: 'Diet', subCategory: 'Ayurvedic Herbs', benefits: ['Stress-Relief', 'Sugar-Balance'], cautions: ['Thyroid'] },
    { name: 'Triphala Churna', mainCategory: 'Diet', subCategory: 'Ayurvedic Herbs', benefits: ['Digestion', 'Detox'], cautions: ['IBS'] },
    { name: 'Moringa Powder', mainCategory: 'Diet', subCategory: 'Ayurvedic Herbs', benefits: ['Immunity', 'Joint-Health'], cautions: [] },
    
    // FRESH PANTRY
    { name: 'Fresh Curry Leaves', mainCategory: 'Diet', subCategory: 'Pantry', benefits: ['Digestion', 'Hair-Health'], cautions: [] },
    { name: 'Organic Fresh Ginger', mainCategory: 'Diet', subCategory: 'Pantry', benefits: ['Immunity', 'Circulation'], cautions: ['High BP'] },
    { name: 'Lemon', mainCategory: 'Diet', subCategory: 'Pantry', benefits: ['Detox', 'Vitamin-C'], cautions: [] },

    // === WORKOUT CATEGORY ===
    
    // EQUIPMENT
    { name: 'Eco-friendly Yoga Mat', mainCategory: 'Workout', subCategory: 'Equipment', benefits: ['Flexibility', 'Mindfulness'], cautions: [] },
    { name: 'Resistance Bands Set', mainCategory: 'Workout', subCategory: 'Equipment', benefits: ['Muscle-Tone', 'Weight-Loss'], cautions: ['Low BP'] },
    { name: 'Adjustable Dumbbells', mainCategory: 'Workout', subCategory: 'Equipment', benefits: ['Strength', 'Metabolism'], cautions: [] },
    { name: 'Kettlebell (4kg/8kg)', mainCategory: 'Workout', subCategory: 'Equipment', benefits: ['Strength', 'Core'], cautions: [] },
    
    // RECOVERY
    { name: 'Foam Roller', mainCategory: 'Workout', subCategory: 'Recovery', benefits: ['Muscle-Recovery', 'Flexibility'], cautions: [] },
    { name: 'Ayurvedic Massage Oil', mainCategory: 'Workout', subCategory: 'Recovery', benefits: ['Circulation', 'Pain-Relief'], cautions: [] },
    { name: 'Muscle Relief Balm', mainCategory: 'Workout', subCategory: 'Recovery', benefits: ['Pain-Relief'], cautions: [] },
    
    // ACCESSORIES
    { name: 'Copper Water Bottle', mainCategory: 'Workout', subCategory: 'Accessories', benefits: ['Detox', 'Immunity'], cautions: [] },
    { name: 'Cotton Yoga Strap', mainCategory: 'Workout', subCategory: 'Accessories', benefits: ['Flexibility'], cautions: [] },
    { name: 'Skipping Rope', mainCategory: 'Workout', subCategory: 'Cardio', benefits: ['Heart-Health', 'Weight-Loss'], cautions: ['High BP'] }
];

// @route   GET /api/cart/catalog
// @desc    Get all available products
router.get('/catalog', auth, (req, res) => {
    res.json(PRODUCT_CATALOG);
});

// @route   GET /api/cart
// @desc    Get user's active cart
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.cartItems || []);
    } catch (error) {
        console.error("Cart Fetch Error:", error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/cart/add
// @desc    Add item to cart or increment quantity
router.post('/add', auth, async (req, res) => {
    try {
        const { name } = req.body;
        const user = await User.findById(req.user.id);
        if (!user.cartItems) user.cartItems = [];

        // Validation - Ensure item is in catalog
        const catalogItem = PRODUCT_CATALOG.find(p => p.name === name);
        if (!catalogItem) return res.status(400).json({ message: 'Item not found in catalog' });

        const itemIndex = user.cartItems.findIndex(i => i.name === name);
        if (itemIndex > -1) {
            user.cartItems[itemIndex].quantity += 1;
        } else {
            user.cartItems.push({ 
                name: catalogItem.name, 
                category: catalogItem.mainCategory, // Map mainCategory to category for User model
                quantity: 1, 
                isBought: false 
            });
        }

        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.error("Cart Add Error:", error);
        res.status(500).json({ message: error.message });
    }
});

// @route   PATCH /api/cart/quantity
// @desc    Update quantity for a cart item
router.patch('/quantity', auth, async (req, res) => {
    try {
        const { name, quantity } = req.body;
        if (quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

        const user = await User.findById(req.user.id);
        const item = user.cartItems.find(i => i.name === name);
        if (item) {
            item.quantity = quantity;
            await user.save();
        }
        res.json(user.cartItems);
    } catch (error) {
        console.error("Cart Quantity Update Error:", error);
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/cart/remove/:name
// @desc    Remove an item from cart
router.delete('/remove/:name', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.cartItems = user.cartItems.filter(i => i.name !== req.params.name);
        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.error("Cart Removal Error:", error);
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/cart/clear
// @desc    Wipe user cart (for resets/legacy cleanup)
router.delete('/clear', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.cartItems = [];
        await user.save();
        res.json([]);
    } catch (error) {
        console.error("Cart Clear Error:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
