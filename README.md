<div align="center">
  <h1>🚛 India Post RTN Telematics</h1>
  <p><b>Advanced Fleet Management & Tactical Observation Dashboard</b></p>
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)]()
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)]()
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)]()
</div>

<br />

## 📖 Executive Summary

The **Road Transport Network (RTN) Telematics Dashboard** is a comprehensive, real-time logistics monitoring solution engineered specifically for India Post. It facilitates the efficient tracking of commercial long-haul operations across 76 national corridors, enabling dispatch managers to monitor fleets in real-time, analyze capacity utilization, and orchestrate immediate responses to network deviations.

By integrating simulated live tracking, geofenced alerts, and 3PL brokerage capabilities, this application models a modern, data-driven supply chain ecosystem capable of mitigating delays and maximizing freight economics.

---

## ✨ Core System Features

*   🌍 **Live Geographic Tracking (GIS)**
    *   Interactive `Leaflet` driven map plotting vehicle coordinates with real-time geospatial polling.
    *   Dynamic marker rendering indicating load percentage and vehicle health states.
*   📊 **Intelligent Capacity Utilization Analysis**
    *   Network load heatmaps highlighting heavily trafficked vs underutilized regional corridors.
    *   Automated parsing of load/offload variations at registered operational touch points.
*   🤝 **Automated 3PL Brokerage & Spare Capacity Monetization**
    *   Algorithmic identification of vehicles operating below an 80% load threshold.
    *   Simulated API-ready brokerage interfaces to automatically broadcast spare tonnage to associated third-party logistics partners.
*   🚨 **Automated Deviation & Alert Management**
    *   Simulated geofence locking triggering automated alerts for detours, vehicle breakdowns, or excessive dwell times at transit hubs.
    *   Instantaneous schedule realignment; downstream downstream nodes are mathematically adjusted based on upstream delay minutes.
*   📈 **Executive MIS Reporting System**
    *   High-fidelity data visualization suite built on `recharts`.
    *   Tracks macroscopic KPIs including 7-day Operational Variance, System Uptime, Route Yields, and Incident Severity Distributions.

---

## 🛠 Technology Stack

This project is built atop a robust, modern frontend architecture prioritizing high-frequency updates and render efficiency.

*   **Framework:** React 18
*   **Build Engine:** Vite
*   **Language:** TypeScript (Strict Mode)
*   **State Management:** Zustand (Immutable State Trees)
*   **Styling & UI:** Tailwind CSS, PostCSS, Material Symbols Outlined
*   **Mapping Engine:** React-Leaflet + OpenStreetMap
*   **Data Visualization:** Recharts
*   **Date Operations:** date-fns

---

## 🏗 Directory Structure

```text
src/
├── components/          # Reusable architecture components
│   ├── dashboard/       # Specialized KPI and alert widgets
│   ├── layout/          # Global navigation, sidebar, and headers
│   └── map/             # Telematics Leaflet integration layers
├── data/                # Seed generation and mock operational datasets
├── lib/                 # Utility functions and mathematical helpers
├── pages/               # Primary application views (Fleet, Schedules, etc.)
├── services/            # Headless logical controllers (SimulationService)
├── store/               # Zustand global state definitions and mutators
└── types/               # TypeScript interfaces and mapped types
```

---

## 🚀 Getting Started

### Prerequisites

You must have **Node.js (v16+)** installed to build the project locally.

### Installation

1. Clone the repository and navigate into the root directory:
   ```bash
   git clone https://github.com/yashveermehta/Tracking-app-test-.git
   cd Tracking-app-test-
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

3. Initialize the development environment:
   ```bash
   npm run dev
   ```

4. The application will immediately bind and compile. Access the dashboard at `http://localhost:5173`.

---

## 🌐 Deployment Configuration

This application uses specialized configurations within `vite.config.ts` and `gh-pages` tooling for automated GitHub Pages distribution.

To deploy a production build:
```bash
npm run deploy
```
*(This triggers a rigid TypeScript compilation pass via `tsc` prior to pushing minified artifacts to the designated branch).*

---

<div align="center">
  <i>Developed for operational simulation and strategic supply-chain analysis.</i>
</div>
