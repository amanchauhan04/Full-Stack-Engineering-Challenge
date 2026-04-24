# Full Stack Engineering Challenge

A professional REST API and Interactive Frontend built to process hierarchical node relationships, detect cycles, and calculate tree depths.

## 🚀 Live Links
- **Frontend**: [Your Vercel/Netlify URL]
- **Backend API**: [Your Render/Railway URL]/bfhl

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js
- **Frontend**: React.js, Tailwind CSS
- **Deployment**: Vercel (Frontend), Render (Backend)

## 📌 Features
- **Tree Construction**: Handles multi-parent cases (first parent wins).
- **Cycle Detection**: Identifies cyclic groups and returns lexicographically smallest node as root.
- **Validation**: Strict regex-based validation for `X->Y` format.
- **Responsive UI**: Modern dashboard to visualize API responses.

## 🛠️ Installation & Local Setup

### Backend
1. `cd backend`
2. `npm install`
3. `npm start` (Runs on http://localhost:5000)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm start` (Runs on http://localhost:3000)

## 📝 API Specification
**Endpoint**: `POST /bfhl`  
**Payload**: `{"data": ["A->B", "B->C"]}`# Full-Stack-Engineering-Challenge
