import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useWellness } from '../context/WellnessContext';

const moodData = [
  { name: 'Mon', val: 60 },
  { name: 'Tue', val: 70 },
  { name: 'Wed', val: 50 },
  { name: 'Thu', val: 90 },
  { name: 'Fri', val: 80 },
  { name: 'Sat', val: 100 },
  { name: 'Sun', val: 85 },
];

const efficiencyData = [
  { name: 'Mon', sleep: 80, perf: 60 },
  { name: 'Tue', sleep: 70, perf: 65 },
  { name: 'Wed', sleep: 90, perf: 80 },
  { name: 'Thu', sleep: 85, perf: 95 },
  { name: 'Fri', sleep: 60, perf: 70 },
  { name: 'Sat', sleep: 95, perf: 90 },
  { name: 'Sun', sleep: 100, perf: 100 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-high border border-white/10 p-2 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-label-sm text-on-surface-variant mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-label-md font-bold" style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const { gamification, addXP, unlockBadge } = useWellness();
  const [protocolApplied, setProtocolApplied] = useState(false);

  // Generate Cortisol Map cells
  const cortisolCells = Array.from({ length: 28 }).map((_, i) => {
    const intensityClasses = [
      'bg-primary/5', 'bg-primary/10', 'bg-primary/20', 'bg-primary/40', 'bg-primary-fixed-dim',
      'bg-primary/10', 'bg-primary/5', 'bg-secondary/20', 'bg-secondary/40', 'bg-secondary-container'
    ];
    return intensityClasses[Math.floor(Math.random() * intensityClasses.length)];
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="space-y-lg pb-8"
    >
      {/* Level Progress Bento */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <div className="md:col-span-2 glass-card p-lg rounded-xl flex flex-col justify-between min-h-[160px] relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant/70 uppercase tracking-widest">Current Standing</p>
              <h2 className="font-display-lg text-display-lg text-primary-fixed-dim mt-xs">Level {Math.floor(gamification.xp / 100)}</h2>
            </div>
            <div className="text-right">
              <p className="font-label-md text-label-md text-on-surface-variant/70">Bio-Sync Rank</p>
              <p className="font-headline-md text-headline-md text-secondary">Elite Scout</p>
            </div>
          </div>
          <div className="mt-xl z-10">
            <div className="flex justify-between font-label-sm text-label-sm mb-sm">
              <span className="text-primary-fixed-dim">{gamification.xp % 100} XP</span>
              <span className="text-on-surface-variant">100 XP to next</span>
            </div>
            <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-primary-fixed-dim xp-glow rounded-full transition-all duration-1000 ease-out" style={{ width: `${gamification.xp % 100}%` }}></div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
          </div>
        </div>
        
        <div className="glass-card p-lg rounded-xl flex flex-col justify-center items-center text-center space-y-md border-l-4 border-l-primary/30">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <span className="material-symbols-outlined text-primary-fixed-dim text-[32px]">bolt</span>
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface">Daily Output</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">You are in the top 5% of users today.</p>
          </div>
        </div>
      </section>

      {/* Main Analytics Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* Mood Trend Chart */}
        <div className="glass-card p-lg rounded-xl flex flex-col h-[320px]">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
              <span className="material-symbols-outlined">psychology</span> Mood Trend
            </h3>
            <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-3 py-1 rounded-full border border-white/5">7 Day Delta</span>
          </div>
          <div className="flex-grow w-full h-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(225, 224, 251, 0.4)', fontSize: 12 }} />
                <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <Line 
                  type="monotone" 
                  dataKey="val" 
                  name="Mood"
                  stroke="#FF6A00" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#FF6A00', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Efficiency Sync */}
        <div className="glass-card p-lg rounded-xl flex flex-col h-[320px]">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
              <span className="material-symbols-outlined">bedtime</span> Efficiency Sync
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary-fixed-dim"></span>
                <span className="font-label-sm text-label-sm">Sleep</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="font-label-sm text-label-sm">Perf</span>
              </div>
            </div>
          </div>
          <div className="flex-grow w-full h-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={efficiencyData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(225, 224, 251, 0.4)', fontSize: 12 }} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                <Line 
                  type="monotone" 
                  dataKey="sleep" 
                  name="Sleep"
                  stroke="rgba(0, 219, 231, 0.5)" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="perf" 
                  name="Performance"
                  stroke="#ebb2ff" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#fff' }}
                  style={{ filter: 'drop-shadow(0 0 8px rgba(235, 178, 255, 0.6))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cortisol Map */}
        <div className="glass-card p-lg rounded-xl flex flex-col col-span-1">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
              <span className="material-symbols-outlined">grid_view</span> Cortisol Map
            </h3>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Last 4 Weeks</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {cortisolCells.map((cls, i) => (
              <div key={i} className={`aspect-square rounded-sm border border-white/5 transition-transform hover:scale-110 hover:z-10 ${cls}`}></div>
            ))}
          </div>
          <div className="mt-md flex justify-between items-center font-label-sm text-label-sm text-on-surface-variant">
            <span>Low Stress</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-primary/10"></div>
              <div className="w-3 h-3 rounded-sm bg-primary/40"></div>
              <div className="w-3 h-3 rounded-sm bg-primary-fixed-dim"></div>
              <div className="w-3 h-3 rounded-sm bg-secondary-container"></div>
            </div>
            <span>Peak Optimization</span>
          </div>
        </div>

        {/* Recovery History */}
        <div className="glass-card p-lg rounded-xl flex flex-col col-span-1">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
              <span className="material-symbols-outlined">restore</span> Recovery History
            </h3>
            <span className="text-tertiary font-label-md text-label-md">+14% Growth</span>
          </div>
          <div className="flex-grow flex items-end justify-between gap-2 h-40">
            {[60, 45, 85, 40, 70, 95, 55, 75].map((h, i) => (
              <div key={i} className={`flex-1 rounded-t-sm transition-colors cursor-pointer hover:bg-primary-fixed-dim ${h > 80 ? 'bg-primary-fixed-dim' : h > 60 ? 'bg-primary/40' : 'bg-surface-container'}`} style={{ height: `${h}%` }}></div>
            ))}
          </div>
          <div className="mt-sm flex justify-between font-label-sm text-label-sm text-on-surface-variant">
            <span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W5</span><span>W6</span><span>W7</span><span>W8</span>
          </div>
        </div>
      </section>

      {/* Insights Banner */}
      <section className="glass-card p-lg rounded-xl relative overflow-hidden group hover:border-primary/40 transition-colors">
        <div className="flex flex-col md:flex-row justify-between items-center gap-lg z-10 relative">
          <div className="flex items-center gap-lg">
            <div className="p-4 bg-tertiary/10 rounded-xl border border-tertiary/20">
              <span className="material-symbols-outlined text-tertiary-fixed-dim text-3xl">lightbulb</span>
            </div>
            <div>
              <h4 className="font-headline-md text-headline-md text-on-surface">Weekly AI Synthesis</h4>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Your cardiovascular recovery is peaking earlier in the circadian cycle. Suggest shifting high-intensity training to 08:30 AM.</p>
            </div>
          </div>
          <button 
            onClick={() => {
              if (!protocolApplied) {
                setProtocolApplied(true);
                addXP(50);
                unlockBadge('Protocol Adherent');
              }
            }}
            disabled={protocolApplied}
            className={`px-lg py-sm rounded-full font-label-md text-label-md transition-all shadow-lg ${
              protocolApplied 
                ? 'bg-primary-fixed-dim/20 text-primary-fixed-dim cursor-default shadow-none border border-primary-fixed-dim/30' 
                : 'bg-primary text-on-primary hover:scale-105 active:scale-95 shadow-primary/20'
            }`}
          >
            {protocolApplied ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span> 
                Applied
              </span>
            ) : "Apply Protocol"}
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </section>
    </motion.div>
  );
};

export default Analytics;
