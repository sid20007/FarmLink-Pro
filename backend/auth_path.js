const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getUsersCollection } = require('./database/mongodb');
const { verifyGoogleToken } = require('./auth/google.auth');
const { signTokenJWT, authenticateJWT } = require('./auth/middleware');

// ==============================================================================
// POST PATHS
// ==============================================================================

router.post('/google', async (req, res) => {
    try {
        console.log("Received Auth Request");
        const usersCollection = getUsersCollection();
        // Get role from request, default to 'farmer' for safety if not provided
        const { token: googleToken, role = 'farmer' } = req.body;

        const googleUser = await verifyGoogleToken(googleToken);
        if (!googleUser) {
            console.warn("Verification returned null");
            return res.status(401).json({ error: "Invalid Token" });
        }

        // ROLE ENFORCEMENT LOGIC
        // Check if user exists
        const existingUser = await usersCollection.findOne({ email: googleUser.email });

        if (existingUser) {
            // If user exists, check if their role matches the requested login type
            // Legacy Note: Existing users without 'role' field are treated as 'farmer'
            const currentRole = existingUser.role || 'farmer';

            if (currentRole !== role) {
                // Determine error message based on role mismatch
                const errorMsg = role === 'buyer'
                    ? "Account exists as Farmer. Please use Farmer Login."
                    : "Account exists as Buyer. Please use Buyer Portal.";

                console.warn(`Role Mismatch: ${googleUser.email} is ${currentRole} but tried ${role} login.`);
                return res.status(403).json({ error: errorMsg, roleMismatch: true });
            }
        }

        console.log(`Updating DB for: ${googleUser.email} as ${role}`);
        const result = await usersCollection.findOneAndUpdate(
            { email: googleUser.email },
            {
                $set: {
                    name: googleUser.name,
                    picture: googleUser.picture,
                    lastLogin: new Date(),
                    role: role // Ensure role is set/refreshed
                },
                $setOnInsert: { joinedEvents: [], createdAt: new Date() }
            },
            { upsert: true, returnDocument: 'after' }
        );
        console.log("DB Update Success");

        const user = result.value || result;
        // Sign token with role info (optional, but good practice)
        const token = signTokenJWT(user._id, user.name);

        res.status(200).json({
            success: true,
            token: token,
            user: {
                _id: user._id,
                name: user.name,
                picture: user.picture,
                role: user.role, // Send back role
                joinedEvents: user.joinedEvents
            }
        });
    } catch (e) {
        console.error("Auth Route Critical Error:", e);
        res.status(500).json({ error: "Authentication failed" });
    }
});

router.post('/logout', (req, res) => {
    res.status(200).json({ success: true, message: "Logged out successfully" });
});

// ==============================================================================
// GET PATHS
// ==============================================================================

router.get('/me', authenticateJWT, async (req, res) => {
    try {
        const usersCollection = getUsersCollection();
        const user = await usersCollection.findOne(
            { _id: new ObjectId(req.userId) },
            { projection: { _id: 1, name: 1, picture: 1, joinedEvents: 1 } }
        );
        if (!user) return res.status(401).json({ error: "User not found" });
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: "Session check failed" });
    }
});

module.exports = router;