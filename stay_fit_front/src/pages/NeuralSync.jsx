import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWellness } from '../context/WellnessContext';
import { useNavigate } from 'react-router-dom';
import { syncDailyState } from '../services/userPipeline';

const NeuralSync = () => {
  const { user, metrics, updateMultipleMetrics, addXP, unlockBadge, recoveryScore, metricsHistory } = useWellness();
  const navigate = useNavigate();
  
  const [localMetrics, setLocalMetrics] = useState({
    sleepStartTime: metrics.sleepStartTime || '23:00',
    wakeUpTime: metrics.wakeUpTime || '07:00',
    mood: metrics.mood || 'Neutral',
    effort: metrics.effort || 3
  });

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }
    
    setIsSyncing(true);
    
    try {
      const inputs = {
        sleepStartTime: localMetrics.sleepStartTime,
        wakeUpTime: localMetrics.wakeUpTime,
        moodSelection: localMetrics.mood,
        effortLevel: localMetrics.effort
      };

      const finalState = await syncDailyState(user.uid, inputs, metricsHistory, recoveryScore);
      
      updateMultipleMetrics({
        ...finalState,
        sleepStartTime: finalState.sleepStartTime,
        wakeUpTime: finalState.wakeUpTime,
      });
      
      addXP(50);
      unlockBadge('Consistency');

      setTimeout(() => {
        setIsSyncing(false);
        navigate('/');
      }, 1000);
    } catch (err) {
      console.error("Failed to sync state", err);
      setIsSyncing(false);
    }
  };

  const MOOD_OPTIONS = [
    { id: 'Zen', emoji: '🧘' },
    { id: 'Calm', emoji: '😌' },
    { id: 'Neutral', emoji: '😐' },
    { id: 'Tired', emoji: '🥱' },
    { id: 'Stressed', emoji: '😫' },
    { id: 'Overwhelmed', emoji: '🤯' }
  ];

  const EFFORT_LABELS = {
    1: 'Light',
    2: 'Moderate',
    3: 'Hard',
    4: 'Very Hard',
    5: 'Extreme'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <section className="mb-lg">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary mb-2 font-bold tracking-tighter">Neural Sync</h2>
        <p className="text-on-surface-variant text-body-md opacity-70">Log your qualitative state. The AI handles the numbers.</p>
      </section>

      <form className="space-y-6" onSubmit={handleSync}>
        
        {/* Sleep Timing */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary">bedtime</span>
            <h3 className="font-headline-md text-headline-md">Sleep Timing</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-2 uppercase tracking-widest">To Bed</label>
              <input 
                type="time" 
                className="w-full bg-surface-container-low border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary/50"
                value={localMetrics.sleepStartTime}
                onChange={(e) => setLocalMetrics(p => ({...p, sleepStartTime: e.target.value}))}
              />
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-2 uppercase tracking-widest">Woke Up</label>
              <input 
                type="time" 
                className="w-full bg-surface-container-low border border-white/5 rounded-lg p-3 text-on-surface focus:outline-none focus:border-primary/50"
                value={localMetrics.wakeUpTime}
                onChange={(e) => setLocalMetrics(p => ({...p, wakeUpTime: e.target.value}))}
              />
            </div>
          </div>
        </div>

        {/* Emoji Mood Selector */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-secondary">psychology</span>
            <h3 className="font-headline-md text-headline-md">State of Mind</h3>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {MOOD_OPTIONS.map(mood => (
              <label key={mood.id} className="cursor-pointer">
                <input 
                  type="radio" 
                  name="mood" 
                  className="hidden peer" 
                  checked={localMetrics.mood === mood.id}
                  onChange={() => setLocalMetrics(p => ({...p, mood: mood.id}))}
                />
                <div className="flex flex-col items-center p-3 rounded-xl border border-white/5 bg-white/5 transition-all peer-checked:bg-primary/20 peer-checked:border-primary/50 hover:bg-white/10">
                  <span className="text-3xl mb-1">{mood.emoji}</span>
                  <span className="font-label-sm text-[10px] uppercase opacity-70">{mood.id}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Perceived Effort Slider */}
        <div className="glass-card p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary-fixed-dim">fitness_center</span>
              <h3 className="font-headline-md text-headline-md">How hard did today feel?</h3>
            </div>
            <span className="font-label-md text-label-md text-tertiary-fixed-dim bg-tertiary-fixed-dim/10 px-3 py-1 rounded-full uppercase">
              {EFFORT_LABELS[localMetrics.effort]}
            </span>
          </div>
          <div className="relative py-4 px-2">
            <input 
              type="range" 
              min="1" max="5" step="1"
              className="w-full relative z-10 accent-primary"
              value={localMetrics.effort}
              onChange={(e) => setLocalMetrics(p => ({...p, effort: parseInt(e.target.value)}))}
            />
            <div className="flex justify-between text-[10px] text-on-surface-variant uppercase tracking-widest mt-2 px-1 opacity-50">
              <span>Light</span>
              <span>Extreme</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-8 pb-12">
          <button 
            type="submit" 
            disabled={isSyncing}
            className={`w-full bg-primary py-5 rounded-full font-headline-md text-on-primary font-bold shadow-[0_0_30px_rgba(255,106,0,0.4)] active:scale-95 transition-all ${isSyncing ? 'opacity-50' : 'animate-pulse-slow'}`}
          >
            {isSyncing ? 'Synchronizing State...' : 'Sync Biological Data'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default NeuralSync;
