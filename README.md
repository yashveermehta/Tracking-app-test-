# India Post RTN Telematics Dashboard
**Tactical Observer & Fleet Management System**

This project is a telematics web application built to monitor and manage the India Post Road Transport Network (RTN). It simulates real-time tracking, capacity utilization, dispatch management, and 3PL brokerage for national logistics corridors.

## Features Built
- **Live Fleet Tracking**: Interactive map using Leaflet to track active trucks across multiple national routes.
- **Dynamic Touch Point Logs**: Simulates loading and offloading of parcels at specific intermediate waypoints, calculating exact capacity percentages dynamically.
- **Automated Delay & Alert System**: Random chance simulations drop `DELAYED` or `GEOFENCE_DEVIATION` alerts which automatically adjust downstream Estimated Time of Arrivals (ETAs) on the schedule.
- **Network Load Heatmap**: Visual breakdown of how utilized specific routes are (e.g., NH-76 vs DEL-VAR).
- **3PL Spare Capacity Brokerage**: Identifies trucks running with >20% empty space and provides tools to simulate brokering that capacity out to 3PL partners.
- **MIS Executive Reports**: Analytics dashboard visualizing system uptime, alert breakdowns, and on-time performance using `recharts`.

## Tech Stack
- React 18
- Vite
- Tailwind CSS
- Zustand (State Management)
- React Leaflet (OpenStreetMap)
- Recharts (Data Visualization)

## Local Setup
If you want to run this project locally on your machine:

1. Clone the repository:
```bash
git clone https://github.com/yashveermehta/Tracking-app-test-.git
cd Tracking-app-test-
```

2. Install the necessary node modules:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

*(Note: The simulation runs entirely on the frontend without a backend database for this prototype version).*
