import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useStore } from '../../store';

const navigation = [
  { name: 'Live Map', href: '/', icon: 'map' },
  { name: 'Fleet Overview', href: '/fleet', icon: 'local_shipping' },
  { name: 'Schedules', href: '/schedules', icon: 'calendar_today' },
  { name: 'Alerts', href: '/alerts', icon: 'warning' },
  { name: 'MIS Reports', href: '/reports', icon: 'assessment' },
  { name: '3PL & Settings', href: '/settings', icon: 'local_shipping' }
];

const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) => {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside 
        className={`flex flex-col h-screen fixed left-0 top-0 pt-16 bg-[#0e1322] w-64 shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-6 py-8">
          <p className="font-headline text-[#E63329] font-black tracking-tight text-lg">Command Center</p>
          <p className="font-label text-xs text-slate-500 uppercase tracking-widest mt-1">RTN Operations</p>
        </div>
        
        <nav className="flex-1 px-3 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 font-medium text-sm transition-all ${
                  isActive 
                    ? 'bg-[#E63329]/10 text-[#E63329] border-r-4 border-[#E63329] scale-[0.98]' 
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/5 hover:backdrop-blur-sm'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-3 border-t border-white/5">
          <button onClick={() => alert("RTN Telematics v1.0 — India Post Minor Project")} className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all text-sm">
            <span className="material-symbols-outlined">help</span> Support
          </button>
          <button onClick={() => alert("Session management not available in simulation mode.")} className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all text-sm">
            <span className="material-symbols-outlined">logout</span> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const alerts = useStore((state) => state.alerts);
  const trucks = useStore((state) => state.trucks);
  const activeAlertsCount = alerts.filter(a => !a.resolved).length;
  const delayedCount = trucks.filter(t => t.status === 'DELAYED').length;
  
  const totalCap = trucks.reduce((acc, t) => acc + t.capacity, 0);
  const totalLoad = trucks.reduce((acc, t) => acc + t.currentLoad, 0);
  const netUtil = totalCap > 0 ? Math.round((totalLoad / totalCap) * 100) : 0;

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB'));
  const prevAlertCount = useRef(alerts.length);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString('en-GB')), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (alerts.length > prevAlertCount.current) {
        if (soundEnabled) {
            const playBeep = () => {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.value = 880;
              gain.gain.setValueAtTime(0.1, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
              osc.start(ctx.currentTime);
              osc.stop(ctx.currentTime + 0.3);
            };
            playBeep();
        }
        prevAlertCount.current = alerts.length;
    }
  }, [alerts.length, soundEnabled]);

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0e1322]/80 backdrop-blur-xl flex justify-between items-center w-full px-4 md:px-6 py-3 border-b border-white/5 h-[60px]">
      <div className="flex items-center gap-4 md:gap-8">
        <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="text-lg md:text-xl font-headline font-bold tracking-tighter text-[#E63329] uppercase">India Post RTN Telematics</h1>
        
        <div className="hidden md:flex items-center gap-6 text-slate-400 font-medium text-sm">
          {navigation.slice(0, 3).map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `transition-all duration-300 px-2 py-1 cursor-pointer ${
                  isActive ? 'text-[#E63329] font-bold border-b-2 border-[#E63329]' : 'hover:bg-white/5'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-3 md:gap-6">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
          <span className="live-pulse w-2 h-2 rounded-full bg-[#E63329]"></span>
          <span className="font-technical text-xs font-bold text-[#E63329]">LIVE</span>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4 relative">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className={`cursor-pointer hover:bg-white/5 p-1 transition-all rounded-full flex items-center justify-center ${soundEnabled ? 'text-[#00a572]' : 'text-slate-500'}`}>
            <span className="material-symbols-outlined text-xl">{soundEnabled ? 'volume_up' : 'volume_off'}</span>
          </button>
          <button className="text-slate-400 cursor-pointer hover:bg-white/5 p-1 transition-all rounded-full relative ml-2">
            <span className="material-symbols-outlined">notifications</span>
            {activeAlertsCount > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#E63329] rounded-full border border-[#0e1322]"></span>
            )}
          </button>
          <button className="hidden sm:block text-slate-400 cursor-pointer hover:bg-white/5 p-1 transition-all rounded-full">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-slate-300 font-bold text-xs uppercase overflow-hidden ml-2">
            IP
          </div>
        </div>
      </div>
    </header>
    <div className="fixed top-[60px] left-0 right-0 z-40 bg-black/40 border-b border-white/5 px-6 flex items-center gap-8 text-[11px] font-technical text-slate-400 h-8 whitespace-nowrap overflow-x-auto custom-scrollbar overflow-y-hidden lg:pl-72 lg:pr-6">
      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00a572]"></span> Active Trucks: {trucks.length}</span>
      <span className="text-white/20">|</span>
      <span>⚡ Network Utilization: {netUtil}%</span>
      <span className="text-white/20">|</span>
      <span className="text-[#F59E0B]">⚠ Unresolved Alerts: {activeAlertsCount}</span>
      <span className="text-white/20">|</span>
      <span className="text-[#E63329]">🔴 Delayed: {delayedCount}</span>
      <div className="flex-1 min-w-[20px]"></div>
      <span className="text-[#E63329] font-bold tracking-widest">{time}</span>
    </div>
    </>
  );
};

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface font-body overflow-hidden flex">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="flex-1 lg:ml-64 pt-28 p-4 md:p-6 h-screen overflow-y-auto flex flex-col gap-6 custom-scrollbar">
        <Outlet />
      </main>

      <nav className="md:hidden fixed bottom-1 left-0 right-0 glass-card mx-2 rounded-xl z-50 px-6 py-2 flex justify-around items-center">
        {navigation.slice(0, 5).map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex flex-col items-center ${isActive ? 'text-[#E63329]' : 'text-slate-500 hover:text-slate-300'}`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[10px] font-label mt-1 text-center leading-tight">{item.name === 'Fleet Overview' ? 'Fleet' : item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
