const express = require('express');
const router = express.Router();
const auth = require('./middleware/auth');
const Crop = require('./models/Crop');

// Get All Crops (with filtering)
router.get('/', async (req, res) => {
    try {
        let query = {};

        // Filtering
        if (req.query.location) {
            query.location = { $regex: req.query.location, $options: 'i' }; // Case-insensitive
        }
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' };
        }
        if (req.query.quality) {
            query.quality = req.query.quality;
        }

        const crops = await Crop.find(query).populate('farmer', 'name location');
        res.json(crops);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add Crop (Protected)
router.post('/', auth, async (req, res) => {
    const { name, price, quantity, quality, location } = req.body;
    try {
        const newCrop = new Crop({
            farmer: req.user.id, // Get ID from Token
            name,
            price,
            quantity,
            quality,
            location
        });

        const crop = await newCrop.save();
        req.io.emit('cropAdded', crop); // Real-time update
        res.json(crop);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
