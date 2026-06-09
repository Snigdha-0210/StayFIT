import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWellness } from '../context/WellnessContext';
import { useNavigate } from 'react-router-dom';

const NeuralSync = () => {
  const { metrics, updateMetric, addXP, unlockBadge } = useWellness();
  const navigate = useNavigate();
  
  const [localMetrics, setLocalMetrics] = useState({
    sleep: (metrics.sleep / 100) * 12, // convert 0-100 to 0-12
    stress: metrics.stress,
    energy: metrics.energy,
    workoutIntensity: metrics.workoutIntensity,
    mood: 'Good'
  });

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = (e) => {
    e.preventDefault();
    setIsSyncing(true);
    
    setTimeout(() => {
      // Convert sleep back to percentage
      updateMetric('sleep', Math.round((localMetrics.sleep / 12) * 100));
      updateMetric('stress', localMetrics.stress);
      updateMetric('energy', localMetrics.energy);
      updateMetric('workoutIntensity', localMetrics.workoutIntensity);
      
      addXP(50);
      
      if (localMetrics.sleep >= 8) unlockBadge('Recovery Master');

      setIsSyncing(false);
      navigate('/');
    }, 1500);
  };

  const getStressLevelFromValue = (val) => {
    if (val < 33) return 'low';
    if (val < 66) return 'medium';
    return 'high';
  };

  const setStressLevel = (level) => {
    if (level === 'low') setLocalMetrics(p => ({ ...p, stress: 15 }));
    if (level === 'medium') setLocalMetrics(p => ({ ...p, stress: 50 }));
    if (level === 'high') setLocalMetrics(p => ({ ...p, stress: 85 }));
  };

  const setWorkoutIntensity = (level) => {
    if (level === 'none') setLocalMetrics(p => ({ ...p, workoutIntensity: 0 }));
    if (level === 'light') setLocalMetrics(p => ({ ...p, workoutIntensity: 30 }));
    if (level === 'medium') setLocalMetrics(p => ({ ...p, workoutIntensity: 60 }));
    if (level === 'intense') setLocalMetrics(p => ({ ...p, workoutIntensity: 100 }));
  };

  const workoutLevel = localMetrics.workoutIntensity === 0 ? 'none' 
    : localMetrics.workoutIntensity <= 30 ? 'light' 
    : localMetrics.workoutIntensity <= 60 ? 'medium' : 'intense';

  const stressLevel = getStressLevelFromValue(localMetrics.stress);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <section className="mb-lg">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-2 font-bold neon-glow-text">Neural Sync</h2>
        <p className="text-on-surface-variant text-body-md opacity-70">Sync your biological data with the OS to optimize your performance window.</p>
      </section>

      <form className="space-y-gutter" onSubmit={handleSync}>
        
        {/* Sleep Hours Slider */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-fixed-dim">bedtime</span>
              <h3 className="font-headline-md text-headline-md">Sleep Hours</h3>
            </div>
            <span className="font-label-md text-label-md text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">{localMetrics.sleep.toFixed(1)}h</span>
          </div>
          <input 
            type="range" 
            min="0" max="12" step="0.5" 
            className="w-full"
            value={localMetrics.sleep}
            onChange={(e) => setLocalMetrics(p => ({...p, sleep: parseFloat(e.target.value)}))}
          />
          <div className="flex justify-between mt-2 text-on-surface-variant/40 font-label-sm text-label-sm">
            <span>0h</span>
            <span>6h</span>
            <span>12h</span>
          </div>
        </div>

        {/* Mood Emotive Scale */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-secondary">psychology</span>
            <h3 className="font-headline-md text-headline-md">Mood</h3>
          </div>
          <div className="flex justify-between items-center gap-2">
            {[
              { id: 'Low', icon: 'sentiment_very_dissatisfied' },
              { id: 'Mid', icon: 'sentiment_neutral' },
              { id: 'Good', icon: 'sentiment_satisfied' },
              { id: 'High', icon: 'sentiment_very_satisfied' }
            ].map(mood => (
              <label key={mood.id} className="group cursor-pointer flex-1">
                <input 
                  type="radio" 
                  name="mood" 
                  className="hidden peer" 
                  checked={localMetrics.mood === mood.id}
                  onChange={() => setLocalMetrics(p => ({...p, mood: mood.id}))}
                />
                <div className="flex flex-col items-center p-3 rounded-xl border border-white/5 bg-white/5 transition-all peer-checked:bg-primary/20 peer-checked:border-primary/50 group-hover:bg-white/10">
                  <span className="material-symbols-outlined text-3xl mb-1 opacity-50 group-hover:opacity-100 peer-checked:opacity-100">{mood.icon}</span>
                  <span className="font-label-sm text-[10px] uppercase opacity-40">{mood.id}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Energy Level Glow Slider */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary-fixed-dim">bolt</span>
              <h3 className="font-headline-md text-headline-md">Energy Level</h3>
            </div>
            <span className="font-label-md text-label-md text-tertiary-fixed-dim">{localMetrics.energy}%</span>
          </div>
          <div className="relative py-4">
            <div 
              className="absolute inset-0 bg-primary/20 blur-2xl rounded-full transition-opacity duration-500" 
              style={{ opacity: localMetrics.energy / 100 }}
            ></div>
            <input 
              type="range" 
              min="0" max="100" 
              className="w-full relative z-10"
              value={localMetrics.energy}
              onChange={(e) => setLocalMetrics(p => ({...p, energy: parseInt(e.target.value)}))}
            />
          </div>
        </div>

        {/* Stress Level Segmented Picker */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-error">warning</span>
            <h3 className="font-headline-md text-headline-md">Stress Level</h3>
          </div>
          <div className="bg-surface-container-low p-1 rounded-full flex relative border border-white/5 overflow-hidden">
            <button 
              type="button" 
              className={`flex-1 py-3 text-label-md rounded-full transition-all z-10 ${stressLevel === 'low' ? 'bg-primary/20 text-primary border border-primary/30' : 'hover:text-on-surface'}`}
              onClick={() => setStressLevel('low')}
            >Low</button>
            <button 
              type="button" 
              className={`flex-1 py-3 text-label-md rounded-full transition-all z-10 ${stressLevel === 'medium' ? 'bg-primary/20 text-primary border border-primary/30' : 'hover:text-on-surface'}`}
              onClick={() => setStressLevel('medium')}
            >Medium</button>
            <button 
              type="button" 
              className={`flex-1 py-3 text-label-md rounded-full transition-all z-10 ${stressLevel === 'high' ? 'bg-primary/20 text-primary border border-primary/30' : 'hover:text-on-surface'}`}
              onClick={() => setStressLevel('high')}
            >High</button>
          </div>
        </div>

        {/* Workout Intensity Chips */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary-fixed-dim">fitness_center</span>
            <h3 className="font-headline-md text-headline-md">Workout Intensity</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'none', label: 'None', icon: 'block' },
              { id: 'light', label: 'Light', icon: 'directions_walk' },
              { id: 'medium', label: 'Medium', icon: 'fitness_center' },
              { id: 'intense', label: 'Intense', icon: 'local_fire_department' },
            ].map(w => (
              <label key={w.id} className="cursor-pointer">
                <input 
                  type="radio" 
                  name="intensity" 
                  className="hidden peer"
                  checked={workoutLevel === w.id}
                  onChange={() => setWorkoutIntensity(w.id)}
                />
                <div className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/5 peer-checked:bg-primary/20 peer-checked:border-primary/50 transition-all">
                  <span className="material-symbols-outlined text-on-surface-variant/40 peer-checked:text-primary">{w.icon}</span>
                  <span className="font-label-md">{w.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-8 pb-12">
          <button 
            type="submit" 
            disabled={isSyncing}
            className={`w-full bg-primary py-5 rounded-full font-headline-md text-on-primary font-bold shadow-[0_0_30px_rgba(0,219,231,0.4)] active:scale-95 transition-all ${isSyncing ? 'opacity-50' : 'animate-pulse-slow'}`}
          >
            {isSyncing ? 'Syncing...' : 'Calculate Readiness Index'}
          </button>
          <p className="text-center mt-4 text-on-surface-variant/50 text-label-sm uppercase tracking-widest">Processing Bio-Metric Data</p>
        </div>
      </form>
    </motion.div>
  );
};

export default NeuralSync;
