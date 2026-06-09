import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWellness } from '../context/WellnessContext';
import { generateForecast } from '../ai/engine';

const Forecast = () => {
  const { metrics, readiness, metricsHistory } = useWellness();
  const [protocolApplied, setProtocolApplied] = useState(false);
  const [forecast, setForecast] = useState({
    currentTrajectory: { day1: Math.max(0, readiness - 5), day3: Math.max(0, readiness - 10), day7: Math.max(0, readiness - 15) },
    optimizedTrajectory: { day1: Math.min(100, readiness + 5), day3: Math.min(100, readiness + 10), day7: Math.min(100, readiness + 15) },
    simulationContext: "Analyzing trajectories..."
  });

  useEffect(() => {
    let isMounted = true;
    generateForecast(metrics, readiness, metricsHistory).then(data => {
      if (isMounted) setForecast(data);
    });
    return () => { isMounted = false; };
  }, [metrics, readiness, metricsHistory]);

  // Derive trajectories from readiness
  const currentTrajectory = forecast.currentTrajectory;
  const optimizedTrajectory = forecast.optimizedTrajectory;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Header Section */}
      <section className="space-y-2">
        <div className="flex items-center gap-2 text-primary-fixed-dim">
          <span className="material-symbols-outlined text-sm">psychology</span>
          <span className="font-label-md text-label-md tracking-widest uppercase">Predictive Analysis</span>
        </div>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">Tomorrow Simulation</h2>
        <p className="text-on-surface-variant font-body-lg text-body-lg max-w-lg">
          {readiness > 70 
            ? "Your current trajectory is solid. Small optimizations can maximize your output."
            : "You’re pushing hard lately. Recovery is catching up. Let's look at your physiological divergence."}
        </p>
      </section>

      {/* Simulation Comparison Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Path 1: Current Trajectory */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-6xl">trending_down</span>
          </div>
          <div className="space-y-4">
            <h3 className="font-headline-md text-headline-md text-on-surface">Current Trajectory</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Day 1</span>
                <span className="font-headline-lg text-headline-lg text-error">{currentTrajectory?.day1 || 0}%</span>
              </div>
              <div className="flex flex-col border-l border-white/5 pl-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Day 3</span>
                <span className="font-headline-lg text-headline-lg text-error opacity-80">{currentTrajectory?.day3 || 0}%</span>
              </div>
              <div className="flex flex-col border-l border-white/5 pl-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Day 7</span>
                <span className="font-headline-lg text-headline-lg text-error opacity-60">{currentTrajectory?.day7 || 0}%</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-label-md text-label-md text-on-surface-variant">7-Day Burnout Risk</span>
                <span className="px-3 py-1 bg-error-container text-on-error-container rounded-full font-label-sm text-label-sm">
                  {currentTrajectory?.day7 < 50 ? 'High' : 'Medium'}
                </span>
              </div>
              <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${currentTrajectory?.day7 || 0}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-error"
                />
              </div>
            </div>
            {/* Small Chart Mockup */}
            <div className="mt-6 h-32 w-full bg-surface-container-low/50 rounded-lg p-2 overflow-hidden flex items-end gap-1">
              {[80, 70, 60, 50, 45, 38].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`flex-1 bg-error/${Math.max(20, (i+2)*10)} rounded-t-sm ${i === 3 ? 'animate-pulse' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Path 2: Optimized Path */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group neon-glow-primary border-primary/20 bg-primary/5">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <span className="material-symbols-outlined text-6xl text-primary">auto_awesome</span>
          </div>
          <div className="space-y-4">
            <h3 className="font-headline-md text-headline-md text-primary">Optimized Path</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-primary-fixed-dim/70 uppercase tracking-wider">Day 1</span>
                <span className="font-headline-lg text-headline-lg text-primary-fixed-dim">{optimizedTrajectory?.day1 || 0}%</span>
              </div>
              <div className="flex flex-col border-l border-white/5 pl-2">
                <span className="font-label-sm text-label-sm text-primary-fixed-dim/70 uppercase tracking-wider">Day 3</span>
                <span className="font-headline-lg text-headline-lg text-primary-fixed-dim opacity-90">{optimizedTrajectory?.day3 || 0}%</span>
              </div>
              <div className="flex flex-col border-l border-white/5 pl-2">
                <span className="font-label-sm text-label-sm text-primary-fixed-dim/70 uppercase tracking-wider">Day 7</span>
                <span className="font-headline-lg text-headline-lg text-primary-fixed-dim opacity-80">{optimizedTrajectory?.day7 || 0}%</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-label-md text-label-md text-on-surface-variant">7-Day Potential</span>
                <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full font-label-sm text-label-sm">Peak Recovery</span>
              </div>
              <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${optimizedTrajectory?.day7 || 0}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className="h-full bg-primary-fixed-dim neon-glow-primary"
                />
              </div>
            </div>
            {/* Optimized Chart Mockup */}
            <div className="mt-6 h-32 w-full bg-surface-container-low/50 rounded-lg p-2 overflow-hidden flex items-end gap-1">
              {[50, 60, 70, 75, 80, 84].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }}
                  className={`flex-1 bg-primary/${Math.max(20, (i+2)*10)} rounded-t-sm ${i === 5 ? 'bg-primary-container' : ''} ${i === 4 ? 'animate-pulse' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Recommendation Section */}
      <section className="glass-card rounded-3xl p-8 border-l-4 border-l-tertiary-fixed">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <h4 className="font-headline-md text-headline-md text-tertiary">Recommended Protocol</h4>
            <p className="text-on-surface font-body-md">Initiate 20m restorative breathwork and prioritize 8.5h sleep tonight. Skip high-intensity volume tomorrow morning.</p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-xl border border-white/5">
                <span className="material-symbols-outlined text-tertiary-fixed">bedtime</span>
                <span className="font-label-sm text-label-sm">+1.5h Sleep</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-xl border border-white/5">
                <span className="material-symbols-outlined text-primary-fixed-dim">water_drop</span>
                <span className="font-label-sm text-label-sm">High Hydration</span>
              </div>
            </div>
          </div>
          <button 
            className={`px-8 py-4 rounded-2xl font-headline-md font-bold transition-all shadow-lg whitespace-nowrap ${protocolApplied ? 'bg-tertiary-fixed-dim text-on-tertiary-fixed-variant' : 'bg-primary text-on-primary hover:scale-105 active:scale-95 neon-glow-primary'}`}
            onClick={() => setProtocolApplied(true)}
            disabled={protocolApplied}
          >
            {protocolApplied ? 'Protocol Active' : 'Apply Protocol'}
          </button>
        </div>
      </section>

      {/* Emotional Forecast */}
      <section className="space-y-6">
        <h4 className="font-headline-md text-headline-md flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary">face_retouching_natural</span>
          Emotional Forecast
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl p-5 border-b-2 border-b-error/30">
            <h5 className="font-label-md text-label-md text-on-surface-variant mb-4 uppercase tracking-widest">How You Might Feel</h5>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                <span className="font-body-md">Slight Fatigue</span>
                <span className="material-symbols-outlined text-error">trending_up</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                <span className="font-body-md">Low Motivation Risk</span>
                <span className="material-symbols-outlined text-tertiary-fixed">warning</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                <span className="font-body-md">Mild Recovery Deficit</span>
                <span className="material-symbols-outlined text-secondary">timer_10</span>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 glass-card rounded-2xl p-5 overflow-hidden relative min-h-[160px]">
            <div className="relative z-10 space-y-4">
              <h5 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Simulation Context</h5>
              <p className="font-body-lg text-body-lg leading-relaxed">
                {forecast.simulationContext}
              </p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Forecast;
