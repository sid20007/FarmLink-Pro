const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb'); 
// Updated imports to match the new mongodb.js exports
const { getProduceCollection, getUsersCollection } = require('./database/mongodb');

const { uploadImageQuick } = require('./database/cloudinary');
const { authenticateJWT } = require('./auth/middleware');
const multer = require('multer');

// Multer Config
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ==============================================================================
// GET PATHS
// ==============================================================================

// Get all produce listings (The Feed)
router.get('/', async (req, res) => {
    try {
        const produceCollection = getProduce();
        // Sort by newest first
        const items = await produceCollection.find({}).sort({ createdAt: -1 }).toArray();
        res.status(200).json(items);
    } catch (e) {
        console.error("Fetch error:", e);
        res.status(500).json({ error: "Fetch failed" });
    }
});

// ==============================================================================
// POST PATHS
// ==============================================================================

// Create a new Produce Listing
router.post('/', authenticateJWT, upload.single('image'), async (req, res) => {
    try {
        const produceCollection = getProduce();
        
        // New AgriFlow Fields:
        const { title, price, unit, quantity, location, description } = req.body;

        if (!title || !price || !quantity) {
            return res.status(400).json({ error: "Missing required fields (Title, Price, Qty)" });
        }
        
        // Image Upload Logic
        let imageUrl = "https://placehold.co/600x400/d97706/FFF?text=Crops"; // Default fallback
        if (req.file) {
            const imageBuffer = req.file.buffer;
            const imageBase64 = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
            // Assuming uploadImageQuick returns the URL string
            imageUrl = await uploadImageQuick(imageBase64);
        }
        
        const newListing = {
            title, 
            location, 
            description: description || "",
            price: parseFloat(price),
            unit: unit || 'kg',
            quantity: quantity, // e.g., "500" or "500 kg"
            
            // Seller Info
            sellerId: req.userId, 
            sellerName: req.userName, 
            
            image: imageUrl,
            
            // Interaction Arrays
            interestedBuyers: [], // Replaces 'attendees'
            comments: [], 
            createdAt: new Date()
        };

        const result = await produceCollection.insertOne(newListing);
        res.status(201).json({ success: true, id: result.insertedId });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Listing creation failed" });
    }
});

// Buyer expresses interest (Replaces /join)
router.post('/interest', authenticateJWT, async (req, res) => {
    try {
        const produceCollection = getProduce();
        const userId = req.userId; 
        const { produceId } = req.body;

        if (!produceId) return res.status(400).json({ error: "Missing Produce ID" });

        // Check if user is the seller (Seller can't buy own crops)
        const listing = await produceCollection.findOne({ _id: new ObjectId(produceId) });
        if (!listing) return res.status(404).json({ error: "Listing not found" });
        if (listing.sellerId === userId) return res.status(400).json({ error: "You cannot buy your own produce." });

        // Add user to interestedBuyers if not already there
        const update = await produceCollection.updateOne(
            { 
                _id: new ObjectId(produceId),
                interestedBuyers: { $ne: userId } // Avoid duplicates
            },
            { $addToSet: { interestedBuyers: userId } }
        );

        if (update.modifiedCount === 0) {
            return res.status(200).json({ message: "Already contacted or updated." });
        }

        res.status(200).json({ success: true, message: "Interest sent to farmer!" });
    } catch (e) { 
        console.error(e);
        res.status(500).json({ error: "Interest failed" });
    }
});

// Comments / Q&A on a listing
router.post('/comment', authenticateJWT, async (req, res) => {
    try {
        const usersCollection = getUsers();
        const produceCollection = getProduce();
        const userId = req.userId; 
        const { produceId, text } = req.body;

        if (!produceId || !text.trim()) return res.status(400).json({ error: "Missing data" });

        const userDoc = await usersCollection.findOne({ _id: new ObjectId(userId) }, { projection: { name: 1 } });
        
        const comment = { 
            _id: new ObjectId(), 
            userId, 
            userName: userDoc.name, 
            text, 
            timestamp: new Date() 
        };

        await produceCollection.updateOne(
            { _id: new ObjectId(produceId) }, 
            { $push: { comments: comment } }
        );
        
        res.status(200).json({ success: true });
    } catch (e) { 
        res.status(500).json({ error: "Comment failed" });
    }
});

// ==============================================================================
// DELETE PATHS
// ==============================================================================

// Delete a listing
router.delete('/:id', authenticateJWT, async (req, res) => {
    try {
        const produceCollection = getProduce();
        const produceId = req.params.id;
        const userId = req.userId;

        const item = await produceCollection.findOne({ _id: new ObjectId(produceId) });
        if (!item) return res.status(404).json({ error: "Listing not found" });
        
        // Only the seller can delete
        if (item.sellerId !== userId) return res.status(403).json({ error: "Unauthorized" });

        await produceCollection.deleteOne({ _id: new ObjectId(produceId) });
        res.status(200).json({ success: true });
    } catch (e) {
        res.status(500).json({ error: "Delete failed" });
    }
});

module.exports = router;