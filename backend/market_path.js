const express = require('express');
const router = express.Router();
const { getRequestsCollection, getPricesCollection, getForecastsCollection } = require('./database/mongodb');

// GET /api/market/requests
// Returns Buy Requests for the "Demand" tab
router.get('/requests', async (req, res) => {
    try {
        const requests = await getRequests().find({}).toArray();
        res.json(requests);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch requests" });
    }
});

// GET /api/market/prices
// Returns Mandi Rates for the "Market" tab
router.get('/prices', async (req, res) => {
    try {
        const prices = await getPrices().find({}).toArray();
        res.json(prices);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch prices" });
    }
});

// GET /api/market/forecast
// Returns AI predictions
router.get('/forecast', async (req, res) => {
    try {
        const forecast = await getForecasts().find({}).toArray();
        res.json(forecast);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch forecast" });
    }
});

module.exports = router;