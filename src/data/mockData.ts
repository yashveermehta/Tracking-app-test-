import { Route, Truck, Alert, Schedule } from '../types';
import { addHours, subHours } from 'date-fns';

// Create a realistic sample route: Ahmedabad -> Ajmer -> Jaipur -> Delhi
export const mockRoutes: Route[] = [
  {
    id: 'route-76',
    name: 'Ahmedabad » Delhi (National Route 76)',
    waypoints: [
      {
        id: 'wp-amd',
        location: { lat: 23.0225, lng: 72.5714, name: 'Ahmedabad Hub' },
        isTouchPoint: true,
      },
      {
        id: 'wp-ajm',
        location: { lat: 26.4499, lng: 74.6399, name: 'Ajmer Sorting Center' },
        isTouchPoint: true,
      },
      {
        id: 'wp-jai',
        location: { lat: 26.9124, lng: 75.7873, name: 'Jaipur Processing' },
        isTouchPoint: true,
      },
      {
        id: 'wp-del',
        location: { lat: 28.6139, lng: 77.2090, name: 'Delhi Main Hub' },
        isTouchPoint: true,
      }
    ],
    path: [
      [23.0225, 72.5714], // Ahmedabad
      [23.8361, 73.0858],
      [24.5854, 73.7125], // Udaipur (transit)
      [25.3407, 74.6313],
      [26.4499, 74.6399], // Ajmer
      [26.7022, 75.1432],
      [26.9124, 75.7873], // Jaipur
      [27.5530, 76.6341],
      [28.4089, 77.0270], // Gurgaon (transit)
      [28.6139, 77.2090], // Delhi
    ]
  },
  {
    id: 'route-state-12',
    name: 'Mumbai » Pune (State Route)',
    waypoints: [
      {
        id: 'wp-mum',
        location: { lat: 19.0760, lng: 72.8777, name: 'Mumbai GPO' },
        isTouchPoint: true,
      },
      {
        id: 'wp-nav',
        location: { lat: 19.0330, lng: 73.0297, name: 'Navi Mumbai Hub' },
        isTouchPoint: false,
      },
      {
        id: 'wp-pun',
        location: { lat: 18.5204, lng: 73.8567, name: 'Pune Sorting Center' },
        isTouchPoint: true,
      }
    ],
    path: [
      [19.0760, 72.8777],
      [19.0330, 73.0297],
      [18.7303, 73.3512], // Lonavala
      [18.5204, 73.8567],
    ]
  },
  {
    id: 'route-del-var',
    name: 'Delhi » Lucknow » Varanasi (National Route)',
    waypoints: [
      { id: 'wp-del', location: { lat: 28.6139, lng: 77.2090, name: 'Delhi Main Hub' }, isTouchPoint: true },
      { id: 'wp-luc', location: { lat: 26.8467, lng: 80.9461, name: 'Lucknow Center' }, isTouchPoint: true },
      { id: 'wp-var', location: { lat: 25.3176, lng: 82.9739, name: 'Varanasi Hub' }, isTouchPoint: true },
    ],
    path: [
      [28.6139, 77.2090], [28.0000, 78.5000], [27.5000, 79.5000],
      [26.8467, 80.9461], [26.0000, 81.8000], [25.3176, 82.9739]
    ]
  },
  {
    id: 'route-mum-rai',
    name: 'Mumbai » Nagpur » Raipur (National Route)',
    waypoints: [
      { id: 'wp-mum', location: { lat: 19.0760, lng: 72.8777, name: 'Mumbai GPO' }, isTouchPoint: true },
      { id: 'wp-nag', location: { lat: 21.1458, lng: 79.0882, name: 'Nagpur Hub' }, isTouchPoint: true },
      { id: 'wp-rai', location: { lat: 21.2514, lng: 81.6296, name: 'Raipur Processing' }, isTouchPoint: true },
    ],
    path: [
      [19.0760, 72.8777], [20.0000, 75.0000], [20.5000, 77.0000],
      [21.1458, 79.0882], [21.2000, 80.5000], [21.2514, 81.6296]
    ]
  },
  {
    id: 'route-che-hyd',
    name: 'Chennai » Bangalore » Hyderabad (National Route)',
    waypoints: [
      { id: 'wp-che', location: { lat: 13.0827, lng: 80.2707, name: 'Chennai Hub' }, isTouchPoint: true },
      { id: 'wp-ban', location: { lat: 12.9716, lng: 77.5946, name: 'Bangalore Center' }, isTouchPoint: true },
      { id: 'wp-hyd', location: { lat: 17.3850, lng: 78.4867, name: 'Hyderabad GPO' }, isTouchPoint: true },
    ],
    path: [
      [13.0827, 80.2707], [13.0000, 79.0000], [12.9716, 77.5946],
      [14.5000, 77.8000], [16.0000, 78.1000], [17.3850, 78.4867]
    ]
  },
  {
    id: 'route-kol-vis',
    name: 'Kolkata » Bhubaneswar » Visakhapatnam (National Route)',
    waypoints: [
      { id: 'wp-kol', location: { lat: 22.5726, lng: 88.3639, name: 'Kolkata Main' }, isTouchPoint: true },
      { id: 'wp-bhu', location: { lat: 20.2961, lng: 85.8245, name: 'Bhubaneswar Hub' }, isTouchPoint: true },
      { id: 'wp-vis', location: { lat: 17.6868, lng: 83.2185, name: 'Visakhapatnam Center' }, isTouchPoint: true },
    ],
    path: [
      [22.5726, 88.3639], [21.5000, 87.0000], [20.2961, 85.8245],
      [19.0000, 84.5000], [18.0000, 83.8000], [17.6868, 83.2185]
    ]
  },
  {
    id: 'route-jai-ahd',
    name: 'Jaipur » Jodhpur » Ahmedabad (State Route)',
    waypoints: [
      { id: 'wp-jai2', location: { lat: 26.9124, lng: 75.7873, name: 'Jaipur Processing' }, isTouchPoint: true },
      { id: 'wp-jod', location: { lat: 26.2389, lng: 73.0243, name: 'Jodhpur Hub' }, isTouchPoint: true },
      { id: 'wp-ahd2', location: { lat: 23.0225, lng: 72.5714, name: 'Ahmedabad Hub' }, isTouchPoint: true },
    ],
    path: [
      [26.9124, 75.7873], [26.5000, 74.5000], [26.2389, 73.0243],
      [25.0000, 72.8000], [24.0000, 72.6000], [23.0225, 72.5714]
    ]
  }
];

export const mockTrucks: Truck[] = [
  {
    id: 'truck-101',
    registrationNumber: 'MH-04-1234',
    capacity: 10,
    currentLoad: 8, // 80% initially
    status: 'ON_TIME',
    currentLocation: { lat: 25.3407, lng: 74.6313, name: 'Transit near Ajmer' },
    routeId: 'route-76',
    speed: 65,
    lastUpdated: new Date(),
    nextWaypointId: 'wp-ajm',
    delayMinutes: 0
  },
  {
    id: 'truck-102',
    registrationNumber: 'GJ-01-AB-4567',
    capacity: 14,
    currentLoad: 14, // 100% capacity
    status: 'DELAYED',
    currentLocation: { lat: 23.8361, lng: 73.0858, name: 'Heading to Udaipur' },
    routeId: 'route-76',
    speed: 15,
    lastUpdated: new Date(),
    nextWaypointId: 'wp-ajm',
    delayMinutes: 45
  },
  {
    id: 'truck-103',
    registrationNumber: 'MH-12-XX-9999',
    capacity: 5,
    currentLoad: 2,
    status: 'ON_TIME',
    currentLocation: { lat: 18.7303, lng: 73.3512, name: 'Lonavala Ghats' },
    routeId: 'route-state-12',
    speed: 55,
    lastUpdated: new Date(),
    nextWaypointId: 'wp-pun',
    delayMinutes: 0
  },
  {
    id: 'truck-104',
    registrationNumber: 'DL-01-AZ-1111',
    capacity: 12,
    currentLoad: 6,
    status: 'ON_TIME',
    currentLocation: { lat: 28.0000, lng: 78.5000, name: 'On NH-19' },
    routeId: 'route-del-var',
    speed: 60,
    lastUpdated: new Date(),
    nextWaypointId: 'wp-luc',
    delayMinutes: 0
  },
  {
    id: 'truck-105',
    registrationNumber: 'KA-05-MM-2222',
    capacity: 8,
    currentLoad: 5,
    status: 'MAINTENANCE',
    currentLocation: { lat: 13.0000, lng: 79.0000, name: 'Workshop near Kanchipuram' },
    routeId: 'route-che-hyd',
    speed: 0,
    lastUpdated: new Date(),
    nextWaypointId: 'wp-ban',
    delayMinutes: 120
  },
  {
    id: 'truck-106',
    registrationNumber: 'WB-02-XY-3333',
    capacity: 14,
    currentLoad: 1, // Almost empty
    status: 'IDLE',
    currentLocation: { lat: 20.2961, lng: 85.8245, name: 'Bhubaneswar Hub Yard' },
    routeId: 'route-kol-vis',
    speed: 0,
    lastUpdated: new Date(),
    nextWaypointId: 'wp-vis',
    delayMinutes: 0
  },
  {
    id: 'truck-107',
    registrationNumber: 'RJ-14-CC-4444',
    capacity: 9,
    currentLoad: 9, // Full
    status: 'DELAYED',
    currentLocation: { lat: 26.5000, lng: 74.5000, name: 'Heavy traffic zone' },
    routeId: 'route-jai-ahd',
    speed: 20,
    lastUpdated: new Date(),
    nextWaypointId: 'wp-jod',
    delayMinutes: 30
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    truckId: 'truck-102',
    type: 'DELAY',
    message: 'Heavy traffic congestion detected on NH-48 near Udaipur. Estimated delay: 45 mins.',
    timestamp: subHours(new Date(), 1),
    severity: 'WARNING',
    resolved: false
  },
  {
    id: 'alert-2',
    truckId: 'truck-101',
    type: 'GEOFENCE_DEVIATION',
    message: 'Truck MH-04-1234 deviated from planned RTN corridor by 2km.',
    timestamp: subHours(new Date(), 3),
    severity: 'CRITICAL',
    resolved: true
  }
];

export const mockSchedules: Schedule[] = [
  {
    id: 'sched-1',
    truckId: 'truck-101',
    routeId: 'route-76',
    departureTime: subHours(new Date(), 12),
    estimatedArrivalTime: addHours(new Date(), 5),
    actualDepartureTime: subHours(new Date(), 12),
    status: 'IN_TRANSIT'
  },
  {
    id: 'sched-2',
    truckId: 'truck-102',
    routeId: 'route-76',
    departureTime: subHours(new Date(), 4),
    estimatedArrivalTime: addHours(new Date(), 18),
    actualDepartureTime: subHours(new Date(), 3), // Left 1 hr late
    status: 'IN_TRANSIT'
  },
  {
    id: 'sched-3',
    truckId: 'truck-103',
    routeId: 'route-state-12',
    departureTime: subHours(new Date(), 2),
    estimatedArrivalTime: addHours(new Date(), 2),
    actualDepartureTime: subHours(new Date(), 2),
    status: 'IN_TRANSIT'
  },
  {
    id: 'sched-4',
    truckId: 'truck-104',
    routeId: 'route-del-var',
    departureTime: addHours(new Date(), 1),
    estimatedArrivalTime: addHours(new Date(), 10),
    status: 'SCHEDULED'
  },
  {
    id: 'sched-5',
    truckId: 'truck-105',
    routeId: 'route-che-hyd',
    departureTime: subHours(new Date(), 24),
    estimatedArrivalTime: subHours(new Date(), 2),
    actualDepartureTime: subHours(new Date(), 24),
    actualArrivalTime: subHours(new Date(), 1),
    status: 'COMPLETED'
  },
  {
    id: 'sched-6',
    truckId: 'truck-106',
    routeId: 'route-kol-vis',
    departureTime: addHours(new Date(), 5),
    estimatedArrivalTime: addHours(new Date(), 20),
    status: 'SCHEDULED'
  },
  {
    id: 'sched-7',
    truckId: 'truck-107',
    routeId: 'route-jai-ahd',
    departureTime: subHours(new Date(), 5),
    estimatedArrivalTime: addHours(new Date(), 8),
    actualDepartureTime: subHours(new Date(), 4),
    status: 'IN_TRANSIT'
  }
];
