import { useState } from 'react';
import { TelematicsMap } from '../components/map/TelematicsMap';
import { AnalyticsHeroCards, LiveAlertsFeed } from '../components/dashboard/DashboardWidgets';
import { Reports } from './Reports';
import { useStore } from '../store';
import { formatDistanceToNow } from 'date-fns';

const LiveMap = () => {
  const [filterRouteId, setFilterRouteId] = useState<string>('');
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);
  
  const routes = useStore(state => state.routes);
  const trucks = useStore(state => state.trucks);
  const touchPoints = useStore(state => state.touchPointEvents);
  
  const selectedTruck = trucks.find(t => t.id === selectedTruckId);
  const selectedTruckRoute = selectedTruck ? routes.find(r => r.id === selectedTruck.routeId) : null;
  
  const recentEvents = touchPoints.filter(e => e.truckId === selectedTruckId).slice(0, 3);

  return (
    <>
      <AnalyticsHeroCards />

      <div className="mb-4 flex justify-between items-center">
        <div className="relative">
           <select 
             value={filterRouteId} 
             onChange={(e) => setFilterRouteId(e.target.value)}
             className="bg-[#0e1322] border border-white/10 text-slate-200 rounded px-3 py-2 text-sm font-technical appearance-none pr-8 cursor-pointer focus:outline-none focus:border-white/30"
           >
             <option value="">Filter by Route: [All Routes]</option>
             {routes.map(r => (
               <option key={r.id} value={r.id}>{r.name}</option>
             ))}
           </select>
           <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm">arrow_drop_down</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-[600px] lg:h-[calc(100vh-14rem)] mb-16 md:mb-0">
        <div className="flex-[2] glass-card rounded-lg relative overflow-hidden bg-surface-container-lowest h-[400px] lg:h-full">
          <TelematicsMap filterRouteId={filterRouteId} onTruckSelect={setSelectedTruckId} />
          
          <div className="absolute bottom-6 left-6 p-4 glass-card rounded-lg flex flex-col gap-3 z-20 pointer-events-none">
            <p className="text-[10px] font-label text-slate-500 uppercase tracking-widest mb-1">Fleet Legend</p>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
              <span className="text-xs font-label text-slate-300">On Time</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E63329]"></span>
              <span className="text-xs font-label text-slate-300">Delayed</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
              <span className="text-xs font-label text-slate-300">Maintenance</span>
            </div>
          </div>

          <div className="absolute top-6 left-6 flex flex-col gap-1 z-20 pointer-events-none">
            <div className="bg-[#E63329]/90 text-white px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-tighter w-fit">NATIONAL OVERVIEW</div>
            <div className="glass-card px-3 py-1 text-[11px] font-technical text-slate-300 w-fit backdrop-blur-md">LAT: 20.5937° N | LON: 78.9629° E</div>
          </div>
        </div>
        
        <div className="flex-1 h-[400px] lg:h-full relative transition-all duration-300">
          {!selectedTruckId ? (
            <LiveAlertsFeed />
          ) : (
            selectedTruck && (
              <div className="absolute inset-0 z-30 glass-card bg-surface-container-lowest dark border border-white/10 rounded-xl overflow-y-auto w-full max-w-[400px] lg:max-w-none shadow-2xl animate-fade-in-down flex flex-col">
                 <div className="p-5 border-b border-white/5 flex justify-between items-center bg-surface-container-low/50 sticky top-0 z-10">
                    <div>
                      <h3 className="text-xl font-headline font-bold text-on-surface">{selectedTruck.registrationNumber}</h3>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded mt-1 inline-block ${selectedTruck.status === 'DELAYED' ? 'bg-error/10 text-error' : selectedTruck.status === 'MAINTENANCE' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'bg-tertiary/10 text-tertiary'}`}>
                        {selectedTruck.status.replace('_', ' ')}
                      </span>
                    </div>
                    <button onClick={() => setSelectedTruckId(null)} className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors">
                      <span className="material-symbols-outlined">close</span>
                    </button>
                 </div>
                 
                 <div className="p-5 space-y-6 flex-1">
                    <section>
                      <h4 className="text-[10px] font-technical uppercase tracking-widest text-slate-500 mb-3 border-b border-white/5 pb-1">Current Status</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-400 font-label mb-1">Speed</p>
                          <p className="text-sm font-technical">{Math.round(selectedTruck.speed)} km/h</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-label mb-1">Delay</p>
                          <p className={`text-sm font-technical font-bold ${selectedTruck.delayMinutes > 0 ? 'text-error' : 'text-slate-300'}`}>{selectedTruck.delayMinutes > 0 ? `${selectedTruck.delayMinutes} mins` : 'None'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-slate-400 font-label mb-1">Location</p>
                          <p className="text-sm font-body text-slate-300 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                            {selectedTruck.currentLocation.name}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[10px] font-technical text-slate-500">Last updated {formatDistanceToNow(selectedTruck.lastUpdated, { addSuffix: true })}</span>
                        </div>
                      </div>
                    </section>

                    <section className="bg-surface-container-low/20 p-4 rounded-xl border border-white/5 text-center flex flex-col items-center">
                      <h4 className="text-[10px] font-technical uppercase tracking-widest text-slate-500 mb-4 w-full text-left">Capacity</h4>
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-[8px] border-surface-container-highest"></div>
                        {(() => {
                          const pct = Math.round((selectedTruck.currentLoad / selectedTruck.capacity) * 100);
                          const color = pct >= 90 ? '#E63329' : pct >= 70 ? '#F59E0B' : '#00a572';
                          return (
                            <div 
                              className="absolute inset-0 rounded-full"
                              style={{
                                background: `conic-gradient(${color} ${pct}%, transparent ${pct}%)`,
                                WebkitMask: 'radial-gradient(transparent 55%, black 56%)',
                                mask: 'radial-gradient(transparent 55%, black 56%)'
                              }}
                            ></div>
                          );
                        })()}
                        <div className="flex flex-col items-center z-10">
                          <span className="text-2xl font-headline font-bold">{Math.round((selectedTruck.currentLoad / selectedTruck.capacity) * 100)}%</span>
                        </div>
                      </div>
                      <p className="text-sm font-technical text-slate-300 mt-3">{selectedTruck.currentLoad.toFixed(2)} / {selectedTruck.capacity} Tonnes</p>
                    </section>

                    <section>
                      <h4 className="text-[10px] font-technical uppercase tracking-widest text-slate-500 mb-3 border-b border-white/5 pb-1">Route Info</h4>
                      <p className="text-xs font-body text-slate-300 mb-3">{selectedTruckRoute?.name || 'Unknown Route'}</p>
                      <div className="space-y-3 relative before:absolute before:inset-y-2 before:left-[5px] before:w-[2px] before:bg-surface-container-highest">
                        {selectedTruckRoute?.waypoints.map((wp) => {
                          const isNext = wp.id === selectedTruck.nextWaypointId;
                          return (
                            <div key={wp.id} className="flex gap-3 relative z-10">
                               <div className={`w-3 h-3 rounded-full border-2 mt-0.5 shrink-0 ${isNext ? 'bg-tertiary border-tertiary shadow-[0_0_8px_rgba(0,165,114,0.5)]' : 'bg-surface-container-lowest border-slate-600'}`}></div>
                               <div className="flex-1">
                                 <p className={`text-xs font-medium ${isNext ? 'text-white' : 'text-slate-400'}`}>{wp.location.name}</p>
                                 {isNext && <p className="text-[10px] font-technical text-tertiary uppercase mt-0.5">Next Point</p>}
                               </div>
                            </div>
                          )
                        })}
                      </div>
                    </section>

                    {recentEvents.length > 0 && (
                      <section>
                        <h4 className="text-[10px] font-technical uppercase tracking-widest text-slate-500 mb-3 border-b border-white/5 pb-1">Recent Events</h4>
                        <div className="space-y-2">
                          {recentEvents.map(evt => (
                            <div key={evt.id} className="bg-surface-container-lowest p-3 rounded border border-white/5">
                               <p className="text-xs font-body text-slate-300 mb-1">{evt.waypointName}</p>
                               <div className="flex justify-between items-end">
                                  <span className="text-[10px] font-technical text-slate-500">{formatDistanceToNow(evt.timestamp, { addSuffix: true })}</span>
                                  <div className="flex gap-2">
                                    {evt.offloaded > 0 && <span className="text-[10px] text-error font-technical font-bold">-{evt.offloaded}T</span>}
                                    {evt.loaded > 0 && <span className="text-[10px] text-tertiary font-technical font-bold">+{evt.loaded}T</span>}
                                  </div>
                               </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                 </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export { LiveMap, Reports };
