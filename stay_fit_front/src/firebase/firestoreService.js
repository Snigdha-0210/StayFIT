import { db } from './firebaseConfig';
import { doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs, arrayUnion } from 'firebase/firestore';

export const saveDailyMetrics = async (userId, data) => {
  if (!userId) return;
  try {
    const dateString = new Date().toISOString().split('T')[0];
    const docRef = doc(db, `users/${userId}/daily_logs`, dateString);
    await setDoc(docRef, {
      logs: arrayUnion({
        ...data,
        timestamp: new Date().toISOString()
      })
    }, { merge: true });
  } catch (error) {
    console.error("Error appending daily log:", error);
  }
};

export const getMetricHistory = async (userId, limitDays = 7) => {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, `users/${userId}/daily_logs`),
      orderBy('__name__', 'desc'), // order by document ID (which is date string YYYY-MM-DD)
      limit(limitDays)
    );
    const querySnapshot = await getDocs(q);
    const history = [];
    querySnapshot.forEach((doc) => {
      const dayData = doc.data();
      // Average out the logs for the day or just take the latest one
      if (dayData.logs && dayData.logs.length > 0) {
        // Take the most recent log of the day as the canonical daily state
        const latestLog = dayData.logs[dayData.logs.length - 1];
        history.push({ date: doc.id, ...latestLog });
      }
    });
    return history.reverse(); // Return in chronological order
  } catch (error) {
    console.error("Error fetching metric history:", error);
    return [];
  }
};

export const updateUserGamification = async (userId, gamification) => {
  if (!userId) return;
  try {
    const docRef = doc(db, "users", userId);
    await setDoc(docRef, { gamification }, { merge: true });
  } catch (error) {
    console.error("Error updating user gamification:", error);
  }
};

export const getUserProfile = async (userId) => {
  if (!userId) return null;
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Create initial profile if it doesn't exist
      const initialProfile = {
        hasCompletedOnboarding: false,
        gamification: {
          xp: 0,
          streak: 0,
          badges: []
        }
      };
      await setDoc(docRef, initialProfile, { merge: true });
      return initialProfile;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};
