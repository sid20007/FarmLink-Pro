require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Crop = require('./models/Crop');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
};

const seedData = async (connectionUri) => {
    // If a URI is passed, connect to it (used when running standalone)
    if (connectionUri) {
        try {
            await mongoose.connect(connectionUri);
            console.log('MongoDB Connected for Seeding');
        } catch (err) {
            console.error('Database connection error:', err.message);
            return;
        }
    }

    try {
        // Clear existing data
        await User.deleteMany({});
        await Crop.deleteMany({});
        console.log('Data Cleared');

        // Create Users
        const users = await User.create([
            {
                name: "Ramesh Kumar",
                email: "ramesh@farmer.com",
                password: "password123", // In real app, hash this!
                role: "farmer",
                location: "Karnataka"
            },
            {
                name: "Suresh Patel",
                email: "suresh@farmer.com",
                password: "password123", // In real app, hash this!
                role: "farmer",
                location: "Gujarat"
            },
            {
                name: "Big Basket Buyer",
                email: "buyer@bigbasket.com",
                password: "password123", // In real app, hash this!
                role: "buyer",
                location: "Bangalore"
            }
        ]);

        console.log('Users Created');

        // Create Crops
        await Crop.create([
            {
                farmer: users[0]._id, // Ramesh
                name: "Tomato",
                price: 40,
                quantity: 100,
                quality: "A",
                location: "Karnataka"
            },
            {
                farmer: users[0]._id, // Ramesh
                name: "Wheat",
                price: 25,
                quantity: 500,
                quality: "B",
                location: "Karnataka"
            },
            {
                farmer: users[1]._id, // Suresh
                name: "Onion",
                price: 30,
                quantity: 200,
                quality: "A",
                location: "Gujarat"
            },
            {
                farmer: users[1]._id, // Suresh
                name: "Potato",
                price: 20,
                quantity: 300,
                quality: "C",
                location: "Gujarat"
            }
        ]);

        console.log('Crops Created');
        console.log('Data Imported!');

    } catch (err) {
        console.error(err);
    }
};

module.exports = seedData;

// Run if called directly
if (require.main === module) {
    require('dotenv').config();
    seedData(process.env.MONGO_URI).then(() => {
        mongoose.disconnect();
        process.exit();
    });
}
