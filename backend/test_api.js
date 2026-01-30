const fetch = require('node-fetch'); // Or native fetch in Node 18+

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
    console.log("🚀 Starting API Tests...\n");

    // 1. Test Health Check
    try {
        const res = await fetch('http://localhost:5000/');
        const data = await res.json();
        console.log(`✅ Server Health: ${data.message}`);
    } catch (e) {
        console.error("❌ Server is NOT running!");
        return;
    }

    // 2. Register User
    let token = "";
    console.log("\n👤 Testing Registration...");
    const userPayload = {
        name: "Test Farmer",
        email: `testfarmer_${Date.now()}@example.com`,
        password: "password123",
        role: "farmer",
        location: "Karnataka"
    };

    const regRes = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
    });
    const regData = await regRes.json();

    if (regData.token) {
        token = regData.token;
        console.log("✅ Registration Successful! Token received.");
    } else {
        console.log("❌ Registration Failed:", regData);
    }

    // 3. Add Crop (Protected Route)
    if (token) {
        console.log("\n🌾 Testing Add Crop (Protected)...");
        const cropPayload = {
            name: "Test Rice",
            price: 50,
            quantity: 1000,
            quality: "A",
            location: "Karnataka"
        };

        const cropRes = await fetch(`${BASE_URL}/crops`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify(cropPayload)
        });
        const cropData = await cropRes.json();

        if (cropRes.status === 200) {
            console.log(`✅ Crop Added: ${cropData.name} @ ₹${cropData.price}`);
        } else {
            console.log("❌ Add Crop Failed:", cropData);
        }
    }

    // 4. Get Crops (Filtered)
    console.log("\n🔍 Testing Get Crops (Filter: Karnataka)...");
    const getRes = await fetch(`${BASE_URL}/crops?location=Karnataka`);
    const crops = await getRes.json();

    if (Array.isArray(crops)) {
        console.log(`✅ Fetched ${crops.length} crops from Karnataka.`);
        // console.log(crops.map(c => `${c.name} - ₹${c.price}`));
    } else {
        console.log("❌ Get Crops Failed:", crops);
    }

    console.log("\n✨ Tests Completed!");
}

testAPI();
