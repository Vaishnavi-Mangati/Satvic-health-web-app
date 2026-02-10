# Sathvic Health - Detailed Project Status Notes

This document provides a comprehensive technical overview of the progress and current state of the Sathvic Health project, a MERN stack application for Ayurvedic lifestyle management.

## 🚀 Key Milestones & Features

### 1. User Authentication & Profile
- **Logic**: JWT-based authentication using `jsonwebtoken` and password hashing with `bcryptjs`.
- **Endpoints**:
  - `POST /api/auth/register`: Handles user creation with initial Dosha scores and body type.
  - `POST /api/auth/login`: Validates credentials and returns a 7-day token.
  - `GET /api/auth/profile`: (Placeholder) for fetching user-specific data.
- **Frontend**: `Login.jsx` and `Register.jsx` with real-time feedback and `UserContext` for global state management.

### 2. Ayurvedic Assessment (Quiz)
- **Structure**: 15-question assessment covering physical traits and emotional tendencies.
- **Scoring**: Dynamic scoring system in `Quiz.jsx` that increments Vata, Pitta, or Kapha levels based on selection.
- **Results**: `Result.jsx` interprets the highest score to determine the primary `bodyType`.
- **Persistence**: Results are saved to the MongoDB `User` record upon registration.

### 3. Smart Life Plans
- **Schema**: `Plan.js` model includes:
  - `dietaryGuidelines`: Array of specific food recommendations.
  - `workoutGuidelines`: Array of exercise focuses.
  - `schedule`: Daily meals (Breakfast, Lunch, Dinner, Snack) and exercises (Yoga, Cardio, HIIT, etc.).
- **Retrieval**: `GET /api/plans/:bodyType` fetches the customized plan based on the user's Dosha.

### 4. Consistency Dashboard (Heatmaps)
- **Tracking**: `DailyProgress.js` model records `completedItems` (Meals/Exercises) mapped to specific dates.
- **Visualization**:
  - **Diet Heatmap**: Emerald green cells (Intensity based on completion count).
  - **Workout Heatmap**: Indigo blue cells.
- **Interactivity**: `Dashboard.jsx` features a minimalist tooltip that displays specific completed habits on hover.
- **Service**: `getProgressHistory` fetches data for the last 42 days (6 weeks) for a complete visual overview.

---

## 🛠️ Technical Architecture

### Backend (Node.js/Express)
- **Database**: MongoDB with Mongoose schemas.
  - `User`: Name, email, hashed password, bodyType, and scores (vata, pitta, kapha).
  - `Plan`: Guidelines and schedules for each Dosha.
  - `DailyProgress`: User-date mapping for checked-off habits.
- **Middleware**: `auth.js` verifies JWT via `x-auth-token` header.

### Frontend (React/Vite)
- **Service Layer**: `src/services/api.js` centralizes all `axios` calls with a request interceptor for tokens.
- **State Management**: `UserContext.jsx` manages user state, profile data, and logout logic.
- **Styling**: Tailwind CSS for responsive layouts, combined with custom design tokens for the "Sathvic" aesthetic (Emerald #10b981 and Indigo #6366f1).

---

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
│   │   ├── Dashboard.jsx        # Data visualization
│   │   ├── Quiz.jsx             # Interactive assessment
│   │   ├── MyPlan.jsx           # Task management
│   │   └── Login/Register       # Entry points
│   └── components/
│       ├── Navbar.jsx           # Dynamic navigation
│       └── ProtectedRoute.jsx   # Auth guard for frontend
└── PROJECT_NOTES.md            # You are here
```

---

## � Current Development Status
- **Backend API**: 90% Complete (Core CRUD for plans/progress finished).
- **Frontend UI**: Refined for a premium, minimalist feel.
- **Data Integrity**: Schemas enforce unique indices where necessary (e.g., one progress record per user per day).

---
*Last Technical Audit: 2026-02-10*
