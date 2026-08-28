# Farmer Portal Frontend — SIH26131
**AI-Assisted Early Detection & Management of Crop Diseases and Pest Infestations**

---

## Overview

This repository contains the **Farmer Portal Frontend** for the shared SIH26131 project (`SIH-Early-detection-of-Plant-Crop-disease-`). It is built specifically for Indian farmers and agricultural evaluators, prioritizing mobile responsiveness, simplicity, accessibility, clear language, and instant diagnostic feedback.

---

## Key Features

1. **Farmer Authentication & Onboarding (`/farmer/login`):**
   * Mobile number / OTP / Email login with government-focused UI.
   * Multilingual toggle: **English**, **हिंदी (Hindi)**, **मराठी (Marathi)**.
   * 1-Click Instant Demo Login for evaluators.

2. **Farmer Dashboard (`/farmer/dashboard`):**
   * Personalized greeting with village and district location.
   * Crop health overview stats (Total Farms, Healthy Plots, Plots to Watch, High Risk Plots).
   * Primary hero CTA: **"Scan Your Crop Now"**.
   * Real-time agricultural weather widget (temperature, humidity, rain chance, disease outbreak risk factor).
   * AI-assisted advisory insight card with explicit prediction disclaimer.
   * Critical regional alerts banner and recent scan reports archive.

3. **AI Crop Disease Detection Flow (`/farmer/scan`):**
   * **Step 1 (Upload):** Mobile camera capture, image picker, drag-and-drop, photo preview, crop selector.
   * **Step 2 (Analysis):** Animated AI-assisted diagnostic loading screen with neural network step progression.
   * **Step 3 (Diagnostic Report):** Detected disease/pest, confidence percentage, text-labeled risk badge (LOW, MODERATE, HIGH, CRITICAL), warning signs & symptoms, explanation, recommended management steps, chemical safety guidelines, "Request Officer Assistance" modal, and PDF health report generation.

4. **My Farms & Plot Monitoring (`/farmer/farms` & `/farmer/farms/:id`):**
   * Searchable and filterable list of registered plots.
   * Farm specifications: Acreage, crop stage, soil type, irrigation system, health status, and last scan date.
   * Modal to register new farm parcels.
   * Timeline of historical scans and health changes per plot.

5. **Scan History & Reports Archive (`/farmer/reports`):**
   * Filterable report archive by crop, risk level, and date.
   * Permanent report URLs (`/farmer/scan/:id`).

6. **Agricultural Alerts & Warnings (`/farmer/alerts`):**
   * Critical warnings, disease alerts, pest outbreaks, weather risks, and officer communications.
   * Multi-category filters and mark-as-read status.

7. **Agricultural Advisory & Crop Disease Library (`/farmer/advisory`):**
   * Seasonal advisories for Crop Health, Disease Prevention, Pest Management, and Irrigation.
   * Comprehensive searchable database for Tomato, Chilli, Groundnut, Rice, Cotton, Soybean, Wheat.
   * Modal popups detailing symptoms, favorable weather, organic remedies, and approved chemical management.

8. **Farmer Profile & Settings (`/farmer/profile`):**
   * Personal details, location (Village, Taluka, District, State).
   * Portal language selector with instant dynamic UI translation.
   * Notification preferences for SMS, WhatsApp, and Weather warnings.

---

## Technology Stack

* **Framework:** React 18 + TypeScript + Vite
* **Routing:** React Router v6 (nested layout with responsive sidebar and mobile bottom navigation)
* **Styling:** Tailwind CSS (custom agricultural emerald/earth palette with high-contrast text and risk badges)
* **Icons:** Lucide React
* **State & i18n:** React Context (`LanguageContext`, `AuthContext`)

---

## Project Structure

```text
frontend/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── public/
│   └── leaf.svg
└── src/
    ├── types/                 # Strict TypeScript schemas (farmer, scan, alert, advisory, weather)
    ├── data/                  # Realistic Indian demo dataset (Maharashtra: Pune, Baramati, etc.)
    ├── services/              # API Abstraction layer (apiConfig, apiClient, scanService, farmService, etc.)
    ├── context/               # AuthContext & LanguageContext (English, Hindi, Marathi)
    ├── i18n/                  # Multilingual translation dictionary
    ├── components/
    │   ├── layout/            # FarmerLayout, FarmerHeader, FarmerSidebar, MobileNavigation
    │   ├── common/            # RiskBadge, StatusBadge, StatCard, PageHeader, Modals, Empty/Loading States
    │   ├── dashboard/         # QuickScanCTA, CropHealthOverview, WeatherWidget, RecentScansList, AIInsightCard
    │   ├── scan/              # ScanUploader, ScanLoading, ScanResultCard
    │   ├── farms/             # FarmCard, FarmDetailOverview
    │   ├── alerts/            # AlertCard
    │   └── advisory/          # AdvisoryCard, DiseaseDetailModal
    ├── pages/                 # Full responsive routes matching /farmer/*
    ├── App.tsx
    ├── main.tsx
    └── index.css
```

---

## Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The Farmer Portal will be accessible at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```

---

## Backend Integration

The frontend architecture uses a clean **API Service Abstraction Layer** (`src/services/`):
* By default, `VITE_USE_MOCK_DATA=true` allows full offline hackathon demonstration with realistic demo datasets.
* To connect directly to the running FastAPI backend, set in `.env`:
  ```env
  VITE_API_BASE_URL=http://localhost:8000
  VITE_USE_MOCK_DATA=false
  ```
* Endpoints supported:
  * `POST /disease/predict` (multipart image upload + crop)
  * `POST /disease/report` (PDF crop health report generation)
  * `GET /farmers/` & `POST /farmers/`
