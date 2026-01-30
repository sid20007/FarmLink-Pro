const { connectToMongoDB, closeMongoDB } = require('./database/mongodb');
require('dotenv').config();

console.log("Health Check Script Starting...");
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

async function run() {
    try {
        console.log("Testing MongoDB Connection...");
        const success = await connectToMongoDB();
        if (success) {
            console.log("DB Connection: SUCCESS");
        } else {
            console.error("DB Connection: FAILED");
        }
    } catch (err) {
        console.error("DB Error:", err);
    } finally {
        await closeMongoDB();
        console.log("Done.");
    }
}

run();
