/* =========================================
   AGRIFLOW: API SERVICE (Source of Truth)
   ========================================= */
const SoftYield = {
    // URL Configuration
    BASE_URL: 'http://localhost:3000/api',


    // Helper: Get Auth Headers
    getHeaders(isFormData = false) {
        const token = localStorage.getItem('fida_token');
        const headers = { 'Authorization': `Bearer ${token}` };
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }
        return headers;
    },

    // --- 1. AUTHENTICATION ---
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

    // --- 2. FARMER PRODUCE (The Feed) ---
    produce: {
        /**
         * Get all produce listings
         * Endpoint: GET /api/produce
         */
        async getAll() {

            // Check if backend path exists, else fallback to mock for dev
            try {
                const res = await fetch(`${SoftYield.BASE_URL}/produce`);
                if (!res.ok) throw new Error("Endpoint not ready");
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
         * Farmer posts new crop
         * Endpoint: POST /api/produce
         */
        async create(formData) {
            const res = await fetch(`${SoftYield.BASE_URL}/produce`, {
                method: 'POST',
                headers: SoftYield.getHeaders(true), // True = FormData (no Content-Type header)
                body: formData
            });
            return await res.json();
        },

        /**
         * Buyer contacts seller
         * Endpoint: POST /api/produce/interest
         */
        async contactSeller(produceId) {
            const res = await fetch(`${SoftYield.BASE_URL}/produce/interest`, {
                method: 'POST',
                headers: SoftYield.getHeaders(),
                body: JSON.stringify({ produceId })
            });
            return await res.json();
        }
    },

    // --- 3. MARKET DATA (Realtime & System) ---
    market: {
        /**
         * Get active buy requests
         * Endpoint: GET /api/market/requests
         */
        async getBuyRequests() {
            const res = await fetch(`${SoftYield.BASE_URL}/market/requests`, {
                headers: SoftYield.getHeaders()
            });
            return await res.json();
        },

        /**
         * Get current Mandi Rates
         * Endpoint: GET /api/market/prices
         */
        async getPrices() {
            const res = await fetch(`${SoftYield.BASE_URL}/market/prices`, {
                headers: SoftYield.getHeaders()
            });
            return await res.json();
        },

        /**
         * Get AI Price Forecasts
         * Endpoint: GET /api/market/forecast
         */
        async getPriceForecast() {
            const res = await fetch(`${SoftYield.BASE_URL}/market/forecast`, {
                headers: SoftYield.getHeaders()
            });
            return await res.json();
        }
    },

    // --- 4. DIRECTORY ---
    directory: {
        async getVerifiedFarmers() {
            const res = await fetch(`${SoftYield.BASE_URL}/directory/farmers`, {
                headers: SoftYield.getHeaders()
            });
            return await res.json();
        }
    },

    // --- 5. PROFILE ---
    profile: {
        async loadDetails() {
            const res = await fetch(`${SoftYield.BASE_URL}/profile`, {
                headers: SoftYield.getHeaders()
            });
            if(!res.ok) return null;
            return await res.json();
        },

        async updateDetails(data) {
            const res = await fetch(`${SoftYield.BASE_URL}/profile`, {
                method: 'POST',
                headers: SoftYield.getHeaders(),
                body: JSON.stringify(data)
            });
            return await res.json();

        }
    }
};

window.SoftYield = SoftYield;