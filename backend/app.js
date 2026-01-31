const express = require('express');
const cors = require('cors');
const path = require('path');

const { connectToMongoDB, closeMongoDB, client } = require('./database/mongodb');

const authRoutes = require('./auth_path');
const produceRoutes = require('./crops_path'); // Renamed from eventRoutes
const marketRoutes = require('./market_path'); // NEW: Handles prices/requests

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000', 'https://farmbox.onrender.com', 'https://independent-irita-clubspot-9e43f2fa.koyeb.app'],
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.set('trust proxy', 1);
app.use(express.static(path.join(__dirname, '../frontend')));

// --- MOUNT ROUTES ---

// 1. Auth: /api/auth/google, /api/auth/me
app.use('/api/auth', authRoutes);

// 2. Produce Feed: /api/produce, /api/produce/interest (Matches api.js)
app.use('/api/produce', produceRoutes);

// 3. Market Data: /api/market/prices, /api/market/requests (Matches api.js)
app.use('/api/market', marketRoutes);

// Catch-all for SPA (Vue/React/Vanilla)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

module.exports = { app, connectToMongoDB, closeMongoDB, client };