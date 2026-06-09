/**
 * dbClient.js
 * Simulated Backend (Firebase/Supabase API structure)
 * Uses LocalStorage to persist data and simulate database latency.
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const DB_KEY = 'stay_fit_db';

const getDb = () => {
  const db = localStorage.getItem(DB_KEY);
  if (!db) {
    return {
      user: null,
      metricsHistory: [],
    };
  }
  return JSON.parse(db);
};

const saveDb = (db) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const auth = {
  async getUser() {
    await delay(300);
    const db = getDb();
    return db.user;
  },
  
  async loginOrRegister(profileData) {
    await delay(500);
    const db = getDb();
    // Simulate creating a new user or logging in
    const user = {
      uid: 'user_123',
      profile: profileData,
      gamification: {
        xp: 0,
        streak: 1,
        badges: []
      },
      hasCompletedOnboarding: true,
      createdAt: new Date().toISOString()
    };
    db.user = user;
    saveDb(db);
    return user;
  },

  async updateGamification(gamificationData) {
    await delay(100);
    const db = getDb();
    if (db.user) {
      db.user.gamification = gamificationData;
      saveDb(db);
    }
  }
};

export const db = {
  async saveDailyMetrics(dateString, metrics) {
    await delay(200);
    const database = getDb();
    
    // Check if entry exists for today, update or push
    const existingIndex = database.metricsHistory.findIndex(m => m.date === dateString);
    if (existingIndex > -1) {
      database.metricsHistory[existingIndex] = { date: dateString, ...metrics };
    } else {
      database.metricsHistory.push({ date: dateString, ...metrics });
    }
    
    saveDb(database);
  },

  async getMetricsHistory() {
    await delay(300);
    return getDb().metricsHistory;
  }
};
