import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { calculateReadinessIndex } from '../ai/engine';
import { analyzeMood } from '../ai/moodAnalyzer';
import { auth } from '../firebase/firebaseConfig';
import { signInAnonymously } from 'firebase/auth';
import { saveDailyMetrics, getMetricHistory, getUserProfile, updateUserGamification } from '../firebase/firestoreService';

const WellnessContext = createContext(null);

export const useWellness = () => useContext(WellnessContext);

export const WellnessProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    sleep: 92,
    stress: 20,
    energy: 72,
    workoutIntensity: 50,
  });

  const [readiness, setReadiness] = useState(85);

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
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        const userCredential = await signInAnonymously(auth);
        const currentUser = userCredential.user;
        
        if (isMounted) {
          const profile = await getUserProfile(currentUser.uid);
          const history = await getMetricHistory(currentUser.uid);
          
          setUser({ ...currentUser, profile });
          setGamification(profile?.gamification || { xp: 0, streak: 0, badges: [] });
          setMetricsHistory(history);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.warn("Firebase Auth failed, falling back to local mock user.");
          const mockUser = { uid: "local-mock-user-123" };
          const profile = { hasCompletedOnboarding: false, gamification: { xp: 0, streak: 0, badges: [] } };
          setUser({ ...mockUser, profile });
          setGamification(profile.gamification);
          setMetricsHistory([]);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => { isMounted = false; };
  }, []);

  // Update readiness using the AI engine
  useEffect(() => {
    if (loading) return;
    let isMounted = true;
    
    calculateReadinessIndex(metrics).then(newReadiness => {
      if (isMounted) {
        setReadiness(newReadiness);
        
        // Debounce Firestore writes (2 seconds)
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
          if (user?.uid) {
            saveDailyMetrics(user.uid, metrics);
          }
        }, 2000);

        // Evaluate gamification rules based on new metrics & readiness
        evaluateGamification(metrics, newReadiness);
      }
    });

    return () => { 
      isMounted = false;
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [metrics, loading, user]);

  const updateMetric = (key, value) => {
    setMetrics(prev => ({ ...prev, [key]: value }));
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
      metrics,
      readiness,
      gamification,
      metricsHistory,
      updateMetric,
      addXP,
      unlockBadge,
      newBadge,
      completeOnboarding
    }}>
      {children}
    </WellnessContext.Provider>
  );
};
