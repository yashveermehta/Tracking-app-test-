import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useStore } from '../../store';
import { formatCapacityPercentage } from '../../lib/utils';
import { Route as TelematicsRoute, Truck } from '../../types';

import iconMarker2x from 'leaflet/dist/images/marker-icon-2x.png';
import iconMarkerLoc from 'leaflet/dist/images/marker-icon.png';
import iconMarkerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconMarker2x,
  iconUrl: iconMarkerLoc,
  shadowUrl: iconMarkerShadow,
});

const createTruckIcon = (status: Truck['status'], loadPct: number) => {
  const color = status === 'DELAYED' ? '#E93333' : status === 'MAINTENANCE' ? '#F59E0B' : '#10B981';
  const html = `
    <div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="1" y="3" width="15" height="13"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
      </svg>
      <div style="position: absolute; top: -8px; right: -8px; background: white; color: ${color}; font-size: 10px; font-weight: bold; padding: 1px 3px; border-radius: 4px; border: 1px solid ${color};">
        ${loadPct}%
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-truck-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

interface TelematicsMapProps {
  filterRouteId?: string;
  onTruckSelect?: (truckId: string) => void;
}

export const TelematicsMap = ({ filterRouteId, onTruckSelect }: TelematicsMapProps) => {
  const { trucks, routes } = useStore();

  const activeTrucks = filterRouteId ? trucks.filter(t => t.routeId === filterRouteId) : trucks;

  const center: [number, number] = [22.9734, 78.6569]; 
  const zoom = 5;

  return (
    <div className="w-full h-full min-h-[500px] rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {routes.map((route: TelematicsRoute) => (
          <React.Fragment key={route.id}>
            <Polyline 
              positions={route.path} 
              pathOptions={{ color: '#4F46E5', weight: 4, opacity: 0.6 }} 
            />
            
            {route.waypoints.map(wp => (
              <React.Fragment key={wp.id}>
                {wp.isTouchPoint && (
                  <Circle 
                    center={[wp.location.lat, wp.location.lng]} 
                    pathOptions={{ color: '#E93333', fillColor: '#E93333', fillOpacity: 0.4 }} 
                    radius={3000}
                  >
                    <Popup>
                      <div className="font-semibold">{wp.location.name}</div>
                      <div className="text-sm text-gray-500">RTN Touch Point</div>
                      <div className="text-xs text-blue-600 mt-1">Geofence: 3km</div>
                    </Popup>
                  </Circle>
                )}
                <Marker position={[wp.location.lat, wp.location.lng]}>
                   <Popup>{wp.location.name}</Popup>
                </Marker>
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}

        {activeTrucks.map(truck => {
          const loadPct = formatCapacityPercentage(truck.currentLoad, truck.capacity);
          return (
            <Marker 
              key={truck.id}
              position={[truck.currentLocation.lat, truck.currentLocation.lng]}
              icon={createTruckIcon(truck.status, loadPct)}
              eventHandlers={{
                click: () => onTruckSelect?.(truck.id),
              }}
            >
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
