const express = require('express');
const router = express.Router();
const { getRequestsCollection, getPricesCollection, getForecastsCollection } = require('./database/mongodb');

router.get('/requests', async (req, res) => {
    try {
        const requests = await getRequestsCollection().find({}).toArray(); // FIXED
        res.json(requests);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch requests" });
    }
});

router.get('/prices', async (req, res) => {
    try {
        const prices = await getPricesCollection().find({}).toArray(); // FIXED
        res.json(prices);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch prices" });
    }
});

router.get('/forecast', async (req, res) => {
    try {
        const forecast = await getForecastsCollection().find({}).toArray(); // FIXED
        res.json(forecast);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch forecast" });
    }
});

module.exports = router;