import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { calculateReadinessIndex } from '../ai/engine';
import { processSleepData } from '../ai/sleepEngine';
import { processRecoveryData } from '../ai/recoveryFusionEngine';
import { generateDailyWellnessReport } from '../services/dailyWellnessService';
import { analyzeMood } from '../ai/moodAnalyzer';
import { auth } from '../firebase/firebaseConfig';
import { 
  signInAnonymously, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { saveDailyMetrics, getMetricHistory, getUserProfile, updateUserGamification } from '../firebase/firestoreService';

const WellnessContext = createContext(null);

export const useWellness = () => useContext(WellnessContext);

export const WellnessProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    sleepStartTime: '23:00',
    wakeUpTime: '07:00',
    sleep: 92, // Legacy field for backwards compatibility
    stress: 20,
    energy: 72,
    workoutIntensity: 50,
  });

  const [readiness, setReadiness] = useState(85);
  const [sleepScore, setSleepScore] = useState(92);
  const [recoveryScore, setRecoveryScore] = useState(85);
  const [burnoutRisk, setBurnoutRisk] = useState({ label: 'Low', color: 'text-tertiary-fixed-dim' });
  const [dailyReport, setDailyReport] = useState({});

  const [gamification, setGamification] = useState({
    xp: 0,
    streak: 0,
    badges: [],
  });

  const [newBadge, setNewBadge] = useState(null); // For toast notifications

  const [metricsHistory, setMetricsHistory] = useState([]);
  const saveTimeoutRef = useRef(null);

  // Initialize Auth & DB state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          const history = await getMetricHistory(currentUser.uid);
          setUser({ ...currentUser, profile });
          setGamification(profile?.gamification || { xp: 0, streak: 0, badges: [] });
          setMetricsHistory(history);
        } catch (error) {
          console.warn("Error fetching user data", error);
        }
      } else {
        setUser(null);
        setGamification({ xp: 0, streak: 0, badges: [] });
        setMetricsHistory([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  const loginAsGuest = () => signInAnonymously(auth);

  // Update AI inference engines when metrics change
  useEffect(() => {
    if (loading) return;
    let isMounted = true;
    
    // 1. Run Auto Sleep Engine
    const sleepData = processSleepData(metrics.sleepStartTime, metrics.wakeUpTime, metrics.stress);
    
    // 2. Run Recovery Fusion Engine
    const fusionData = processRecoveryData(sleepData.sleepQualityScore, metrics.stress, metrics.energy, metrics.workoutIntensity);
    
    // 3. Run Daily Report Generator
    const report = generateDailyWellnessReport(metricsHistory);

    if (isMounted) {
      setSleepScore(sleepData.sleepQualityScore);
      setRecoveryScore(fusionData.recoveryScore);
      setReadiness(fusionData.readinessScore);
      setBurnoutRisk(fusionData.burnoutRisk);
      setDailyReport(report);
      
      const updatedMetrics = { ...metrics, sleep: sleepData.sleepQualityScore };

      // Debounce Firestore writes (2 seconds)
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        if (user?.uid) {
          saveDailyMetrics(user.uid, {
            ...updatedMetrics,
            sleepScore: sleepData.sleepQualityScore,
            recoveryScore: fusionData.recoveryScore,
            readinessScore: fusionData.readinessScore
          });
        }
      }, 2000);

      // Evaluate gamification rules based on new metrics & readiness
      evaluateGamification(updatedMetrics, fusionData.readinessScore);
    }

    return () => { 
      isMounted = false;
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [metrics, loading, user, metricsHistory]);

  const updateMetric = (key, value) => {
    setMetrics(prev => ({ ...prev, [key]: value }));
  };

  const updateMultipleMetrics = (newMetrics) => {
    setMetrics(prev => ({ ...prev, ...newMetrics }));
  };

  const addXP = (amount) => {
    setGamification(prev => {
      const newState = { ...prev, xp: prev.xp + amount };
      if (user?.uid) updateUserGamification(user.uid, newState);
      return newState;
    });
  };

  const unlockBadge = (badgeName) => {
    setGamification(prev => {
      if (!prev.badges.includes(badgeName)) {
        setNewBadge(badgeName);
        setTimeout(() => setNewBadge(null), 3000);
        const newState = { ...prev, badges: [...prev.badges, badgeName] };
        if (user?.uid) updateUserGamification(user.uid, newState);
        return newState;
      }
      return prev;
    });
  };

  const completeOnboarding = async (profileData) => {
    if (!user) return;
    const newProfile = { hasCompletedOnboarding: true, profile: profileData, gamification };
    setUser({ ...user, profile: newProfile });
    await updateUserGamification(user.uid, newProfile.gamification);
  };

  const evaluateGamification = (currentMetrics, currentReadiness) => {
    let xpGained = 10; // Base xp for syncing
    
    // Dynamic XP logic
    if (currentMetrics.sleep > 80) xpGained += 20; // Good sleep bonus
    if (currentMetrics.stress < 40) xpGained += 15; // Low stress bonus
    if (currentReadiness > 80) xpGained += 25; // High readiness bonus
    
    addXP(xpGained);

    // Rule-based Badges
    const mood = analyzeMood(currentMetrics);
    
    if (currentMetrics.sleep >= 90) unlockBadge('Recovery Master');
    if (currentMetrics.stress <= 20) unlockBadge('Zen Master');
    if (mood.emotionalState === 'Peak Flow') unlockBadge('Flow State Operator');
  };

  return (
    <WellnessContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      loginAsGuest,
      metrics,
      readiness,
      sleepScore,
      recoveryScore,
      burnoutRisk,
      dailyReport,
      gamification,
      metricsHistory,
      updateMetric,
      updateMultipleMetrics,
      addXP,
      unlockBadge,
      newBadge,
      completeOnboarding
    }}>
      {children}
    </WellnessContext.Provider>
  );
};
