# AgriDirect Backend API

This is the backend for the AgriDirect application, built with Node.js, Express, and MongoDB.

## 🚀 Quick Start (For Teammates)

1.  **Navigate to backend:**
    ```bash
    cd backend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Server:**
    ```bash
    npm start
    ```
    - The server will start on `http://localhost:5000`.
    - **Database:** It uses an In-Memory MongoDB. You **DO NOT** need to install MongoDB. It resets every time you restart the server.
    - **Data:** It automatically adds 2 Farmers and 4 Crops when it starts.

---

## 📡 API Endpoints

### Authentication
-   **Register User:** `POST /api/auth/register`
    -   Body: `{ "name": "...", "email": "...", "password": "...", "role": "farmer", "location": "..." }`
-   **Login:** `POST /api/auth/login`
    -   Body: `{ "email": "...", "password": "..." }`
    -   Returns: `{ "token": "..." }` (Save this token!)

### Crops (Marketplace)
-   **Get All Crops:** `GET /api/crops`
    -   Filter by Location: `GET /api/crops?location=Karnataka`
    -   Filter by Name: `GET /api/crops?name=Tomato`
-   **Add Crop:** `POST /api/crops`
    -   **Headers:** `x-auth-token: <YOUR_TOKEN>`
    -   Body: `{ "name": "Rice", "price": 50, "quantity": 100, "quality": "A", "location": "Karnataka" }`

### Real-Time
-   **Socket Event:** Listen for `cropAdded` event to get instant updates on new listings.
