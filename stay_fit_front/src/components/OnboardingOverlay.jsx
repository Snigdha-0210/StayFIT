import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWellness } from '../context/WellnessContext';

const OnboardingOverlay = () => {
  const { user, loading, completeOnboarding } = useWellness();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('hypertrophy');
  const [name, setName] = useState('');

  if (loading || !user || user?.profile?.hasCompletedOnboarding) return null;

  const handleComplete = () => {
    completeOnboarding({ name, goal });
    navigate('/');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-2xl px-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="glass-card w-full max-w-md rounded-3xl p-8 border-t-2 border-t-primary/30 relative overflow-hidden"
        >
          {/* Background Glows */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[60px]"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/20 rounded-full blur-[60px]"></div>

          <div className="relative z-10">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2 mb-8">
                  <div className="w-16 h-16 mx-auto rounded-full border border-primary/30 flex items-center justify-center mb-4 bg-surface-container-high">
                    <span className="material-symbols-outlined text-3xl text-primary">psychology</span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-primary">Stay FIT</h2>
                  <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Your Personal Wellness AI</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">What should we call you?</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your first name..."
                      className="w-full bg-surface-container-high/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <button 
                    disabled={!name.trim()}
                    onClick={() => setStep(2)}
                    className="w-full bg-primary text-on-primary py-4 rounded-xl font-headline-md font-bold mt-4 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    Next Step
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="font-headline-md text-headline-md text-primary">What is your main goal?</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">We will personalize your insights based on what you want to achieve.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'hypertrophy', label: 'Build Muscle & Strength', icon: 'fitness_center' },
                    { id: 'endurance', label: 'Improve Cardio & Endurance', icon: 'directions_run' },
                    { id: 'recovery', label: 'Focus on Recovery & Wellness', icon: 'spa' }
                  ].map(g => (
                    <button
                      key={g.id}
                      onClick={() => setGoal(g.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${goal === g.id ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(0,219,231,0.2)]' : 'bg-surface-container-low border-white/5 hover:bg-surface-container'}`}
                    >
                      <span className={`material-symbols-outlined ${goal === g.id ? 'text-primary' : 'text-on-surface-variant'}`}>{g.icon}</span>
                      <span className={`font-label-md text-label-md ${goal === g.id ? 'text-primary' : 'text-on-surface'}`}>{g.label}</span>
                    </button>
                  ))}
                </div>

                <button 
                  onClick={handleComplete}
                  className="w-full bg-primary text-on-primary py-4 rounded-xl font-headline-md font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Start Tracking
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingOverlay;
