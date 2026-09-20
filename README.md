# Right2Know — Instant Scholarship Discovery Platform

> **Helping Indian students discover scholarships they already qualify for in under two minutes.**

---

## 📌 Problem Statement

Every year, thousands of crores in government, corporate CSR, and philanthropic scholarship funds go unclaimed because students either:
1. Do not know which schemes they are eligible for.
2. Get overwhelmed by dense, fragmented eligibility criteria on multiple government and university portals.
3. Waste hours navigating confusing multi-step portals only to find out they were ineligible from the start.

## 💡 Solution

**Right2Know** is an open-access, civic-tech web application that uses **deterministic rule-based matching** to evaluate a student's academic discipline, year of study, domicile state, social category, income ceiling, and CGPA in milliseconds.

- **Zero Authentication Required**: Instant access without signups or phone numbers.
- **Explainable Matches**: Every scholarship clearly explains *why* the student matched.
- **Dynamic Urgency Deadlines**: Categorizes deadlines into Urgent, Warning, and Rolling states.
- **AI Guidance Assistant**: An optional, safe assistant for questions about documents, application tips, and deadlines.

---

## 🏛️ System Architecture

```text
React Frontend (Vite + Tailwind)
      │
      │ REST / HTTPS
      ▼
Express Backend (Node.js)
      │
      ├───────────────────────────────┐
      ▼                               ▼
server/data/schemes.json       Optional LLM Provider
      │                        (Gemini / OpenAI / OpenRouter)
      ▼                               │
matcher.js (Pure Function)            ▼
      │                        Non-blocking Chat Drawer
      ▼
Deterministic Results
(Match Score, Reasons, Deadlines)
```

### ⚡ Core Architectural Principle

> **The deterministic scholarship matcher is the critical path.**
> 
> Scholarship matching NEVER depends on the LLM. If the AI provider is unavailable, offline, or rate-limited, the core scholarship discovery and matching flow remains 100% operational.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** 18+ (Node 20+ recommended)
- **npm** 9+

### 2. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run automated tests
npm test

# Start backend server (Port 5000)
npm run dev
```

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start Vite development server (Port 5173)
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🔑 Environment Variables

### Frontend (`client/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL of the backend Express server | `http://localhost:5000` |

### Backend (`server/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Listening port for the API server | `5000` |
| `CLIENT_URL` | Allowed origin for CORS (e.g. deployed Vercel domain) | `http://localhost:5173` |
| `LLM_API_KEY` | *(Optional)* API key for Google Gemini / OpenAI | `""` |
| `LLM_PROVIDER` | *(Optional)* `gemini` or `openai` or `openrouter` | `gemini` |
| `LLM_MODEL` | *(Optional)* `gemini-1.5-flash` or `gpt-4o-mini` | `gemini-1.5-flash` |
| `NODE_ENV` | Environment mode (`development` or `production`) | `development` |

---

## 📡 REST API Documentation

### 1. Health Check
`GET /api/health`
- **Response:**
```json
{
  "success": true,
  "status": "ok",
  "service": "right2know-api",
  "timestamp": "2026-09-20T06:30:00.000Z"
}
```

### 2. Get All Schemes
`GET /api/schemes`
- **Response:** Array of all active scholarship records.

### 3. Get Single Scheme Details
`GET /api/schemes/:id`
- **Example:** `GET /api/schemes/scheme-001`
- **Response:** Specific scheme details, requirements, and required documents.

### 4. Match Scholarships (Deterministic)
`POST /api/match`
- **Request Body:**
```json
{
  "course": "CSE",
  "year": 2,
  "state": "Uttar Pradesh",
  "category": "General",
  "incomeLakhs": 6.0,
  "cgpa": 7.5,
  "hasDisability": false,
  "gender": "Male",
  "institutionType": "Private"
}
```
- **Response:**
```json
{
  "success": true,
  "count": 4,
  "matches": [
    {
      "id": "scheme-005",
      "name": "Reliance Foundation Undergraduate Scholarship",
      "provider": "Reliance Foundation",
      "benefit": "Up to ₹2,00,000 over the duration of the degree",
      "deadline": "2026-10-06",
      "matchScore": 95,
      "reason": "Eligible because your 7.5 CGPA exceeds the 7.0 requirement, family income (₹6L) is within the ₹15L ceiling.",
      "matchedCriteria": ["Eligible for CSE", "Year 2 eligible", "Pan-India eligibility", "Income ₹6L within max ₹15L", "CGPA 7.5 meets min 7"]
    }
  ]
}
```

### 5. Ask AI Assistant
`POST /api/ask`
- **Request Body:**
```json
{
  "profile": { "course": "CSE", "year": 2, "state": "Uttar Pradesh" },
  "question": "Which scholarship closes first and what documents do I need?"
}
```
- **Response:**
```json
{
  "success": true,
  "answer": "The scholarship closing earliest is UP Post-Matric Scholarship with a deadline of 2026-09-28..."
}
```

---

## 🌐 Production Deployment Guide

### Backend on Render
1. Create a **New Web Service** pointing to your repository.
2. Root Directory: `server`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Environment Variables:
   - `NODE_ENV` = `production`
   - `CLIENT_URL` = `https://<your-vercel-domain>.vercel.app`
   - `LLM_API_KEY` = *(Optional)*

### Frontend on Vercel
1. Create a **New Project** pointing to your repository.
2. Framework Preset: **Vite**
3. Root Directory: `client`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variables:
   - `VITE_API_BASE_URL` = `https://<your-render-backend>.onrender.com`

---

## 🧪 Testing Suite

Run backend matching and validation unit tests:
```bash
cd server
npm test
```

Run frontend production build verification:
```bash
cd client
npm run build
```

---

## 📄 License
Right2Know is released under the **MIT License**. Free for educational and civic-tech use.
