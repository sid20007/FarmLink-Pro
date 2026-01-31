# 🌾 SoftYield

> Real-time market intelligence and direct market access for farmers.

**Problem Statement ID:** CS03AE
**Team Name:** KENBRISELLERIS
**College:** St. Aloysius (Deemed to be University) - School of Engineering

## 👥 Team Members
- Shawn
- Sid
- Chris
- Giselle

---

## 💡 Problem Statement
Creating a system for real-time market intelligence and direct market access for farmers.

## 🚀 Proposed Solution
A platform where farmers sell directly to buyers and check live market prices to maximize their profit.

## ✨ Innovation
We don't buy the crop — we give the farmer the **data** and the **connection** to sell it themselves, maximizing their freedom and profit.

---

## 🛠️ Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | HTML, Tailwind CSS, Vanilla JS (Smart Environment Aware) |
| Backend | Node.js, Express.js |
| Database | **MongoDB (Native Driver)** + **In-Memory Fallback** |
| Auth | Google OAuth 2.0 + JWT Sessions |
| Storage | Cloudinary (Image Hosting) |
| Hosting | Render(right now) |

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- Google Cloud Console project with OAuth credentials
- Cloudinary Account (for image uploads)

### 1. Clone & Install
```bash
git clone https://github.com/sid20007/SoftYield.git
cd FarmLink-Pro
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
# Auth & Security
GOOGLE_CLIENT_ID=your_google_client_id
JWT_SECRET=your_jwt_secret_key

# Database (Optional - defaults to In-Memory if empty)
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/softyield

# Image Storage (Required for uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run Locally
```bash
npm start
```
- Open [http://localhost:5000](http://localhost:5000)
- **Zero-Config Mode:** If no MongoDB URL is provided, the app automatically starts an **In-Memory Database** and seeds it with demo data (Market Rates, Forecasts).

### 4. Deploy to Render
1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Add environment variables in Render dashboard
4. Add `https://farmbox.onrender.com` to Google OAuth authorized origins

---

## 📱 Live Features (Implemented)

### 1. Smart Architecture
- **Auto-Failover Database:** The backend detects if a real MongoDB connection fails and instantly spins up an ephemeral **In-Memory MongoDB** server. No local DB installation required for testing.
- **Environment Detection:** The frontend (`api.js`, `login.html`) automatically switches API endpoints between `localhost` and `Render` production URLs based on where it's running.

### 2. Farmer Dashboard
- **Create Listings:** Full CRUD support with **Image Uploads** (via Cloudinary).
- **Market Intelligence:** View seeded Mandi Rates and Price Forecasts stored in the database.
- **Buyer Feed:** View active requests from verified buyers (BigBasket, Local Chips Co, etc.).

### 3. Consumer/Buyer Portal
- **Interactive Feed:** Lazy-loaded product feed with "Interest" signaling.
- **Direct Connect:** Contact farmers directly via WhatsApp/Phone integration.
- **Optimized for Low-End Devices:**
  - Reduced Motion support
  - 4x Preconnect optimizations
  - Lazy-loaded images (60% bandwidth reduction)




---

## 📸 Visual Tour

### User Experience
| Buyer Profile | Secure Login |
|:---:|:---:|
| ![Buyer Profile](assets/screenshots/buyer_profile.png)<br>_Personalized dashboard for tracking orders._ | ![Buyer Login](assets/screenshots/buyer_login.png)<br>_Secure Google OAuth authentication._ |

| Farmer Portal | Market Insights |
|:---:|:---:|
| ![Farmer Login](assets/screenshots/farmer_login.png)<br>_Dedicated portal for farmers._ | ![Market Trends](assets/screenshots/market_trends.png)<br>_Real-time price trends and AI forecasts._ |

### Product Details
![Product Detail](assets/screenshots/product_detail.png)
*Detailed view of fresh produce with direct farmer contact options.*

### Dashboard & Features
![Buyer Dashboard](assets/screenshots/buyer_dashboard_full.png)
*Comprehensive buyer dashboard featuring verified farmers, bulk discounts, and fresh listings.*

| Features | |
|:---:|:---:|
| ![Language Selection](assets/screenshots/language_selection.png)<br>_Multilingual support._ | ![Category Filters](assets/screenshots/category_filters.png)<br>_Quick category filtering._ |
| ![Verified Farmers](assets/screenshots/verified_farmers_banner.png)<br>_Trusted sources guaranteed._ | ![Bulk Orders](assets/screenshots/bulk_orders_banner.png)<br>_Discounts on bulk purchases._ |

---


## 🔮 Future Roadmap (Research Phase)
### 4. 🧠 AI & Machine Learning
- **Price Prediction Model:** A trained regression model (`ml_model/ML_model.ipynb`) exists in the repository.
- **Goal:** To integrate this model into the backend for real-time price forecasting based on the dataset (`tomato (3).csv`).
- **Current Status:** Model trained and ready for future deployment.

---

## 🎯 Final Question
> "How will you convince a traditional farmer to trust your digital platform over a middleman they have known for 20 years?"

**Our Answer:** By proving transparency. Show them the real-time prices, let them compare what they were offered vs. what the market pays, and let them keep 100% of the profit. Trust is earned through visible results.

---

## 📄 License
MIT License - See [LICENSE](LICENSE)
