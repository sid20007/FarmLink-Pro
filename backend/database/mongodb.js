const { dbUrl } = require('../config/config.js');
//=============
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const DATABASE_NAME = "softyield";

// Changed to 'let' to allow fallback replacement
let client = new MongoClient(dbUrl, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db;
let usersCollection;
let eventsCollection;
//=============

// Exported connection function
async function connectToMongoDB() {
    try {
        console.log("Attempting local MongoDB connection...");
        await client.connect();
        console.log("Connected to MongoDB successfully! (Local)");

        db = client.db(DATABASE_NAME);
        usersCollection = db.collection("users");
        eventsCollection = db.collection("events");
        await usersCollection.createIndex({ email: 1 }, { unique: true });
        return true;
    } catch (error) {
        console.warn('Local MongoDB failed connection. Switching to In-Memory DB...');
        try {
            // Lazy load memory server to avoid overhead if not needed
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();

            console.log(`Fallback: Connecting to In-Memory DB at ${uri}`);

            // Create NEW client for the fallback URI
            client = new MongoClient(uri);
            await client.connect();

            // Update exports logic so other modules get the live client (if they access it via module.exports)
            // Note: Modules that already destructured { client } = require(...) will hold the OLD client.
            // But our helper functions below use the module-level variables (usersCollection), so they WILL work.
            if (module.exports) module.exports.client = client;

            db = client.db(DATABASE_NAME);
            usersCollection = db.collection("users");
            eventsCollection = db.collection("events");

            // Seed basic data? Optional but helpful.
            return true;

        } catch (memErr) {
            console.error('Fatal: Both Local and Memory DB failed to start.', memErr);
            return false;
        }
    }
}

// Helper functions to get the collections safely
function getUsersCollection() {
    if (!usersCollection) {
        throw new Error("Database not connected yet! Call connectToMongoDB first.");
    }
    return usersCollection;
}

function getEventsCollection() {
    if (!eventsCollection) {
        throw new Error("Database not connected yet!");
    }
    return eventsCollection;
}

async function closeMongoDB() {
    if (client) await client.close();
}

module.exports = {
    connectToMongoDB, closeMongoDB, client, ObjectId, getUsersCollection, getEventsCollection
}