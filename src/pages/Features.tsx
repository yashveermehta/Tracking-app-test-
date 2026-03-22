import { useState } from 'react';
import { useStore } from '../store';
import { formatDistanceToNow, format } from 'date-fns';
import { formatCapacityPercentage } from '../lib/utils';
import { Truck } from '../types';

const StatusBadge = ({ status }: { status: Truck['status'] }) => {
  if (status === 'ON_TIME') return <span className="px-2 py-1 rounded-[2px] bg-tertiary/10 text-tertiary text-[10px] font-bold uppercase tracking-tighter border border-tertiary/20">On Time</span>;
  if (status === 'DELAYED') return <span className="px-2 py-1 rounded-[2px] bg-primary-container/10 text-primary-container text-[10px] font-bold uppercase tracking-tighter border border-primary-container/20">Delayed</span>;
  if (status === 'MAINTENANCE') return <span className="px-2 py-1 rounded-[2px] bg-[#F59E0B]/10 text-[#F59E0B] text-[10px] font-bold uppercase tracking-tighter border border-[#F59E0B]/20">Maintenance</span>;
  return <span className="px-2 py-1 rounded-[2px] bg-slate-500/10 text-slate-500 text-[10px] font-bold uppercase tracking-tighter border border-slate-500/20">{status.replace('_', ' ')}</span>;
};

export const Fleet = () => {
    const trucks = useStore(state => state.trucks);
    const routes = useStore(state => state.routes);
    const touchPointEvents = useStore(state => state.touchPointEvents);

    const activeTrucks = trucks.length;
    const onTimePct = Math.round((trucks.filter(t => t.status === 'ON_TIME').length / (activeTrucks || 1)) * 100);

    const exportCSV = () => {
      let csv = 'Registration,Route,Capacity(T),Load(T),Utilization%,Status,Speed(kmh),DelayMinutes,LastUpdated\n';
      trucks.forEach(t => {
          const rName = routes.find(r => r.id === t.routeId)?.name || 'Unknown';
          const util = t.capacity > 0 ? Math.round((t.currentLoad/t.capacity)*100) : 0;
          csv += `${t.registrationNumber},"${rName}",${t.capacity},${t.currentLoad},${util},${t.status},${Math.round(t.speed)},${t.delayMinutes},${t.lastUpdated.toISOString()}\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fleet_export_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
              <div>
                  <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface mb-2">Fleet Monitoring</h1>
                  <p className="text-slate-400 text-sm max-w-lg">Real-time status of India Post Road Transport Network vehicles across primary logistics corridors.</p>
              </div>
              <div className="flex gap-4">
                  <div className="glass-card px-6 py-4 rounded-xl flex flex-col min-w-[140px]">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider mb-1">Total Active</span>
                      <span className="font-headline text-2xl font-bold text-tertiary">{activeTrucks}</span>
                  </div>
                  <div className="glass-card px-6 py-4 rounded-xl flex flex-col min-w-[140px]">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider mb-1">On Time</span>
                      <span className="font-headline text-2xl font-bold text-secondary">{onTimePct}%</span>
                  </div>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
                <h3 className="font-headline font-semibold text-sm flex items-center gap-2 text-on-surface">
                    <span className="material-symbols-outlined text-tertiary">grid_view</span>
                    Network Load Map
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {routes.map(r => {
                        const routeTrucks = trucks.filter(t => t.routeId === r.id);
                        const currentSum = routeTrucks.reduce((sum, t) => sum + t.currentLoad, 0);
                        const capSum = routeTrucks.reduce((sum, t) => sum + t.capacity, 0);
                        const pct = capSum > 0 ? Math.round((currentSum / capSum) * 100) : 0;
                        const colorClass = pct >= 90 ? 'text-error' : pct >= 70 ? 'text-[#F59E0B]' : 'text-tertiary';
                        const colorBgClass = pct >= 90 ? 'bg-error' : pct >= 70 ? 'bg-[#F59E0B]' : 'bg-tertiary';
                        const shortName = r.name.split('»').join('-').split('(')[0].trim() || r.name;
                        return (
                            <div key={r.id} className="glass-card p-4 rounded-xl flex flex-col justify-between">
                                <div className="font-technical text-xs text-slate-400 mb-2 truncate" title={r.name}>{shortName}</div>
                                <div className={`font-headline text-2xl font-bold ${colorClass}`}>{pct}%</div>
                                <div className="text-[10px] text-slate-500 font-technical mb-2">{routeTrucks.length} Trucks</div>
                                <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                                    <div className={`h-full ${colorBgClass}`} style={{ width: `${pct}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <section className="glass-card rounded-xl overflow-hidden shadow-2xl">
                <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-surface-container-low/30">
                    <h3 className="font-headline font-semibold text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#E63329]" style={{ fontVariationSettings: "'FILL' 1" }}>filter_list</span>
                        Active Fleet Stream
                    </h3>
                    <button onClick={exportCSV} className="border border-white/10 text-slate-400 hover:text-white hover:border-white/20 px-3 py-1.5 rounded text-[10px] font-technical uppercase tracking-widest flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Export CSV
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-left bg-surface-container-lowest/50">
                                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-widest border-b border-white/5">Vehicle / Route</th>
                                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-widest border-b border-white/5">Capacity Utilization</th>
                                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-widest border-b border-white/5">Current Location</th>
                                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-widest border-b border-white/5">Status</th>
                                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-widest border-b border-white/5 text-right">Last GPS Ping</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {trucks.map(truck => {
                                const route = routes.find(r => r.id === truck.routeId);
                                const utilization = formatCapacityPercentage(truck.currentLoad, truck.capacity);
                                const colorClass = utilization >= 90 ? 'bg-error' : utilization >= 70 ? 'bg-[#F59E0B]' : 'bg-tertiary';
                                const colorTextClass = utilization >= 90 ? 'text-error' : utilization >= 70 ? 'text-[#F59E0B]' : 'text-tertiary';
                                
                                return (
                                    <tr key={truck.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5 flex flex-col">
                                            <span className="font-technical text-sm text-primary-fixed">{truck.registrationNumber}</span>
                                            <span className="font-body text-xs text-slate-400 mt-1">{route?.name || 'Unknown Route'}</span>
                                        </td>
                                        <td className="px-6 py-5 min-w-[180px]">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                                                    <div className={`h-full ${colorClass}`} style={{ width: `${utilization}%` }}></div>
                                                </div>
                                                <span className={`font-technical text-[11px] ${colorTextClass}`}>{utilization}%</span>
                                            </div>
                                            <div className="text-[10px] text-slate-500 mt-1 uppercase font-technical">({truck.currentLoad}T / {truck.capacity}T)</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-xs text-slate-500">location_on</span>
                                                <span className="text-xs text-slate-300">{truck.currentLocation.name}</span>
                                            </div>
                                            <div className="text-[10px] font-technical text-slate-500 mt-1 ml-4">Speed: {Math.round(truck.speed)} km/h</div>
                                        </td>
                                        <td className="px-6 py-5 flex flex-col items-start gap-1">
                                            <StatusBadge status={truck.status} />
                                            {truck.delayMinutes > 0 && <span className="text-[10px] font-technical text-error font-bold tracking-widest uppercase">+{truck.delayMinutes}m delay</span>}
                                        </td>
                                        <td className="px-6 py-5 font-technical text-[11px] text-slate-500 text-right">
                                            {formatDistanceToNow(truck.lastUpdated, { addSuffix: true })}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="glass-card rounded-xl overflow-hidden shadow-2xl mt-6">
                <div className="px-6 py-5 border-b border-white/5 bg-surface-container-low/30">
                    <h3 className="font-headline font-semibold text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
                        Touch Point Activity Log
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-left bg-surface-container-lowest/50">
                                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-widest border-b border-white/5">Timestamp</th>
                                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-widest border-b border-white/5">Truck Reg No</th>
                                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-widest border-b border-white/5">Waypoint Name</th>
                                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-widest border-b border-white/5 text-right">Load Before</th>
                                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-widest border-b border-white/5 text-right">Offloaded</th>
                                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-widest border-b border-white/5 text-right">Loaded</th>
                                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-widest border-b border-white/5 text-right">Load After</th>
                                <th className="px-6 py-4 text-[11px] font-semibold text-slate-500 uppercase tracking-widest border-b border-white/5 text-center">Capacity %</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {touchPointEvents.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-slate-500 font-technical text-xs uppercase tracking-widest">
                                        No touch point events yet. Simulation populating data...
                                    </td>
                                </tr>
                            ) : touchPointEvents.slice(0, 20).map(evt => {
                                const tr = trucks.find(t => t.id === evt.truckId);
                                const regNo = tr?.registrationNumber || evt.truckId;
                                const capClass = evt.capacityPct >= 90 ? 'bg-error text-error text-opacity-0' : evt.capacityPct >= 70 ? 'bg-[#F59E0B] text-[#F59E0B] text-opacity-0' : 'bg-tertiary text-tertiary text-opacity-0';
                                
                                return (
                                    <tr key={evt.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 font-technical text-xs text-slate-500">
                                            {format(evt.timestamp, 'HH:mm:ss dd/MM')}
                                        </td>
                                        <td className="px-6 py-4 font-technical text-sm text-primary-fixed">{regNo}</td>
                                        <td className="px-6 py-4 font-body text-xs text-slate-300">{evt.waypointName}</td>
                                        <td className="px-6 py-4 font-technical text-xs text-slate-400 text-right">{evt.loadBefore.toFixed(2)}T</td>
                                        <td className={`px-6 py-4 font-technical text-xs text-right ${evt.offloaded > 0 ? 'text-[#E63329] font-bold' : 'text-slate-600'}`}>{evt.offloaded > 0 ? `-${evt.offloaded.toFixed(2)}T` : '-'}</td>
                                        <td className={`px-6 py-4 font-technical text-xs text-right ${evt.loaded > 0 ? 'text-tertiary font-bold' : 'text-slate-600'}`}>{evt.loaded > 0 ? `+${evt.loaded.toFixed(2)}T` : '-'}</td>
                                        <td className="px-6 py-4 font-technical text-xs font-bold text-slate-200 text-right">{evt.loadAfter.toFixed(2)}T</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                                                    <div className={`h-full ${capClass}`} style={{ width: `${evt.capacityPct}%` }}></div>
                                                </div>
                                                <span className={`font-technical text-[10px] ${evt.capacityPct >= 90 ? 'text-error' : evt.capacityPct >= 70 ? 'text-[#F59E0B]' : 'text-tertiary'}`}>{evt.capacityPct}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export const Schedules = () => {
    const schedules = useStore(state => state.schedules);
    const trucks = useStore(state => state.trucks);
    const routes = useStore(state => state.routes);
    const setSchedules = useStore(state => state.setSchedules);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTruck, setSelectedTruck] = useState('');
    const [selectedRoute, setSelectedRoute] = useState('');
    const [departureTime, setDepartureTime] = useState('');

    const availableTrucks = trucks.filter(t => t.status !== 'MAINTENANCE');

    const totalScheduled = schedules.length;
    const activeDelays = schedules.filter(s => {
        const t = trucks.find(tr => tr.id === s.truckId);
        return t?.status === 'DELAYED';
    }).length;

    const handleDispatch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTruck || !selectedRoute || !departureTime) return;

        const date = new Date(departureTime);
        const newSchedule = {
            id: `sched-${Date.now()}`,
            truckId: selectedTruck,
            routeId: selectedRoute,
            departureTime: date,
            estimatedArrivalTime: new Date(date.getTime() + 10 * 60 * 60 * 1000), 
            status: 'SCHEDULED' as const,
        };

        setSchedules([newSchedule, ...schedules]);
        setIsModalOpen(false);
        setSelectedTruck('');
        setSelectedRoute('');
        setDepartureTime('');
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-headline font-bold tracking-tight text-on-surface mb-2">Schedules & Dispatch</h1>
                    <p className="text-slate-400 font-body max-w-xl text-sm">Monitor real-time regional transport network flow and dispatch new route assignments.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-primary-container text-on-primary-container px-6 py-3 rounded font-bold hover:brightness-110 transition-all shadow-lg shadow-primary-container/20 uppercase tracking-wider text-sm"
                >
                    <span className="material-symbols-outlined text-xl">send_time_extension</span>
                    Dispatch New Run
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="glass-card p-5 rounded-xl">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">Total Scheduled</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-headline font-bold">{totalScheduled}</span>
                    </div>
                </div>
                <div className="glass-card p-5 rounded-xl border-l-4 border-tertiary/50">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">On-Time Dispatches</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-headline font-bold text-tertiary">100%</span>
                    </div>
                </div>
                <div className="glass-card p-5 rounded-xl border-l-4 border-error-container/50">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-2">Active Delays</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-headline font-bold text-error">{activeDelays}</span>
                    </div>
                </div>
            </div>
            
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card border border-white/10 rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-all">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-surface-container-highest/50">
                            <h3 className="text-lg font-headline font-bold text-on-surface">New Dispatch Form</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white hover:bg-white/5 p-1 rounded-full border border-transparent hover:border-white/10 transition-all">
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleDispatch} className="p-6 space-y-5">
                            <div>
                                <label className="block text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-2">Select Unit</label>
                                <select required value={selectedTruck} onChange={(e) => setSelectedTruck(e.target.value)} className="w-full bg-[#0e1322]/50 border border-white/10 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-primary font-technical">
                                    <option value="" className="bg-[#0e1322]">-- Choose Available Vehicle --</option>
                                    {availableTrucks.map(t => (
                                        <option key={t.id} value={t.id} className="bg-[#0e1322]">{t.registrationNumber} ({t.status})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-2">Select Corridor</label>
                                <select required value={selectedRoute} onChange={(e) => setSelectedRoute(e.target.value)} className="w-full bg-[#0e1322]/50 border border-white/10 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-primary font-label">
                                    <option value="" className="bg-[#0e1322]">-- Establish Destination Route --</option>
                                    {routes.map(r => (
                                        <option key={r.id} value={r.id} className="bg-[#0e1322]">{r.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-2">Departure Window</label>
                                <input required type="datetime-local" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} className="w-full bg-[#0e1322]/50 border border-white/10 rounded p-2.5 text-sm text-slate-200 outline-none focus:border-primary font-technical [color-scheme:dark]" />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-[11px] uppercase tracking-widest font-bold text-slate-400 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" className="bg-primary-container hover:bg-[#ff5545] text-on-primary-container px-5 py-2.5 rounded font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-primary-container/20 transition-colors">Execute Dispatch</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            <div className="glass-card rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-high/50">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-label border-b border-white/5">Schedule ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-label border-b border-white/5">Vehicle / Route</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-label border-b border-white/5">Departure</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-label border-b border-white/5">Original ETA</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-label border-b border-white/5">Revised ETA</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-label border-b border-white/5">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {schedules.map(sched => {
                                const truck = trucks.find(t => t.id === sched.truckId);
                                const route = routes.find(r => r.id === sched.routeId);
                                const isDelayed = truck?.delayMinutes && truck.delayMinutes > 0;
                                const trClass = isDelayed ? 'bg-error-container/5' : 'hover:bg-white/[0.02]';

                                return (
                                    <tr key={sched.id} className={`${trClass} transition-colors group`}>
                                        <td className="px-6 py-5 font-technical text-sm text-primary uppercase">{sched.id.substring(0, 10)}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-slate-500">local_shipping</span>
                                                <div>
                                                    <div className="text-sm font-technical font-medium text-slate-200">{truck?.registrationNumber}</div>
                                                    <div className="text-[10px] text-slate-500 font-label">{route?.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-technical text-slate-300">
                                            {format(sched.departureTime, 'HH:mm dd/MM')}
                                        </td>
                                        <td className={`px-6 py-5 text-sm font-technical text-slate-500 ${!isDelayed ? '' : 'line-through'}`}>
                                            {format(sched.estimatedArrivalTime, 'HH:mm dd/MM')}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={`text-sm font-technical font-bold ${isDelayed ? 'text-[#E63329]' : 'text-tertiary'}`}>
                                                {format(new Date(sched.estimatedArrivalTime.getTime() + ((truck?.delayMinutes || 0) * 60000)), 'HH:mm dd/MM')}
                                            </div>
                                            {isDelayed && <div className="text-[10px] font-label text-[#E63329]/70">+{truck.delayMinutes}m</div>}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${
                                                sched.status === 'IN_TRANSIT' ? 'bg-secondary/10 text-secondary' : 'bg-surface-container-higher text-slate-400 border border-white/5'
                                            }`}>
                                                {sched.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export const Alerts = () => {
    const alerts = useStore(state => state.alerts);
    const trucks = useStore(state => state.trucks);
    const { resolveAlert } = useStore();

    const activeAlertsCount = alerts.filter(a => !a.resolved).length;
    const criticalAlertsCount = alerts.filter(a => !a.resolved && a.severity === 'CRITICAL').length;
    const resolvedCount = alerts.filter(a => a.resolved).length;

    return (
        <div className="space-y-4 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-6 bg-[#E63329]"></div>
                        <h1 className="text-3xl font-headline font-bold tracking-tight text-on-surface">Alerts & Incidents</h1>
                    </div>
                    <p className="text-slate-400 font-label text-sm">Real-time monitoring of fleet deviations and critical transport events.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="glass-card p-4 rounded-xl">
                    <span className="text-[10px] font-technical text-slate-500 uppercase tracking-widest block mb-1">Active Alerts</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-headline font-bold text-on-surface">{activeAlertsCount}</span>
                    </div>
                </div>
                <div className="glass-card p-4 rounded-xl border-l-2 border-l-error">
                    <span className="text-[10px] font-technical text-slate-500 uppercase tracking-widest block mb-1">Critical Priority</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-headline font-bold text-error">{criticalAlertsCount}</span>
                        <span className="material-symbols-outlined text-error text-sm">priority_high</span>
                    </div>
                </div>
                <div className="glass-card p-4 rounded-xl border-l-2 border-l-tertiary">
                    <span className="text-[10px] font-technical text-slate-500 uppercase tracking-widest block mb-1">Resolved History</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-headline font-bold text-tertiary">{resolvedCount}</span>
                        <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
                    </div>
                </div>
            </div>
            
            <div className="space-y-4">
              {alerts.length === 0 && <div className="glass-card p-8 rounded-xl text-center"><p className="text-slate-500 font-technical text-xs uppercase tracking-widest">No alerts in history.</p></div>}
              {alerts.map(alert => {
                  const isCritical = alert.severity === 'CRITICAL';
                  const isWarning = alert.severity === 'WARNING';
                  const isResolved = alert.resolved;
                  
                  let colorClass = isCritical ? 'text-error bg-error/10 border-error/20' : (isWarning ? 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20' : 'text-secondary bg-secondary/10 border-secondary/20');
                  let icon = isCritical ? 'error' : (isWarning ? 'warning' : 'info');
                  if(alert.type === 'GEOFENCE_DEVIATION') icon = 'wrong_location';
                  if(alert.type === 'DELAY') icon = 'schedule';

                  if (isResolved) {
                      colorClass = 'text-slate-500 bg-surface-container-highest/20 border-white/5';
                  }

                  return (
                      <div key={alert.id} className={`glass-card p-5 rounded-xl flex items-center gap-6 group hover:scale-[1.005] transition-all border ${isResolved ? 'opacity-60 border-transparent' : 'border-white/5'}`}>
                          <div className={`flex flex-col items-center justify-center w-12 h-12 rounded border ${colorClass}`}>
                              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                          </div>
                          
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                              <div className="md:col-span-3">
                                  <div className="flex items-center gap-2 mb-1">
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-tighter uppercase font-technical ${colorClass}`}>{alert.type.replace('_', ' ')}</span>
                                      {isResolved && <span className="text-[10px] font-bold text-tertiary uppercase">Resolved</span>}
                                  </div>
                                  <h3 className={`font-headline font-semibold ${isResolved ? 'text-slate-400' : 'text-on-surface'}`}>{alert.message}</h3>
                              </div>
                              <div className="md:col-span-3">
                                  <span className="text-[10px] text-slate-500 font-label block uppercase mb-1">Vehicle Ref</span>
                                  <span className="font-technical text-sm font-bold text-slate-300">{trucks.find(t => t.id === alert.truckId)?.registrationNumber || alert.truckId}</span>
                              </div>
                              <div className="md:col-span-4 flex justify-start items-center">
                                  {!isResolved && <span className="bg-white/5 text-slate-400 px-3 py-1 text-xs rounded-full border border-white/10 font-label">Location: Pending Verify</span>}
                              </div>
                              <div className="md:col-span-2 text-right">
                                  <span className="font-technical text-xs text-slate-500 block mb-2">{formatDistanceToNow(alert.timestamp, { addSuffix: true })}</span>
                                  {!isResolved && (
                                      <button onClick={() => resolveAlert(alert.id)} className="border border-outline-variant hover:bg-white/5 text-slate-300 text-[10px] font-bold py-1.5 px-4 rounded transition-all uppercase tracking-widest">
                                          Acknowledge
                                      </button>
                                  )}
                              </div>
                          </div>
                      </div>
                  )
              })}
            </div>
        </div>
    );
};

export const Settings = () => {
    const trucks = useStore(state => state.trucks);
    const routes = useStore(state => state.routes);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const spareCapacityTrucks = trucks.filter(t => {
        const sparePct = ((t.capacity - t.currentLoad) / t.capacity) * 100;
        return sparePct > 20;
    });

    const mockActiveOffers = [
        { id: 'off-001', vehicle: 'MH-04-1234', route: 'Ahmedabad » Delhi', offered: 2, status: 'MATCHED', partner: 'BlueDart Transit' },
        { id: 'off-002', vehicle: 'DL-01-AZ-1111', route: 'Delhi » Lucknow » Varanasi', offered: 6, status: 'PENDING', partner: '-' },
    ];

    return (
        <div className="space-y-6">
            {toastMessage && (
                <div className="fixed top-24 right-6 glass-card bg-[#00a572]/20 border border-[#00a572]/50 text-white px-5 py-3 rounded-lg shadow-xl z-50 flex items-center gap-3 animate-fade-in-down">
                    <span className="material-symbols-outlined text-tertiary">check_circle</span>
                    <span className="font-label text-sm">{toastMessage}</span>
                </div>
            )}
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-headline font-bold tracking-tight text-on-surface mb-2">Spare Capacity & 3PL Integration</h1>
                    <p className="text-slate-400 font-body max-w-xl text-sm">Monetize unused capacity by offering it to 3PL logistics partners through immediate brokerage.</p>
                </div>
            </div>
            
            <div className="glass-card rounded-xl overflow-hidden shadow-2xl">
                <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-surface-container-low/30">
                    <h3 className="font-headline font-semibold text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">add_shopping_cart</span>
                        Available Spare Capacity (&gt;20%)
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-lowest/50">
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Vehicle / Route</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Current Load</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Available Tonnage</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {spareCapacityTrucks.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-8 text-slate-500 font-technical text-xs uppercase">Network fully utilized. No spare capacity.</td></tr>
                            ) : (
                                spareCapacityTrucks.map(truck => {
                                    const route = routes.find(r => r.id === truck.routeId);
                                    const spare = truck.capacity - truck.currentLoad;
                                    const sparePct = Math.round((spare / truck.capacity) * 100);
                                    
                                    return (
                                        <tr key={truck.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-5 flex flex-col">
                                                <span className="font-technical text-sm text-primary-fixed">{truck.registrationNumber}</span>
                                                <span className="font-body text-xs text-slate-400 mt-1">{route?.name || 'Unknown Route'}</span>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-slate-300 font-technical">{truck.currentLoad}T / {truck.capacity}T</td>
                                            <td className="px-6 py-5 min-w-[180px]">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="font-technical text-sm font-bold text-tertiary">{parseFloat(spare.toFixed(2))} T</span>
                                                    <span className="text-[10px] text-tertiary/70 font-technical bg-tertiary/10 px-2 py-0.5 rounded border border-tertiary/20">{sparePct}% OPEN</span>
                                                </div>
                                                <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                                                    <div className="h-full bg-slate-500" style={{ width: `${100-sparePct}%` }}></div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button 
                                                    onClick={() => showToast(`Capacity offer sent to 3PL Network for ${truck.registrationNumber}`)}
                                                    className="bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary px-4 py-2 rounded text-[10px] font-bold transition-colors uppercase tracking-widest"
                                                >
                                                    Broker Capacity
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="glass-card rounded-xl overflow-hidden shadow-2xl">
                <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-surface-container-low/30">
                    <h3 className="font-headline font-semibold text-sm flex items-center gap-2 text-slate-300">
                        <span className="material-symbols-outlined text-slate-400">sync_alt</span>
                        Active Brokerage Offers
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-lowest/50">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Offer ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Vehicle / Route</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Offered Space</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">Matched Partner</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {mockActiveOffers.map(offer => (
                                <tr key={offer.id} className="hover:bg-white/[0.02]">
                                    <td className="px-6 py-5 font-technical text-sm text-slate-400">{offer.id}</td>
                                    <td className="px-6 py-5 flex flex-col">
                                        <span className="font-technical text-sm text-slate-200">{offer.vehicle}</span>
                                        <span className="font-body text-xs text-slate-400 mt-1">{offer.route}</span>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-technical text-secondary">{offer.offered} T</td>
                                    <td className="px-6 py-5 text-sm font-label text-slate-300">{offer.partner}</td>
                                    <td className="px-6 py-5 text-right">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${offer.status === 'MATCHED' ? 'bg-tertiary/10 text-tertiary border border-tertiary/20' : 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20'}`}>
                                            {offer.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
