import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWellness } from '../context/WellnessContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login, signup, loginAsGuest } = useWellness();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoadingLocal(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoadingLocal(false);
    }
  };

  const handleGuest = async () => {
    setErrorMsg('');
    setLoadingLocal(true);
    try {
      await loginAsGuest();
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Guest login failed.');
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="glass-card w-full max-w-md p-8 md:p-12 rounded-2xl relative z-10">
        <div className="text-center mb-10">
          <h1 className="font-display-lg text-display-lg text-primary-fixed-dim mb-2 font-bold tracking-tighter">Stay FIT</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Predictive Wellness OS</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm font-body-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-2 uppercase tracking-widest">Email Identity</label>
            <input 
              type="email" 
              required
              className="w-full bg-surface-container border border-white/5 rounded-lg p-4 text-on-surface focus:outline-none focus:border-primary-fixed-dim/50 transition-colors"
              placeholder="operator@system.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-label-sm text-on-surface-variant mb-2 uppercase tracking-widest">Access Key</label>
            <input 
              type="password" 
              required
              className="w-full bg-surface-container border border-white/5 rounded-lg p-4 text-on-surface focus:outline-none focus:border-primary-fixed-dim/50 transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loadingLocal}
            className="w-full bg-primary text-on-primary py-4 rounded-xl font-label-lg font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 mt-4"
          >
            {loadingLocal ? 'Authenticating...' : (isLogin ? 'Initialize System' : 'Create Operator Profile')}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-on-surface-variant hover:text-primary-fixed-dim text-sm transition-colors mb-6 block w-full"
          >
            {isLogin ? "Need access? Request clearance." : "Already have clearance? Initialize here."}
          </button>

          <button 
            onClick={handleGuest}
            disabled={loadingLocal}
            className="text-label-md text-primary hover:text-primary-fixed-dim transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <span className="material-symbols-outlined text-[18px]">badge</span>
            Continue as Guest
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Auth;
