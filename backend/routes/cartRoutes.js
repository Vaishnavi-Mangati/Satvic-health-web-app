const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Master Product Catalog - Grouped by Main Category (Diet/Workout)
const PRODUCT_CATALOG = [
    // === DIET CATEGORY ===
    
    // HEALING SPICES
    { name: 'Organic Turmeric Powder', mainCategory: 'Diet', subCategory: 'Healing Spices' },
    { name: 'Ceylon Cinnamon Sticks', mainCategory: 'Diet', subCategory: 'Healing Spices' },
    { name: 'Whole Cloves', mainCategory: 'Diet', subCategory: 'Healing Spices' },
    { name: 'Black Peppercorns', mainCategory: 'Diet', subCategory: 'Healing Spices' },
    { name: 'Dry Ginger Powder', mainCategory: 'Diet', subCategory: 'Healing Spices' },
    
    // ANCIENT GRAINS
    { name: 'Organic Quinoa', mainCategory: 'Diet', subCategory: 'Ancient Grains' },
    { name: 'Brown Basmati Rice', mainCategory: 'Diet', subCategory: 'Ancient Grains' },
    { name: 'Foxtail Millet', mainCategory: 'Diet', subCategory: 'Ancient Grains' },
    { name: 'Steel Cut Oats', mainCategory: 'Diet', subCategory: 'Ancient Grains' },
    
    // NUTS & SEEDS
    { name: 'Premium Almonds', mainCategory: 'Diet', subCategory: 'Health Boosters' },
    { name: 'Walnut Kernels', mainCategory: 'Diet', subCategory: 'Health Boosters' },
    { name: 'Organic Chia Seeds', mainCategory: 'Diet', subCategory: 'Health Boosters' },
    { name: 'Flax Seeds', mainCategory: 'Diet', subCategory: 'Health Boosters' },
    
    // HEALTHY FATS
    { name: 'Organic A2 Ghee', mainCategory: 'Diet', subCategory: 'Healthy Fats' },
    { name: 'Cold-pressed Coconut Oil', mainCategory: 'Diet', subCategory: 'Healthy Fats' },
    { name: 'Extra Virgin Olive Oil', mainCategory: 'Diet', subCategory: 'Healthy Fats' },
    
    // HERBAL SUPPLEMENTS
    { name: 'Ashwagandha Extract', mainCategory: 'Diet', subCategory: 'Ayurvedic Herbs' },
    { name: 'Triphala Churna', mainCategory: 'Diet', subCategory: 'Ayurvedic Herbs' },
    { name: 'Moringa Powder', mainCategory: 'Diet', subCategory: 'Ayurvedic Herbs' },
    
    // FRESH PANTRY
    { name: 'Fresh Curry Leaves', mainCategory: 'Diet', subCategory: 'Pantry' },
    { name: 'Organic Fresh Ginger', mainCategory: 'Diet', subCategory: 'Pantry' },
    { name: 'Lemon', mainCategory: 'Diet', subCategory: 'Pantry' },

    // === WORKOUT CATEGORY ===
    
    // EQUIPMENT
    { name: 'Eco-friendly Yoga Mat', mainCategory: 'Workout', subCategory: 'Equipment' },
    { name: 'Resistance Bands Set', mainCategory: 'Workout', subCategory: 'Equipment' },
    { name: 'Adjustable Dumbbells', mainCategory: 'Workout', subCategory: 'Equipment' },
    { name: 'Kettlebell (4kg/8kg)', mainCategory: 'Workout', subCategory: 'Equipment' },
    
    // RECOVERY
    { name: 'Foam Roller', mainCategory: 'Workout', subCategory: 'Recovery' },
    { name: 'Ayurvedic Massage Oil', mainCategory: 'Workout', subCategory: 'Recovery' },
    { name: 'Muscle Relief Balm', mainCategory: 'Workout', subCategory: 'Recovery' },
    
    // ACCESSORIES
    { name: 'Copper Water Bottle', mainCategory: 'Workout', subCategory: 'Accessories' },
    { name: 'Cotton Yoga Strap', mainCategory: 'Workout', subCategory: 'Accessories' },
    { name: 'Skipping Rope', mainCategory: 'Workout', subCategory: 'Cardio' }
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
