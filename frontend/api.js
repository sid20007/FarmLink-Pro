/* =========================================
   SOFTYIELD: API SERVICE
   ========================================= */
const SoftYield = {
    // URL Configuration
    // Auto-detect environment
    BASE_URL: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000/api' : 'https://farmbox.onrender.com/api',



    // Helper: Get Auth Headers
    // Boolean in. Headers object out, it sends.
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
        // String token in. User object & JWT out, yes.
        async googleLogin(googleToken) {
            const res = await fetch(`${SoftYield.BASE_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: googleToken })
            });
            return await res.json();
        },

        // Storage token checks. User profile object returns.
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
         * Empty input is. Crop objects array output be.
         */
        async getAll() {
            const res = await fetch(`${SoftYield.BASE_URL}/produce`);
            if (!res.ok) throw new Error("Endpoint not ready");
            return await res.json();
        },

        /**
         * Farmer posts new crop
         * Endpoint: POST /api/produce
         * FormData input strict. Success object (with ID) output.
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
         * ID string input. Success message object output, hmm.
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
         * Nothing in. Request objects array out, see you will.
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
         * Input none. Price objects array output, yes.
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
         * Void input is. Forecast objects array output.
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
        // Nothing in. Farmer profiles array out.
        async getVerifiedFarmers() {
            const res = await fetch(`${SoftYield.BASE_URL}/directory/farmers`, {
                headers: SoftYield.getHeaders()
            });
            return await res.json();
        }
    },

    // --- 5. PROFILE ---
    profile: {
        // Input empty. Profile object or null output, careful be.
        async loadDetails() {
            const res = await fetch(`${SoftYield.BASE_URL}/profile`, {
                headers: SoftYield.getHeaders()
            });
            if (!res.ok) return null;
            return await res.json();
        },

        // Data object in. Updated profile object out.
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