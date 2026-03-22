import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { mockRoutes, mockTrucks, mockAlerts, mockSchedules } from '../data/mockData';

// helper func for map animation
const interpolateLocation = (p1: [number, number], p2: [number, number], fraction: number) => {
  return [
    p1[0] + (p2[0] - p1[0]) * fraction,
    p1[1] + (p2[1] - p1[1]) * fraction,
  ];
};

export const SimulationService = () => {
  const { setRoutes, setSchedules, setTrucks, trucks, updateTruck } = useStore();
  const initialized = useRef(false);

  // setup initial mock data
  useEffect(() => {
    if (!initialized.current) {
      // console.log("initializing dummy data");
      setRoutes(mockRoutes);
      setSchedules(mockSchedules);
      setTrucks(mockTrucks);
      
      useStore.setState({ alerts: mockAlerts });
      
      initialized.current = true;
    }
  }, [setRoutes, setSchedules, setTrucks]);

  // main simulation loop for trucks
  useEffect(() => {
    if (!initialized.current || trucks.length === 0) return;

    const SIMULATION_SPEED = 0.05; // making it 0.05 seems to fix the jumping issue

    const interval = setInterval(() => {
      // console.log("tick...");
      trucks.forEach(truck => {
        const route = mockRoutes.find(r => r.id === truck.routeId);
        if (!route) return;
        
        // TODO: refactor this math later it's kinda messy
        let newLat = truck.currentLocation.lat;
        let newLng = truck.currentLocation.lng;
        let newStatus = truck.status;
        let newDelay = truck.delayMinutes;
        
        const pathLine = route.path;
        let closestIdx = 0;
        let minDistance = Infinity;
        
        for (let i = 0; i < pathLine.length - 1; i++) {
          const dist = Math.sqrt(
            Math.pow(pathLine[i][0] - newLat, 2) + Math.pow(pathLine[i][1] - newLng, 2)
          );
          if (dist < minDistance) {
            minDistance = dist;
            closestIdx = i;
          }
        }

        // move truck to next node
        if (closestIdx < pathLine.length - 1) {
          const target = pathLine[closestIdx + 1];
          const moveFrac = (truck.speed / 100) * SIMULATION_SPEED; 
          
          const [movedLat, movedLng] = interpolateLocation(
            [newLat, newLng], 
            [target[0], target[1]], 
            Math.min(moveFrac, 1)
          );
          
          newLat = movedLat;
          newLng = movedLng;

          // proximity check (0.05 approx)
          const distanceToTarget = Math.sqrt(Math.pow(target[0] - newLat, 2) + Math.pow(target[1] - newLng, 2));
          if (distanceToTarget < 0.05) {
             const waypoint = route.waypoints.find(wp => wp.location.lat === target[0] && wp.location.lng === target[1]);
             
             // handle loading logic at touch points
             if (waypoint && waypoint.isTouchPoint) {
                if (truck.nextWaypointId !== waypoint.id) {
                  // console.log(`truck ${truck.id} arrived at ${waypoint.id}`);
                  const loadBefore = truck.currentLoad;
                  let newLoad = loadBefore;
                  let offloaded = 0;
                  let loaded = 0;

                  // randomly load or offload for the demo
                  if (Math.random() > 0.5) {
                    loaded = Math.random() * 2;
                    newLoad = Math.min(truck.capacity, loadBefore + loaded);
                    loaded = newLoad - loadBefore; // fix weird decimals
                  } else {
                    offloaded = Math.random() * 3;
                    newLoad = Math.max(0, loadBefore - offloaded);
                    offloaded = loadBefore - newLoad;
                  }

                  const capacityPct = Math.round((newLoad / truck.capacity) * 100);

                  updateTruck(truck.id, { 
                    currentLoad: newLoad,
                    nextWaypointId: waypoint.id 
                  });

                  // add event log to zustand
                  useStore.getState().addTouchPointEvent({
                    id: `tp-${Date.now()}-${truck.id}-${Math.random()}`,
                    truckId: truck.id,
                    routeId: route.id,
                    waypointName: waypoint.location.name,
                    timestamp: new Date(),
                    loadBefore: Number(loadBefore.toFixed(2)),
                    loadAfter: Number(newLoad.toFixed(2)),
                    offloaded: Number(offloaded.toFixed(2)),
                    loaded: Number(loaded.toFixed(2)),
                    capacityPct
                  });
                }
             }
          }
        }

        // 2% chance of breaking down or delay
        if (Math.random() < 0.02 && newStatus === 'ON_TIME') {
          // console.warn("truck delayed randomly!");
          newStatus = 'DELAYED';
          newDelay += 30; // giving 30 mins delay
          
          useStore.getState().addAlert({
             id: `alert-auto-${Date.now()}`,
             truckId: truck.id,
             type: Math.random() > 0.5 ? 'DELAY' : 'GEOFENCE_DEVIATION',
             message: `Automated System Alert: ${truck.registrationNumber} has shown unexpected movement or delay.`,
             severity: 'WARNING',
             timestamp: new Date(),
             resolved: false
          });
        }

        // maybe resolve the delay if we get lucky
        if (Math.random() < 0.05 && newStatus === 'DELAYED') {
          newStatus = 'ON_TIME';
          // keep the delayMinutes for history
        }

        /* 
        // older implementation, kept for reference
        if (truck.speed > 80) {
           console.log("overspeeding!")
        }
        */

        updateTruck(truck.id, {
          currentLocation: { lat: newLat, lng: newLng, name: truck.currentLocation.name },
          status: newStatus,
          delayMinutes: newDelay,
          lastUpdated: new Date()
        });
      });
    }, 2500); // 2.5 sec interval

    return () => clearInterval(interval);
  }, [trucks, updateTruck]);

  return null;
};
