import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useWellness } from '../context/WellnessContext';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingOverlay from './OnboardingOverlay';

const Layout = () => {
  const { newBadge, user } = useWellness();

  return (
    <div className="min-h-screen relative overflow-hidden bg-background font-body-md text-on-surface selection:bg-primary-fixed-dim/30">
      <OnboardingOverlay />
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile h-16 bg-surface/30 backdrop-blur-xl border-b border-white/10 shadow-[0_0_15px_rgba(0,219,231,0.1)]">
        <div className="flex items-center gap-sm">
          <span className="font-headline-md text-headline-md font-bold tracking-tighter text-primary-fixed-dim">
            Stay FIT
          </span>
        </div>
        <div className="flex items-center gap-md">
          <button className="material-symbols-outlined text-primary-fixed-dim hover:opacity-80 transition-opacity">
            notifications
          </button>
          <div className="w-10 h-10 rounded-full border border-primary/20 bg-surface-container-high overflow-hidden flex items-center justify-center">
            {user ? (
              <span className="font-headline-md text-primary">{user.profile?.name?.[0]?.toUpperCase() || 'U'}</span>
            ) : (
              <img
                className="w-full h-full object-cover"
                alt="User profile"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSkbqrPSPMkvS7RAOCQ--hNYx9K6eug6GYhurtBcUvoZ9GBArOsjwojJKEYbEvoV5Yjy9FA7OhcA2CIJFo_7UeJ1KdN8IVURF_GoHAAB20Zxv_R51MV5Z-5UtxGy6HS-ZDfJtM0EZGaT6tzg_wqlxNBM1tv-f-pIAF1f4mIQWUd6Rt-P1m1v_2DVqvyaUnliOet4sKnxigrUIio1HvLm7--Yxxil9XFidhuof3aHAnRZ37Ob4ofdJD44mbVFkixe6ltJs1bypaLO8i"
              />
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-24 pb-32 px-margin-mobile max-w-4xl mx-auto space-y-lg relative z-10 min-h-screen">
        <Outlet />
      </main>

      {/* Gamification Toast */}
      <AnimatePresence>
        {newBadge && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 glass-card px-lg py-sm rounded-full flex items-center gap-sm border-secondary shadow-[0_0_20px_rgba(235,178,255,0.4)]"
          >
            <span className="material-symbols-outlined text-secondary text-2xl">workspace_premium</span>
            <div>
              <p className="font-label-sm text-secondary uppercase tracking-widest text-[10px]">Badge Unlocked</p>
              <p className="font-headline-md text-on-surface text-sm font-bold">{newBadge}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Shell */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-surface-container-low/40 backdrop-blur-2xl rounded-t-xl border-t border-white/5 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 transition-transform active:scale-90 ${isActive ? 'text-primary-fixed-dim' : 'text-on-surface-variant/60 hover:text-primary'}`}>
          {({ isActive }) => (
            <div className={`flex items-center justify-center p-3 rounded-full transition-all duration-300 ${isActive ? 'bg-primary/10 shadow-[inset_0_0_8px_rgba(0,219,231,0.4)] border border-primary/20 scale-100' : ''}`}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>terminal</span>
            </div>
          )}
        </NavLink>

        <NavLink to="/sync" className={({ isActive }) => `flex items-center justify-center p-3 transition-colors active:scale-90 duration-200 ${isActive ? 'text-primary-fixed-dim drop-shadow-[0_0_8px_rgba(0,219,231,0.6)]' : 'text-on-surface-variant/60 hover:text-primary'}`}>
          {({ isActive }) => (
             <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>sync</span>
          )}
        </NavLink>
        
        <NavLink to="/forecast" className={({ isActive }) => `flex items-center justify-center p-3 transition-colors active:scale-90 duration-200 ${isActive ? 'text-primary-fixed-dim drop-shadow-[0_0_8px_rgba(0,219,231,0.6)]' : 'text-on-surface-variant/60 hover:text-primary'}`}>
          {({ isActive }) => (
             <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>psychology</span>
          )}
        </NavLink>

        <NavLink to="/analytics" className={({ isActive }) => `flex items-center justify-center p-3 transition-colors active:scale-90 duration-200 ${isActive ? 'text-primary-fixed-dim drop-shadow-[0_0_8px_rgba(0,219,231,0.6)]' : 'text-on-surface-variant/60 hover:text-primary'}`}>
          {({ isActive }) => (
             <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>analytics</span>
          )}
        </NavLink>
        
        <NavLink to="/coach" className={({ isActive }) => `flex items-center justify-center p-3 transition-colors active:scale-90 duration-200 ${isActive ? 'text-primary-fixed-dim drop-shadow-[0_0_8px_rgba(0,219,231,0.6)]' : 'text-on-surface-variant/60 hover:text-primary'}`}>
          {({ isActive }) => (
             <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>smart_toy</span>
          )}
        </NavLink>
        
      </nav>
    </div>
  );
};

export default Layout;
