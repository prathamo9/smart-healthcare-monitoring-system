# Smart Healthcare Monitoring System (Frontend)

An enterprise-grade, responsive healthcare telemetry and clinical surveillance web application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

Featuring dark navy clinical aesthetics with cyan/electric-blue accents, real-time vitals tracking, deterministic Random Forest machine learning risk stratification, and longitudinal trend visualizers powered by **Recharts**.

---

## 🩺 Medical Disclaimer
> **"AI-generated risk assessment is for educational/research purposes and is not a medical diagnosis."**  
> Always consult qualified medical practitioners for diagnostic decisions.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm (v9+)

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the local Vite development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

The application will be live at:
👉 **`http://localhost:3000/`**

---

## 📁 Project Architecture & Clean Directory Structure

```
e:/Project/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── App.tsx                      # Root routes & context provider wrapper
    ├── main.tsx                     # Entry mount
    ├── index.css                    # Tailwind directives & glassmorphism utilities
    │
    ├── types/                       # TypeScript interfaces
    │   └── index.ts                 # Vitals, predictions, users, notifications, settings
    │
    ├── data/                        # Synthetic demo datasets
    │   └── mockData.ts              # 30-day historical vitals & baseline values
    │
    ├── utils/                       # Clinical algorithms & calculations
    │   └── healthCalculators.ts     # Status thresholds, BMI, & Random Forest ML simulator
    │
    ├── services/                    # Service layer (FastAPI-ready)
    │   ├── healthService.ts         # In-memory + localStorage store with simulated latency
    │   └── authService.ts           # Google OAuth simulation & JWT token management
    │
    ├── hooks/                       # State hooks & providers
    │   ├── useAuth.tsx              # Auth context (Google / Email / Guest login)
    │   └── useHealthData.tsx        # Vitals telemetry data store & sync
    │
    ├── layouts/                     # Page layouts
    │   └── DashboardLayout.tsx      # Sidebar, Navbar, and persistent footer disclaimer
    │
    ├── components/
    │   └── common/
    │       ├── MetricCard.tsx       # Vitals cards with pulse animation & normal ranges
    │       ├── HealthStatusBadge.tsx# Green = Normal, Yellow = Warning, Red = Danger
    │       ├── PredictionCard.tsx   # AI/ML score, confidence, & model metadata
    │       ├── ChartCard.tsx        # Recharts area graph with metric/timeframe switcher
    │       ├── DataTable.tsx        # Filterable recent readings table with snapshot modal
    │       ├── DisclaimerBanner.tsx # Reusable medical disclaimer component
    │       ├── Navbar.tsx           # Telemetry header, unread notifications, & quick actions
    │       ├── Sidebar.tsx          # Responsive navigation drawer & user profile
    │       ├── NotificationDropdown.tsx # Interactive alerts dropdown
    │       └── Toast.tsx            # Floating action toasts
    │
    └── pages/
        ├── LandingPage.tsx          # Public landing page with live interactive AI simulator
        ├── AuthPage.tsx             # Google OAuth & email credentials sign-in
        ├── DashboardPage.tsx        # 5 core vitals, ML card, Recharts, recent table
        ├── HealthInputPage.tsx      # Clinical intake form with auto-BMI & live preview
        ├── HealthHistoryPage.tsx    # Searchable history audit log with CSV export
        ├── HealthTrendsPage.tsx     # Multi-metric longitudinal analytics & BP lines
        ├── RiskAnalysisPage.tsx     # 6-axis radar chart & "What-If" lifestyle simulator
        ├── MLReportPage.tsx         # Explainable AI report (Gini importance, print CSS)
        ├── ProfilePage.tsx          # Patient demographics, physician, and emergency contacts
        └── SettingsPage.tsx         # Mock API latency, FastAPI URL, and sensor devices
```

---

## 🌟 Pages & Key Capabilities

1. **Landing Page (`/`)**:
   - Modern dark navy / cyan aesthetic with subtle glassmorphism and animated heartbeat pulse.
   - Interactive live vitals sandbox: drag sliders and observe instant Random Forest risk recalculation.
   - Architectural flow diagram and feature breakdown.

2. **Google Login / Register (`/auth`)**:
   - Simulated Google OAuth 2.0 flow with authentic styling and token storage ready for backend integration.
   - One-click Guest Demo access for rapid testing without typing credentials.

3. **Dashboard (`/dashboard`)**:
   - Matches the reference design inspiration:
     - **Heart Rate**: 78 bpm — Normal (with pulse animation)
     - **Blood Pressure**: 120/80 mmHg — Normal
     - **SpO2**: 98% — Normal
     - **Temperature**: 36.7°C — Normal
     - **Glucose**: 95 mg/dL — Normal
     - **AI/ML Prediction Card**: Risk Score: 0.06 | Confidence: 94% | Status: Low Risk | Model: Random Forest
     - **Interactive Health Trend Chart**: Recharts area graph with timeframes (24h, 7d, 30d) and metric filters.
     - **Recent Health Readings Table**: Snapshot inspection modal and deletion capabilities.

4. **Health Data Input (`/input`)**:
   - Inputs: Heart Rate, Systolic BP, Diastolic BP, SpO2, Temperature, Glucose, Height, Weight, Smoking, Alcohol, Physical Activity, Symptoms, Notes.
   - Automatic live BMI calculation and categorization.
   - Strict clinical validation with visual inline warnings.
   - Live AI Risk Preview Sidebar updates dynamically as user enters data.
   - Quick presets: "Normal (78 bpm)", "Hypertension", "Critical Risk".

5. **Health History (`/history`)**:
   - Filterable by risk category (Low, Moderate, High, Critical) and search query.
   - Sortable columns: Date, Heart Rate, Blood Pressure, Risk Score.
   - One-click CSV export of complete telemetry logs.

6. **Health Trends (`/trends`)**:
   - Recharts dual-axis arterial blood pressure curve with clinical hypertension thresholds (120 elevated, 140 stage 2).
   - Pulse rate area curve and glucose variance bar charts.
   - Summary statistics cards: Average HR, Peak BP, Min SpO2, Mean Glucose.

7. **Risk Analysis (`/risk`)**:
   - 6-axis Radar Chart (Cardiovascular, Metabolic, Respiratory, Lifestyle, Thermal, Autonomic).
   - "What-If" Lifestyle Simulator: adjust sliders to see how positive behavioral changes drop risk scores.

8. **ML Report (`/report`)**:
   - Clinical explainable AI report.
   - Model metadata: Random Forest Classifier (200 trees, Calibrated Gini).
   - Validation metrics: Accuracy 96.2%, ROC-AUC 0.981, F1 0.948.
   - Gini feature importance ranking chart.
   - Print-ready CSS for generating PDF reports.

9. **Patient Profile (`/profile`)**:
   - Demographics (Age, Gender, Blood Group), Emergency Contact, Attending Physician, and Allergies manager.

10. **System Settings (`/settings`)**:
    - Backend connection readiness for future FastAPI endpoints (`http://localhost:8000/api`).
    - Network latency simulator slider.
    - Connected medical hardware simulation (Apple Watch, BLE Oximeter, Smart BP Cuff, CGM).
    - Synthetic demo data reset and generator buttons.

---

## 🔌 Future FastAPI Backend Readiness

The frontend service layer (`src/services/healthService.ts`) is designed to connect directly to FastAPI:
```typescript
// Example endpoint structure configured in healthService:
// GET  /api/vitals/latest
// GET  /api/vitals/history
// POST /api/vitals/ingest
// POST /api/predict
// POST /api/auth/google
```
When your FastAPI backend is running, navigate to **Settings** and toggle Architecture Pipeline Mode to **"FastAPI REST Server"**!
