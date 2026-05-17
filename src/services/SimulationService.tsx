import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import { mockRoutes, mockTrucks, mockAlerts, mockSchedules } from '../data/mockData';

// This function helps to smoothly move the truck from point A (p1) to point B (p2)
// fraction is a number between 0 and 1 that tells how far along the path the truck is.
const interpolateLocation = (p1: [number, number], p2: [number, number], fraction: number) => {
  let startLat = p1[0];
  let startLng = p1[1];
  let endLat = p2[0];
  let endLng = p2[1];

  let currentLat = startLat + (endLat - startLat) * fraction;
  let currentLng = startLng + (endLng - startLng) * fraction;

  return [currentLat, currentLng];
};

export const SimulationService = () => {
  // Get functions from our global store (state management)
  const { setRoutes, setSchedules, setTrucks, trucks, updateTruck } = useStore();
  
  // Use a ref to make sure we only load the mock data once when the component starts
  const initialized = useRef(false);

  // First Effect: Load the initial mock data into our app
  useEffect(() => {
    if (initialized.current === false) {
      // Set the initial dummy data
      setRoutes(mockRoutes);
      setSchedules(mockSchedules);
      setTrucks(mockTrucks);
      
      // Load initial alerts
      useStore.setState({ alerts: mockAlerts });
      
      // Mark as initialized so we don't do this again
      initialized.current = true;
    }
  }, [setRoutes, setSchedules, setTrucks]);

  // Second Effect: This is the main simulation loop that moves the trucks
  useEffect(() => {
    // If not initialized or no trucks, do nothing
    if (initialized.current === false || trucks.length === 0) {
      return;
    }

    // How fast the simulation runs
    const SIMULATION_SPEED = 0.05;

    // Run this code every 2500 milliseconds (2.5 seconds)
    const interval = setInterval(() => {
      // Loop through each truck to update its position
      trucks.forEach(truck => {
        // Find the route this truck is assigned to
        const route = mockRoutes.find(r => r.id === truck.routeId);
        if (!route) {
          return; // If route not found, skip this truck
        }
        
        // Store current truck values in temporary variables
        let newLat = truck.currentLocation.lat;
        let newLng = truck.currentLocation.lng;
        let newStatus = truck.status;
        let newDelay = truck.delayMinutes;
        
        // The path line is an array of [latitude, longitude] points
        const pathLine = route.path;
        let closestIdx = 0;
        let minDistance = Infinity;
        
        // Find the closest point on the path to the truck's current location
        for (let i = 0; i < pathLine.length - 1; i++) {
          let latDiff = pathLine[i][0] - newLat;
          let lngDiff = pathLine[i][1] - newLng;
          // Calculate distance using standard math formula: sqrt(x^2 + y^2)
          let dist = Math.sqrt((latDiff * latDiff) + (lngDiff * lngDiff));
          
          if (dist < minDistance) {
            minDistance = dist;
            closestIdx = i; // Save the index of the closest point
          }
        }

        // If the truck is not at the end of the route, move it to the next point
        if (closestIdx < pathLine.length - 1) {
          const targetPoint = pathLine[closestIdx + 1];
          
          // Calculate how much the truck should move based on its speed
          const moveFrac = (truck.speed / 100) * SIMULATION_SPEED; 
          
          // Get the new position of the truck using our helper function
          const [movedLat, movedLng] = interpolateLocation(
            [newLat, newLng], 
            [targetPoint[0], targetPoint[1]], 
            Math.min(moveFrac, 1) // Don't move more than 100% to the next point
          );
          
          // Update the coordinates
          newLat = movedLat;
          newLng = movedLng;

          // Check if the truck has reached the target point
          let targetLatDiff = targetPoint[0] - newLat;
          let targetLngDiff = targetPoint[1] - newLng;
          const distanceToTarget = Math.sqrt((targetLatDiff * targetLatDiff) + (targetLngDiff * targetLngDiff));
          
          // If very close to the target point
          if (distanceToTarget < 0.05) {
             // Find if this point is a special waypoint (e.g. warehouse or stop)
             const waypoint = route.waypoints.find(wp => wp.location.lat === targetPoint[0] && wp.location.lng === targetPoint[1]);
             
             // If it's a touchpoint (place to load/unload)
             if (waypoint && waypoint.isTouchPoint) {
                // If the truck just arrived (hasn't processed this waypoint yet)
                if (truck.nextWaypointId !== waypoint.id) {
                  let loadBefore = truck.currentLoad;
                  let newLoad = loadBefore;
                  let offloaded = 0;
                  let loaded = 0;

                  // Randomly decide if we are loading or offloading at this point
                  if (Math.random() > 0.5) {
                    // We are loading goods onto the truck
                    loaded = Math.random() * 2;
                    newLoad = Math.min(truck.capacity, loadBefore + loaded); // Don't exceed capacity
                    loaded = newLoad - loadBefore; // Actual amount loaded
                  } else {
                    // We are offloading goods from the truck
                    offloaded = Math.random() * 3;
                    newLoad = Math.max(0, loadBefore - offloaded); // Don't go below 0
                    offloaded = loadBefore - newLoad; // Actual amount offloaded
                  }

                  // Calculate how full the truck is (in percentage)
                  const capacityPct = Math.round((newLoad / truck.capacity) * 100);

                  // Update the truck's load and next waypoint in the store
                  updateTruck(truck.id, { 
                    currentLoad: newLoad,
                    nextWaypointId: waypoint.id 
                  });

                  // Add an event to show on the dashboard that goods were loaded/unloaded
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
                    capacityPct: capacityPct
                  });
                }
             }
          }
        }

        // Randomly simulate a delay in the truck's journey (2% chance)
        if (Math.random() < 0.02 && newStatus === 'ON_TIME') {
          newStatus = 'DELAYED';
          newDelay = newDelay + 30; // Add 30 minutes delay
          
          // Create an alert for the dashboard
          let alertType = 'DELAY';
          if (Math.random() > 0.5) {
            alertType = 'GEOFENCE_DEVIATION'; // Truck went out of its allowed area
          }

          useStore.getState().addAlert({
             id: `alert-auto-${Date.now()}`,
             truckId: truck.id,
             type: alertType as any,
             message: `Automated System Alert: ${truck.registrationNumber} has shown unexpected movement or delay.`,
             severity: 'WARNING',
             timestamp: new Date(),
             resolved: false
          });
        }

        // Randomly simulate the truck getting back on time (5% chance)
        if (Math.random() < 0.05 && newStatus === 'DELAYED') {
          newStatus = 'ON_TIME';
        }

        // Finally, save all the new values back to the truck state
        updateTruck(truck.id, {
          currentLocation: { lat: newLat, lng: newLng, name: truck.currentLocation.name },
          status: newStatus as any,
          delayMinutes: newDelay,
          lastUpdated: new Date()
        });
      });
    }, 2500); // 2500 ms = 2.5 seconds

    // Cleanup function to stop the timer if the component is removed
    return () => {
      clearInterval(interval);
    };
  }, [trucks, updateTruck]);

  // This component doesn't show any UI, it just runs the logic in the background
  return null;
};

