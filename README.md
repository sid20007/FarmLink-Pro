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
| Frontend | HTML, Tailwind CSS, Vanilla JS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | Google OAuth 2.0 |
| Hosting | Render |

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Google Cloud Console project with OAuth credentials

### 1. Clone & Install
```bash
git clone https://github.com/sid20007/FarmLink-Pro.git
cd FarmLink-Pro
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
GOOGLE_CLIENT_ID=your_google_client_id
JWT_SECRET=your_jwt_secret_key
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/softyield
```

### 3. Run Locally
```bash
npm start
```
Open [http://localhost:5000](http://localhost:5000)

### 4. Deploy to Render
1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Add environment variables in Render dashboard
4. Add `https://farmbox.onrender.com` to Google OAuth authorized origins

---

## 📱 Features
- **Farmer Dashboard** — Manage listings, view orders, track earnings
- **Live Mandi Rates** — Real-time crop price updates
- **Buyer Portal** — Browse and contact farmers directly
- **Multi-language** — English & Kannada support
- **Mobile-first** — Optimized for low-end devices

---

## 🎯 Final Question
> "How will you convince a traditional farmer to trust your digital platform over a middleman they have known for 20 years?"

**Our Answer:** By proving transparency. Show them the real-time prices, let them compare what they were offered vs. what the market pays, and let them keep 100% of the profit. Trust is earned through visible results.

---

## 📄 License
MIT License - See [LICENSE](LICENSE)
