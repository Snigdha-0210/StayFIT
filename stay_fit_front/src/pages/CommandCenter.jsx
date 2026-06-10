import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWellness } from '../context/WellnessContext';
import { generateCommandBrief, calculateRecoveryConfidence } from '../ai/engine';
import { generateCoachingText } from '../api/aiClient';
import physicalCover from '../assets/physical_cover.png';
import mentalCover from '../assets/mental_cover.png';

const CommandCenter = () => {
  const { metrics, readiness, sleepScore, recoveryScore, burnoutRisk, metricsHistory } = useWellness();
  const [dashOffset, setDashOffset] = useState(283);
  const [commandBrief, setCommandBrief] = useState("Analyzing biometrics...");
  const [routines, setRoutines] = useState({
    physical: "Synchronizing...",
    mental: "Synchronizing..."
  });

  useEffect(() => {
    // Delay animation slightly for effect
    const timer = setTimeout(() => {
      setDashOffset(283 - (283 * readiness) / 100);
    }, 300);
    return () => clearTimeout(timer);
  }, [readiness]);

  useEffect(() => {
    let isMounted = true;
    const fetchBrief = async () => {
      // simulate artificial delay for engine to "process"
      const brief = await generateCommandBrief(metrics, readiness, metricsHistory);
      if (isMounted) setCommandBrief(brief);

      try {
        const payload = {
          mood: "Good",
          sleep: sleepScore,
          energy: metrics.energy,
          stress: metrics.stress,
          workout: metrics.workoutIntensity,
          burnoutScore: burnoutRisk?.label || "Low",
          recoveryScore: recoveryScore
        };
        const rawText = await generateCoachingText(payload);
        
        let physicalMatch = rawText.match(/PHYSICAL:\s*(.*?)(?=\nMENTAL:|\nMOTIVATION:|$)/is);
        let mentalMatch = rawText.match(/MENTAL:\s*(.*?)(?=\nMOTIVATION:|\nPHYSICAL:|$)/is);
        
        if (isMounted) {
          setRoutines({
            physical: physicalMatch ? physicalMatch[1].trim() : "15m Active Recovery Flow",
            mental: mentalMatch ? mentalMatch[1].trim() : "10m Guided NSDR Protocol"
          });
        }
      } catch (err) {
        console.error("Failed to generate routines", err);
        if (isMounted) {
          setRoutines({
            physical: "15m Active Recovery Flow",
            mental: "10m Guided NSDR Protocol"
          });
        }
      }
    };
    fetchBrief();
    return () => { isMounted = false; };
  }, [metrics, readiness, metricsHistory]);



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-lg"
    >
      {/* Readiness Index Central Gauge */}
      <section className="flex flex-col items-center justify-center py-lg relative overflow-hidden">
        <div className="absolute top-0 md:top-4 right-0 md:right-4 z-20">
          <div className="glass-card px-4 py-2 rounded-full border border-primary/20 flex items-center gap-2 shadow-lg shadow-primary/5">
             <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
             <span className="font-label-sm text-label-sm text-on-surface">System Confidence: {calculateRecoveryConfidence(metricsHistory)}%</span>
          </div>
        </div>
        <div className="animation-gauge-load relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle className="text-white/5 stroke-current" cx="50" cy="50" fill="transparent" r="45" strokeWidth="6"></circle>
            <circle
              className="recovery-ring text-primary-fixed-dim stroke-current transition-all duration-[1500ms] ease-out"
              cx="50"
              cy="50"
              fill="transparent"
              r="45"
              strokeLinecap="round"
              strokeWidth="6"
              style={{
                strokeDashoffset: dashOffset,
                filter: 'drop-shadow(0 0 8px rgba(0, 219, 231, 0.6))'
              }}
            ></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Readiness Index</span>
            <span className="font-display-lg text-display-lg text-primary-fixed-dim">{readiness}%</span>
            <span className="font-label-sm text-label-sm text-tertiary-fixed-dim mt-unit flex items-center gap-xs">
              <span className="material-symbols-outlined text-[14px]">
                {readiness > 75 ? 'trending_up' : readiness > 40 ? 'trending_flat' : 'trending_down'}
              </span>
              {readiness > 75 ? 'Optimal' : readiness > 40 ? 'Moderate' : 'Needs Recovery'}
            </span>
          </div>
        </div>
      </section>

      {/* Status Grid (Bento Style) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-sm md:gap-md">
        <div className="glass-card p-md rounded-xl flex flex-col justify-between h-32 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-tertiary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start relative z-10">
            <span className="material-symbols-outlined text-tertiary-fixed-dim">speed</span>
            <div className={`w-2 h-2 rounded-full ${burnoutRisk?.color === 'text-tertiary-fixed-dim' ? 'bg-tertiary-fixed-dim' : burnoutRisk?.color === 'text-error' ? 'bg-error' : 'bg-secondary'}`}></div>
          </div>
          <div className="relative z-10">
            <p className="font-label-sm text-label-sm text-on-surface-variant">Burnout Risk</p>
            <p className={`font-headline-md text-headline-md ${burnoutRisk?.color}`}>{burnoutRisk?.label}</p>
          </div>
        </div>
        
        <div className="glass-card p-md rounded-xl flex flex-col justify-between h-32">
          <span className="material-symbols-outlined text-primary-fixed-dim">favorite</span>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Recovery Score</p>
            <div className="flex items-center gap-sm">
              <span className="font-headline-md text-headline-md">{recoveryScore}%</span>
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary-fixed-dim rounded-full transition-all duration-700" style={{ width: `${recoveryScore}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-md rounded-xl flex flex-col justify-between h-32">
          <span className="material-symbols-outlined text-error">psychology</span>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Stress Indicator</p>
            <div className="flex gap-xs mt-xs">
              {[...Array(5)].map((_, i) => {
                const isActive = (metrics.stress / 20) > i;
                const isCurrent = Math.ceil(metrics.stress / 20) - 1 === i;
                return (
                  <div key={i} className={`h-4 flex-1 rounded-sm transition-colors duration-500 ${
                    isActive 
                      ? i < 2 ? 'bg-tertiary-fixed-dim/40' : i < 4 ? 'bg-primary-fixed-dim/60' : 'bg-error/60'
                      : 'bg-white/5'
                  } ${isCurrent ? 'border-t border-primary-fixed-dim shadow-[0_-2px_4px_rgba(0,219,231,0.2)]' : ''}`}></div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="glass-card p-md rounded-xl flex flex-col justify-between h-32">
          <span className="material-symbols-outlined text-secondary">bedtime</span>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Sleep Quality</p>
            <p className="font-headline-md text-headline-md text-secondary">{sleepScore}%</p>
          </div>
        </div>
      </section>

      {/* AI Insights Panel */}
      <section className="glass-card p-lg rounded-xl border-l-4 border-l-primary-fixed-dim relative overflow-hidden">
        <div className="absolute top-0 right-0 p-lg opacity-10">
          <span className="material-symbols-outlined text-[64px]">smart_toy</span>
        </div>
        <div className="flex items-start gap-md relative z-10">
          <div className="p-sm rounded-lg bg-primary/10 text-primary-fixed-dim">
            <span className="material-symbols-outlined">auto_awesome</span>
          </div>
          <div className="space-y-xs">
            <h3 className="font-headline-md text-headline-md text-primary-fixed-dim">Command Brief</h3>
            <div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {commandBrief}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendation Cards */}
      <section className="space-y-md">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest pl-unit">Neural Sync</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {/* Physical Recommendation */}
          <div className="glass-card p-md rounded-xl flex items-center gap-md group cursor-pointer">
            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/5">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Physical Routine" src={physicalCover} />
            </div>
            <div className="flex-1">
              <span className="font-label-sm text-label-sm text-primary-fixed-dim uppercase">Physical Protocol</span>
              <h4 className="font-headline-sm text-headline-sm text-on-surface line-clamp-2 leading-tight mt-1">{routines.physical}</h4>
              <div className="flex items-center gap-sm mt-2">
                <span className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span> AI Generated
                </span>
              </div>
            </div>
            <button className="material-symbols-outlined text-on-surface-variant group-hover:text-primary-fixed-dim transition-colors">play_circle</button>
          </div>
          
          {/* Mental Recommendation */}
          <div className="glass-card p-md rounded-xl flex items-center gap-md group cursor-pointer">
            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/5">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Mental Routine" src={mentalCover} />
            </div>
            <div className="flex-1">
              <span className="font-label-sm text-label-sm text-secondary uppercase">Mental Protocol</span>
              <h4 className="font-headline-sm text-headline-sm text-on-surface line-clamp-2 leading-tight mt-1">{routines.mental}</h4>
              <div className="flex items-center gap-sm mt-2">
                <span className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span> AI Generated
                </span>
              </div>
            </div>
            <button className="material-symbols-outlined text-on-surface-variant group-hover:text-secondary transition-colors">play_circle</button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default CommandCenter;
