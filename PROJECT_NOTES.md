# Sathvic Health - Detailed Project Status Notes

This document provides a comprehensive technical overview of the progress and current state of the Sathvic Health project, a MERN stack application for Ayurvedic lifestyle management.

## 🚀 Key Milestones & Features

### 1. User Authentication & Profile
- **Logic**: JWT-based authentication using `jsonwebtoken` and password hashing with `bcryptjs`.
- **Endpoints**:
  - `POST /api/auth/register`: Handles user creation with initial Dosha scores and body type.
  - `POST /api/auth/login`: Validates credentials and returns a 7-day token.
  - `GET /api/auth/profile`: Fetches user-specific data including health metrics.
- **Frontend**: `Login.jsx` and `Register.jsx` with real-time feedback and `UserContext` for global state management.

### 2. Ayurvedic Assessment (Quiz)
- **Structure**: 15-question assessment + Clinical Metrics (Height, Weight, Conditions).
- **Scoring**: Dynamic Dosha scoring (Vata/Pitta/Kapha) and automatic BMI calculation.
- **Results**: `Result.jsx` interprets the highest score and provides a CTA to save the personalized plan.

### 3. Smart Life Plans & Adaptation
- **Schema**: `Plan.js` model with dietary/workout guidelines and 7-day schedules.
- **Clinical Intelligence**: 
  - `planRoutes.js` includes an **Intelligence Layer** that transforms plans dynamically.
  - **Overlays**: Real-time ingredient swaps (e.g. Millet for Rice in Diabetes) and calorie optimization (e.g. portion control for Obese profiles).
- **Visualization**: `MyPlan.jsx` displays transformed tasks with "Health Intelligence" badges.

### 4. Consistency Dashboard (Heatmaps)
- **Tracking**: `DailyProgress.js` model records habit completions.
- **Visualization**:
  - **Diet Heatmap**: Emerald green cells tracking meal completion.
  - **Workout Heatmap**: Indigo blue cells tracking movement.
- **Interactivity**: Dashboard featuring tooltips and 42-day historical views.

### 5. Smart Marketplace & Ecommerce
- **Catalog**: `cartRoutes.js` with metadata for `benefits` and `cautions` per product.
- **Intelligence**: `MarketCart.jsx` displays "Doctor's Recommendation" tags and "Safety Alerts" based on user health markers.
- **Cart Lifecycle**: Full add/update/remove/clear functionality with persistent storage.

---

## 🛠️ Technical Architecture

### Backend (Node.js/Express)
- **Database**: MongoDB with Mongoose (User, Plan, DailyProgress models).
- **Intelligence**: Service-layer functions for BMI category mapping and condition-based string transformations.
- **Middleware**: JWT-based access control.

### Frontend (React/Vite)
- **State**: `UserContext` manages the comprehensive health profile.
- **Service**: Axios-based `api.js` with intelligence-aware fetching.

---

<<<<<<< Updated upstream
## ✅ Current Development Status
- **Core Framework**: 100% Complete.
- **Personalization**: Fully automated Ayurvedic (Dosha) + Clinical (BMI/Conditions) hybrid system.
- **Marketplace**: Smart matchmaking engine and bag lifecycle finalized.
=======
## 📂 Granular Directory Structure

```text
/
├── backend/
│   ├── middleware/auth.js      # JWT Verification
│   ├── models/
│   │   ├── User.js              # Identity & Scores
│   │   ├── Plan.js              # Dosha-specific content
│   │   └── DailyProgress.js     # User daily tracking
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth/...
│   │   ├── planRoutes.js        # /api/plans/...
│   │   └── progressRoutes.js    # /api/progress/...
│   └── server.js                # Express config & DB connection
├── src/
│   ├── context/UserContext.jsx # Global User State
│   ├── services/api.js         # Centralized Axios logic
│   ├── data/
│   │   ├── questions.js         # 15-question quiz data
│   │   └── recommendations.js   # Hardcoded Dosha facts
│   ├── pages/
│   │   ├── LandingPage.jsx      # [NEW] Main Home Page
│   │   ├── Dashboard.jsx        # Data visualization
│   │   ├── Quiz.jsx             # Interactive assessment
│   │   ├── MyPlan.jsx           # Task management
│   │   └── Login/Register       # Entry points
│   └── components/
│       ├── home/                # [NEW] Landing Page Components
│       │   ├── HeroSection.jsx
│       │   ├── AboutSection.jsx
│       │   ├── DoshaSection.jsx
│       │   ├── FeaturesSection.jsx
│       │   └── CTASection.jsx
│       ├── Navbar.jsx           # Dynamic navigation
│       ├── Footer.jsx           # [NEW] Site footer
│       └── ProtectedRoute.jsx   # Auth guard for frontend
└── PROJECT_NOTES.md            # You are here
```
>>>>>>> Stashed changes

---
*Last Technical Audit: 2026-02-16*
