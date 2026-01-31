const { dbUrl } = require('../config/config.js');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const DATABASE_NAME = "softyield_agri";


let client = null;
let db = null;


// --- Collection References ---
let usersCollection;      // Auth & Profiles
let produceCollection;    // Farmer Listings (was events)
let requestsCollection;   // Buyer Demands
let pricesCollection;     // Mandi Rates (Read Only for users)
let forecastsCollection;  // AI Predictions (Read Only for users)

/**
 * Connects to MongoDB (Local -> Fallback to Memory)
 * and initializes all agricultural collections.
 */
async function connectToMongoDB() {
    try {
        console.log("Attempting local MongoDB connection...");
        // 1. Try Local/Cloud URL
        client = new MongoClient(dbUrl, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: false, // CHANGED: Must be false to allow Text Indexes
                deprecationErrors: true,
            }
        });
        await client.connect();
        console.log("Connected to MongoDB successfully!");
        await initializeCollections(client); // Await this to ensure indexes are built
        return true;

    } catch (error) {
        console.warn('Local MongoDB failed. Switching to In-Memory DB...');
        // console.error(error); // Uncomment to debug specific connection errors
        try {
            // 2. Fallback: In-Memory DB
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();

            console.log(`Fallback: Connected to In-Memory DB at ${uri}`);
            client = new MongoClient(uri); // In-memory doesn't use strict mode by default
            await client.connect();

            await initializeCollections(client);

            // Seed data because In-Memory is empty on start
            await seedSystemData();
            return true;

        } catch (memErr) {
            console.error('Fatal: Database connection failed completely.', memErr);
            return false;
        }
    }
}

async function initializeCollections(connectedClient) {
    db = connectedClient.db(DATABASE_NAME);

    usersCollection = db.collection("users");
    produceCollection = db.collection("produce");
    requestsCollection = db.collection("requests");
    pricesCollection = db.collection("prices");
    forecastsCollection = db.collection("forecasts");

    // Indexes for performance
    // Note: This requires strict: false in ServerApi
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await produceCollection.createIndex({ location: "text", title: "text" });
}

// --- Seeder for System Data (Prices/Forecasts) ---
async function seedSystemData() {
    const priceCount = await pricesCollection.countDocuments();
    if (priceCount === 0) {
        console.log("Seeding Market Data...");
        await pricesCollection.insertMany([
            { item: 'Tomato', price: '₹35-42', trend: 'stable', date: new Date() },
            { item: 'Onion (Red)', price: '₹28-32', trend: 'down', date: new Date() },
            { item: 'Potato', price: '₹22-25', trend: 'up', date: new Date() },
            { item: 'Green Chilli', price: '₹65-70', trend: 'up', date: new Date() },
            { item: 'Garlic', price: '₹120-140', trend: 'stable', date: new Date() }
        ]);

        await forecastsCollection.insertMany([
            { item: 'Tomato', prediction: 'Prices expected to rise due to heavy rains in Nashik.', color: 'green' },
            { item: 'Onion', prediction: 'New harvest arriving; prices will stabilize.', color: 'red' }
        ]);

        await requestsCollection.insertMany([
            { crop: 'Red Onions', quantity: '500 kg', buyer: 'BigBasket Hub', verified: true, maxPrice: 35 },
            { crop: 'Potatoes', quantity: '1 Ton', buyer: 'Local Chips Co', verified: true, maxPrice: 22 }
        ]);
    }

    // Seed Produce (Farmer Listings) - Always check if empty
    const produceCount = await produceCollection.countDocuments();
    if (produceCount === 0) {
        console.log("Seeding Produce Listings...");
        await produceCollection.insertMany([
            {
                title: 'Fresh Tomatoes',
                price: 22,
                unit: 'kg',
                quantity: '500 kg',
                location: 'Pune, MH',
                sellerName: 'Rajesh K',
                sellerId: new ObjectId(), // Dummy ID
                image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=60&w=600',
                description: 'Farm-fresh hybrid tomatoes. Juicy, firm, and perfect for retail or processing.',
                createdAt: new Date(),
                interestedBuyers: [],
                comments: []
            },
            {
                title: 'Basmati Rice',
                price: 65,
                unit: 'kg',
                quantity: '1 Ton',
                location: 'Nashik, MH',
                sellerName: 'Amit Singh',
                sellerId: new ObjectId(),
                image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=60&w=600',
                description: 'Extra long grain Basmati rice. Aged for 12 months for superior aroma.',
                createdAt: new Date(),
                interestedBuyers: [],
                comments: []
            },
            {
                title: 'Alphanso Mango',
                price: 120,
                unit: 'doz',
                quantity: '500 Doz',
                location: 'Ratnagiri, MH',
                sellerName: 'Ratna Farms',
                sellerId: new ObjectId(),
                image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=60&w=600',
                description: 'Premium GI-tagged Ratnagiri Alphanso. Naturally ripened.',
                createdAt: new Date(),
                interestedBuyers: [],
                comments: []
            },
            {
                title: 'Red Onions',
                price: 18,
                unit: 'kg',
                quantity: '2 Tons',
                location: 'Nashik, MH',
                sellerName: 'Suresh P',
                sellerId: new ObjectId(),
                image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=60&w=600',
                description: 'High-quality Nashik Red Onions. Pungent flavor, dry outer skin.',
                createdAt: new Date(),
                interestedBuyers: [],
                comments: []
            }
        ]);
    }
}

async function closeMongoDB() {
    if (client) await client.close();
}

// --- Exports ---
module.exports = {
    connectToMongoDB,
    closeMongoDB,
    ObjectId,
    client,
    getUsersCollection: () => usersCollection,
    getProduceCollection: () => produceCollection,
    getRequestsCollection: () => requestsCollection,
    getPricesCollection: () => pricesCollection,
    getForecastsCollection: () => forecastsCollection
};