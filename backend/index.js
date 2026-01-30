require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Attach Socket.io to request
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/crops', require('./routes/crops'));

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'AgriDirect Backend API is running!' });
});

// Database Connection
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    try {
        // Try connecting to local DB first if defined
        if (process.env.MONGO_URI && !process.env.USE_MEMORY_DB) {
            try {
                await mongoose.connect(process.env.MONGO_URI);
                console.log('MongoDB Connected (Local)');
                return;
            } catch (err) {
                console.log('Local MongoDB failed, falling back to Memory Server...');
            }
        }

        // Fallback to Memory Server
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        console.log(`MongoDB Connected (In-Memory) at ${uri}`);

        // Seed data automatically since it's fresh
        console.log('Seeding in-memory database...');
        const seedData = require('./seed');
        await seedData();
    } catch (err) {
        console.error('Database connection error:', err.message);
    }
};

// Start Server
server.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await connectDB();
});
