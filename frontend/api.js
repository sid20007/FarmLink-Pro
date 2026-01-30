/* =========================================
   FIDA: API SERVICE (Farmer & Buyer Feeds)
   ========================================= */
const SoftYield = {
    // URL Configuration (Update this if you change your Vercel/Render URL)
    BASE_URL: 'https://farmbox.onrender.com/api',

    // Helper: Get Auth Headers
    getHeaders(isFormData = false) {
        const token = localStorage.getItem('fida_token');
        const headers = { 'Authorization': `Bearer ${token}` };
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }
        return headers;
    },

    // --- 1. AUTHENTICATION (Preserved) ---
    auth: {
        async googleLogin(googleToken) {
            const res = await fetch(`${SoftYield.BASE_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: googleToken })
            });
            return await res.json();
        },

        async getMe() {
            const token = localStorage.getItem('fida_token');
            if (!token) throw new Error('No token found');

            const res = await fetch(`${SoftYield.BASE_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Session invalid');
            return await res.json();
        }
    },

    // --- 2. FARMER PRODUCE (Renovated from 'Events') ---
    produce: {
        /**
         * Get all produce listings (The Marketplace)
         * API: GET /produce
         */
        async getAll() {
            // Check if backend path exists, else fallback to mock for dev
            try {
                const res = await fetch(`${SoftYield.BASE_URL}/produce`);
                if(!res.ok) throw new Error("Endpoint not ready");
                return await res.json();
            } catch (e) {
                console.warn("Using Mock Data for Produce");
                return [
                    { _id: '1', title: 'Organic Tomatoes', price: 40, unit: 'kg', location: 'Pune', image: 'https://placehold.co/600x400/orange/white?text=Tomato', sellerName: 'Ramesh Farms' },
                    { _id: '2', title: 'Fresh Basmati Rice', price: 120, unit: 'kg', location: 'Nashik', image: 'https://placehold.co/600x400/yellow/white?text=Rice', sellerName: 'Suresh Agro' }
                ];
            }
        },

        /**
         * Farmer posts new crop/produce
         * API: POST /produce
         * Form Data: title, price, quantity, location, image
         */
        async create(formData) {
            const res = await fetch(`${SoftYield.BASE_URL}/produce`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('fida_token')}` },
                body: formData
            });
            return await res.json();
        },

        /**
         * Buyer expresses interest in produce
         * API: POST /produce/interest
         */
        async contactSeller(produceId) {
            // Renamed from 'join' to 'contactSeller'
            const res = await fetch(`${SoftYield.BASE_URL}/produce/interest`, {
                method: 'POST',
                headers: SoftYield.getHeaders(),
                body: JSON.stringify({ produceId })
            });
            return await res.json();
        }
    },

    // --- 3. MARKET DATA (Farmer Feed Components) ---
    market: {
        /**
         * Database of verified buy requests
         * (What companies/wholesalers are looking for)
         */
        async getBuyRequests() {
            // MOCK: Waiting for backend implementation
            return new Promise(resolve => {
                setTimeout(() => resolve([
                    { _id: 'br1', crop: 'Red Onions', quantity: '500 kg', buyer: 'BigBasket Hub', verified: true, maxPrice: 35 },
                    { _id: 'br2', crop: 'Potatoes (Chip Grade)', quantity: '1 Ton', buyer: 'Local Chips Co', verified: true, maxPrice: 22 },
                    { _id: 'br3', crop: 'Ginger', quantity: '200 kg', buyer: 'Mandi Agent #4', verified: false, maxPrice: 150 }
                ]), 400); // Simulate network delay
            });
        },

        /**
         * Database of current vegetable prices (Mandi Rates)
         */
        async getPrices() {
            // MOCK: Live Mandi Rates
            return Promise.resolve([
                { item: 'Tomato', price: '₹30-40', trend: 'stable' },
                { item: 'Onion', price: '₹25-30', trend: 'down' },
                { item: 'Potato', price: '₹20-22', trend: 'up' },
                { item: 'Chilli', price: '₹60-70', trend: 'up' }
            ]);
        },

        /**
         * Database of forecasted prices (AI/Algo)
         */
        async getPriceForecast() {
            // MOCK: AI Predictions
            return Promise.resolve([
                { item: 'Tomato', prediction: 'Rise expected in 3 days due to rain', color: 'green' },
                { item: 'Onion', prediction: 'Prices will drop as new supply arrives', color: 'red' }
            ]);
        }
    },

    // --- 4. DIRECTORY (Buyer Feed Components) ---
    directory: {
        /**
         * Database of verified farmers
         */
        async getVerifiedFarmers() {
            // MOCK: List of farmers for buyers to browse
            return Promise.resolve([
                { _id: 'f1', name: 'Rajesh Kumar', location: 'Satara', rating: 4.8, crops: ['Wheat', 'Sugarcane'], verified: true },
                { _id: 'f2', name: 'Green Earth Organics', location: 'Pune', rating: 4.5, crops: ['Spinach', 'Methi'], verified: true },
                { _id: 'f3', name: 'Amit Patil', location: 'Kolhapur', rating: 3.9, crops: ['Rice'], verified: false }
            ]);
        }
    },

    // --- 5. PROFILE ---
    profile: {
        async loadDetails(){
            // Retaining your original mock
            return { phone: '9999', city: 'pune', role: 'Farmer' };
        }
    }
};

window.SoftYield = SoftYield;