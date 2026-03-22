import { useStore } from '../../store';
import { formatCapacityPercentage } from '../../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

export const AnalyticsHeroCards = () => {
  const { trucks, alerts } = useStore();
  
  const activeAlerts = alerts.filter(a => !a.resolved);
  const criticalAlerts = activeAlerts.filter(a => a.severity === 'CRITICAL').length;
  const delayedTrucksCount = trucks.filter(t => t.status === 'DELAYED').length;
  const onTimeTrucksCount = trucks.filter(t => t.status === 'ON_TIME').length;

  const totalCapacity = trucks.reduce((acc, t) => acc + t.capacity, 0);
  const totalLoad = trucks.reduce((acc, t) => acc + t.currentLoad, 0);
  const networkUtilization = formatCapacityPercentage(totalLoad, totalCapacity);
  
  const onTimePct = Math.round((onTimeTrucksCount / (trucks.length || 1)) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <div className="glass-card p-5 rounded-lg flex flex-col justify-between transition-all duration-300">
        <div className="flex justify-between items-start">
          <span className="text-xs font-label text-slate-400 uppercase tracking-wider">Network Capacity</span>
          <span className="material-symbols-outlined text-secondary text-sm">pie_chart</span>
        </div>
        <div className="mt-4 flex items-end gap-2">
          <span className="text-3xl font-headline font-bold text-on-surface">{networkUtilization}</span>
          <span className="text-lg font-headline text-slate-500 mb-1">%</span>
        </div>
        <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-secondary" style={{ width: `${networkUtilization}%` }}></div>
        </div>
      </div>

      <div className="glass-card p-5 rounded-lg flex flex-col justify-between transition-all duration-300">
        <div className="flex justify-between items-start">
          <span className="text-xs font-label text-slate-400 uppercase tracking-wider">Active Alerts</span>
          <span className="material-symbols-outlined text-[#E63329] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
        </div>
        <div className="mt-4 flex items-end gap-2">
          <span className="text-3xl font-headline font-bold text-[#E63329]">{activeAlerts.length}</span>
          <span className="text-xs font-label text-[#E63329]/60 mb-1 uppercase">{criticalAlerts} CRITICAL</span>
        </div>
        <div className="mt-2 text-[10px] font-technical text-slate-500 uppercase">Live Updates</div>
      </div>

      <div className="glass-card p-5 rounded-lg flex flex-col justify-between transition-all duration-300 border-l-4 border-l-tertiary">
        <div className="flex justify-between items-start">
          <span className="text-xs font-label text-slate-400 uppercase tracking-wider">On-Time Trucks</span>
          <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
        </div>
        <div className="mt-4 flex items-end gap-2">
          <span className="text-3xl font-headline font-bold text-tertiary">{onTimeTrucksCount}</span>
          <span className="text-xs font-label text-slate-500 mb-1 uppercase">UNITS</span>
        </div>
        <div className="mt-2 text-[10px] font-technical text-tertiary uppercase">{onTimePct}% OF TOTAL FLEET</div>
      </div>

      <div className="glass-card p-5 rounded-lg flex flex-col justify-between transition-all duration-300 border-l-4 border-l-[#F59E0B]">
        <div className="flex justify-between items-start">
          <span className="text-xs font-label text-slate-400 uppercase tracking-wider">Delayed Trucks</span>
          <span className="material-symbols-outlined text-[#F59E0B] text-sm">schedule</span>
        </div>
        <div className="mt-4 flex items-end gap-2">
          <span className="text-3xl font-headline font-bold text-[#F59E0B]">{delayedTrucksCount}</span>
          <span className="text-xs font-label text-slate-500 mb-1 uppercase">UNITS</span>
        </div>
        <div className="mt-2 text-[10px] font-technical text-[#F59E0B] uppercase">Requires Attention</div>
      </div>
    </div>
  );
};

export const LiveAlertsFeed = () => {
   const { alerts, resolveAlert } = useStore();
   const activeAlerts = alerts.filter(a => !a.resolved);
   const recentAlerts = activeAlerts.slice(0, 5);

   return (
     <div className="glass-card rounded-lg flex flex-col overflow-hidden h-full">
       <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
         <h2 className="font-headline font-bold text-sm text-slate-200">Live Alert Feed</h2>
         <span className="text-[10px] font-technical text-slate-500 px-2 py-0.5 border border-white/10 rounded">{activeAlerts.length} ITEMS</span>
       </div>
       
       <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
         {recentAlerts.length === 0 ? (
            <div className="text-center text-slate-500 py-8 font-technical text-xs border border-dashed border-white/10 rounded">No active alerts. All systems nominal.</div>
         ) : (
           recentAlerts.map(alert => {
             const isCritical = alert.severity === 'CRITICAL';
             const isWarning = alert.severity === 'WARNING';
             const colorHex = isCritical ? '#E63329' : (isWarning ? '#F59E0B' : '#adc6ff'); // Error, Warning, Secondary

             return (
               <div 
                 key={alert.id} 
                 onClick={() => resolveAlert(alert.id)}
                 className={`p-3 bg-[${colorHex}]/5 border-l-4 border-l-[${colorHex}] rounded flex flex-col gap-2 hover:bg-[${colorHex}]/10 transition-colors cursor-pointer group relative`}
                 style={{ borderLeftColor: colorHex, backgroundColor: `${colorHex}0A` }}
               >
                 <div className="flex justify-between items-start">
                   <span className={`text-[10px] font-technical font-bold uppercase`} style={{ color: colorHex }}>
                     {isCritical ? 'Critical Severity' : (isWarning ? 'Warning Alert' : 'Information')}
                   </span>
                   <span className="text-[10px] font-technical text-slate-500">
                     {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                   </span>
                 </div>
                 <p className="text-sm font-medium text-slate-100 leading-tight pr-6">{alert.message}</p>
                 <div className="flex items-center justify-between mt-1">
                   <span className="text-[10px] font-technical text-slate-400">Truck: {alert.truckId}</span>
                   <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform" style={{ color: colorHex }}>arrow_forward_ios</span>
                 </div>
                 
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#0e1322]/80 backdrop-blur-sm rounded z-10">
                    <span className="text-xs font-bold text-white uppercase tracking-widest border border-white/20 px-4 py-1 rounded">Click to Resolve</span>
                 </div>
               </div>
             );
           })
         )}
       </div>
       
       <div className="p-4 bg-white/5 border-t border-white/5">
         <Link to="/alerts" className="block w-full text-center py-2 bg-secondary/10 text-secondary border border-secondary/20 font-headline font-bold text-xs uppercase tracking-widest rounded hover:bg-secondary hover:text-white transition-all">
           View All Alert History
         </Link>
       </div>
     </div>
   );
};
