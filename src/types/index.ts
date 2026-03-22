// Define all models based on India Post RTN Telematics requirements

export type TruckStatus = 'ON_TIME' | 'DELAYED' | 'MAINTENANCE' | 'IDLE';

export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface TouchPointEvent {
  id: string;
  truckId: string;
  routeId: string;
  waypointName: string;
  timestamp: Date;
  loadBefore: number;  // tonnes
  loadAfter: number;   // tonnes  
  offloaded: number;   // tonnes
  loaded: number;      // tonnes
  capacityPct: number; // percentage after loading
}

export interface RouteWaypoint {
  id: string;
  location: Location;
  isTouchPoint: boolean; // Intermediate points where loading/offloading occurs
  expectedArrivalTime?: Date;
}

export interface Route {
  id: string;
  name: string; // e.g., "Ahmedabad-Ajmer-Jaipur"
  waypoints: RouteWaypoint[];
  path: [number, number][]; // Array of lat, lng for drawing the polyline
}

export interface Truck {
  id: string;
  registrationNumber: string; // e.g., MH-04-1234
  capacity: number; // in tonnes (5-14 tonnes)
  currentLoad: number; // in tonnes
  status: TruckStatus;
  currentLocation: Location;
  routeId: string;
  speed: number; // km/h
  lastUpdated: Date;
  nextWaypointId?: string;
  delayMinutes: number;
}

export interface Alert {
  id: string;
  truckId: string;
  type: 'DELAY' | 'GEOFENCE_DEVIATION' | 'BREAKDOWN' | 'TRAFFIC';
  message: string;
  timestamp: Date;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  resolved: boolean;
}

export interface Schedule {
  id: string;
  truckId: string;
  routeId: string;
  departureTime: Date;
  estimatedArrivalTime: Date;
  actualDepartureTime?: Date;
  actualArrivalTime?: Date;
  status: 'SCHEDULED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
}
