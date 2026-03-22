import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const onTimeData = [
  { day: 'Mon', onTime: 82 },
  { day: 'Tue', onTime: 88 },
  { day: 'Wed', onTime: 85 },
  { day: 'Thu', onTime: 92 },
  { day: 'Fri', onTime: 90 },
  { day: 'Sat', onTime: 95 },
  { day: 'Sun', onTime: 96 },
];

const utilizationData = [
  { route: 'NH-76', util: 85 },
  { route: 'SR-12', util: 45 },
  { route: 'DEL-VAR', util: 92 },
  { route: 'MUM-RAI', util: 78 },
  { route: 'CHE-HYD', util: 62 },
  { route: 'KOL-VIS', util: 88 },
  { route: 'JAI-AHD', util: 70 },
];

const alertData = [
  { name: 'DELAY', value: 45 },
  { name: 'GEOFENCE', value: 25 },
  { name: 'BREAKDOWN', value: 10 },
  { name: 'TRAFFIC', value: 20 },
];

const COLORS = ['#F59E0B', '#ff5545', '#EF4444', '#0566d9'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface-container-highest/90 backdrop-blur border border-white/10 p-3 rounded shadow-lg">
                <p className="text-white font-label text-sm mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={`item-${index}`} className="text-xs font-technical" style={{ color: entry.color }}>
                        {entry.name}: {entry.value}%
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export const Reports = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <nav className="flex gap-2 text-[10px] text-slate-500 font-technical uppercase tracking-widest mb-1">
                        <span>Operations</span>
                        <span>/</span>
                        <span className="text-slate-300">Management Information System</span>
                    </nav>
                    <h1 className="text-4xl font-headline font-bold tracking-tight text-on-surface">
                        Executive Summary <span className="text-slate-600 font-light">Q3 2024</span>
                    </h1>
                </div>
                <div className="flex gap-4">
                    <div className="hidden md:flex bg-surface-container-high p-1 rounded">
                        <button className="px-4 py-2 text-xs font-medium rounded bg-surface-container-highest text-white">Daily</button>
                        <button className="px-4 py-2 text-xs font-medium rounded text-slate-400 hover:text-white transition-all">Weekly</button>
                        <button className="px-4 py-2 text-xs font-medium rounded text-slate-400 hover:text-white transition-all">Monthly</button>
                    </div>
                    <button className="bg-primary-container text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-[0_4px_14px_rgba(230,51,41,0.3)]">
                        <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                        <span className="text-xs tracking-wider uppercase">Export Data</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-card p-5 rounded-xl">
                    <p className="text-[10px] font-technical text-slate-400 uppercase tracking-widest mb-2">Total Shipments</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-headline font-bold text-on-surface">124,590</span>
                        <span className="text-tertiary text-xs font-technical">+12.4%</span>
                    </div>
                </div>
                <div className="glass-card p-5 rounded-xl">
                    <p className="text-[10px] font-technical text-slate-400 uppercase tracking-widest mb-2">System Uptime</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-headline font-bold text-on-surface">99.98%</span>
                        <span className="text-tertiary text-xs font-technical">Optimal</span>
                    </div>
                </div>
                <div className="glass-card p-5 rounded-xl">
                    <p className="text-[10px] font-technical text-slate-400 uppercase tracking-widest mb-2">Active Fleet</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-headline font-bold text-on-surface">1,842</span>
                        <span className="text-slate-400 text-xs font-technical">Vehicles</span>
                    </div>
                </div>
                <div className="glass-card p-5 rounded-xl border-l-[3px] border-error">
                    <p className="text-[10px] font-technical text-slate-400 uppercase tracking-widest mb-2">Avg Delay (mins)</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-headline font-bold text-on-surface">28</span>
                        <span className="text-error text-xs font-technical">+5 mins</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8 glass-card p-6 rounded-xl flex flex-col h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-headline font-semibold text-lg text-on-surface">On-Time Performance</h3>
                            <p className="text-xs text-slate-500 font-label">7-Day operational variance analysis</p>
                        </div>
                    </div>
                    <div className="flex-1 min-h-0 w-full ml-[-20px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={onTimeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'IBM Plex Mono' }} dy={10} />
                                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="onTime" name="Performance" stroke="#ffb4a9" strokeWidth={3} dot={{ r: 4, fill: '#ffb4a9', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#fff' }} />
                                <Line type="monotone" dataKey={() => 95} name="Target" stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="5 5" dot={false} activeDot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="xl:col-span-4 glass-card p-6 rounded-xl flex flex-col h-[400px]">
                    <h3 className="font-headline font-semibold text-lg text-on-surface mb-2">Alert Breakdown</h3>
                    <p className="text-xs text-slate-500 font-label mb-4">Distribution by severity</p>
                    <div className="flex-1 min-h-0 relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={alertData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {alertData.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-headline font-bold text-on-surface">100</span>
                            <span className="text-[10px] font-technical text-slate-500 uppercase">Total</span>
                        </div>
                    </div>
                    <div className="mt-2 text-xs font-label">
                         <div className="flex justify-between items-center py-1">
                             <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full border border-white/20" style={{background: COLORS[0]}}></span><span className="text-slate-300">Delay</span></div>
                             <span className="font-technical text-white">45%</span>
                         </div>
                         <div className="flex justify-between items-center py-1">
                             <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full border border-white/20" style={{background: COLORS[1]}}></span><span className="text-slate-300">Geofence</span></div>
                             <span className="font-technical text-white">25%</span>
                         </div>
                         <div className="flex justify-between items-center py-1">
                             <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full border border-white/20" style={{background: COLORS[2]}}></span><span className="text-slate-300">Breakdown</span></div>
                             <span className="font-technical text-white">10%</span>
                         </div>
                    </div>
                </div>

                <div className="xl:col-span-12 glass-card p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-headline font-semibold text-lg text-on-surface">Capacity Utilization Hubs</h3>
                            <p className="text-xs text-slate-500 font-label">Load factor vs theoretical capacity</p>
                        </div>
                    </div>
                    <div className="w-full ml-[-20px] h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={utilizationData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} stroke="rgba(255,255,255,0.1)" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                                <YAxis dataKey="route" type="category" width={80} axisLine={false} tickLine={false} tick={{ fill: '#e2e8f0', fontSize: 11, fontFamily: 'Inter' }} />
                                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                                <Bar dataKey="util" name="Utilization" radius={[0, 4, 4, 0]} barSize={16}>
                                    {utilizationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.util >= 85 ? '#ffb4a9' : entry.util >= 60 ? '#adc6ff' : '#2f3445'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
