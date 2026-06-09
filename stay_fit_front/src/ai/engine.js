/**
 * engine.js
 * Central intelligence logic for the Stay FIT Wellness OS.
 * Designed as an API-ready architecture using Promises.
 */

import { analyzeMood } from './moodAnalyzer';
import { predictFutureState } from './forecastEngine';

// Simulate network latency for API-ready structure
const simulateNetwork = (data, delay = 600) => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

export const calculateRecoveryConfidence = (history = []) => {
  if (!history || history.length < 3) return 50; // default medium confidence without data
  
  // Look at last 5 days if available
  const recent = history.slice(-5);
  
  // Sleep consistency: standard deviation of sleep
  const avgSleep = recent.reduce((sum, day) => sum + day.sleep, 0) / recent.length;
  const sleepVariance = recent.reduce((sum, day) => sum + Math.pow(day.sleep - avgSleep, 2), 0) / recent.length;
  const sleepConsistencyScore = Math.max(0, 100 - (Math.sqrt(sleepVariance) * 2)); // Lower std dev = higher score

  // Stress stability
  const avgStress = recent.reduce((sum, day) => sum + day.stress, 0) / recent.length;
  const stressStabilityScore = Math.max(0, 100 - avgStress); // Lower average stress = higher stability

  // Workout balance (ideal is around 60-70 average, not 0 and not 100 constantly)
  const avgWorkout = recent.reduce((sum, day) => sum + day.workoutIntensity, 0) / recent.length;
  const workoutBalanceScore = 100 - Math.abs(65 - avgWorkout);

  const confidence = (sleepConsistencyScore * 0.5) + (stressStabilityScore * 0.3) + (workoutBalanceScore * 0.2);
  
  return Math.round(Math.max(10, Math.min(99, confidence)));
};

export const calculateReadinessIndex = async (metrics) => {
  const { sleep, stress, energy, workoutIntensity } = metrics;
  
  // Structured weighted scoring logic
  // Sleep is heavily weighted (45%)
  // Stress impacts heavily negatively (25%)
  // Energy contributes positively (20%)
  // High workout intensity without recovery impacts negatively (10%)
  
  const sleepFactor = sleep * 0.45;
  const energyFactor = energy * 0.20;
  const stressFactor = (100 - stress) * 0.25;
  const workoutFactor = (100 - workoutIntensity) * 0.10;

  const calculated = Math.round(sleepFactor + energyFactor + stressFactor + workoutFactor);
  const readiness = Math.max(0, Math.min(100, calculated));

  return simulateNetwork(readiness);
};

export const generateCommandBrief = async (metrics, readiness, history = [], trends = null) => {
  const mood = analyzeMood(metrics);
  let brief = "";

  // Reasoning Layer based on trends
  let reasoningLayer = "";
  if (trends) {
    if (trends.consecutivePoorSleep >= 2) {
      reasoningLayer = ` Your recovery dropped because sleep has been poor for ${trends.consecutivePoorSleep} days.`;
    } else if (trends.sleepTrend === 'declining') {
      reasoningLayer = ` I notice a sharp decline in your sleep quality recently.`;
    } else if (trends.consecutiveHighStress >= 2) {
      reasoningLayer = ` Your system is accumulating fatigue due to ${trends.consecutiveHighStress} days of sustained high stress.`;
    } else if (trends.sleepTrend === 'improving' && trends.stressTrend !== 'increasing') {
      reasoningLayer = ` Optimal performance detected due to recent stable sleep and stress levels.`;
    }
  }

  if (readiness > 80 && mood.emotionalState === 'Peak Flow') {
    brief = "System optimal. Neural sync indicates peak flow state. You are cleared for high-intensity output today.";
  } else if (readiness > 70) {
    brief = "You are maintaining equilibrium. Listen to your body and adjust intensity dynamically. Good window for skill work.";
  } else if (metrics.stress > 80 && metrics.sleep < 50) {
    brief = "Critical Alert: High stress and severe sleep debt detected. Immediate restorative protocol required. Skip high-intensity volume.";
  } else if (readiness < 40) {
    brief = "You're showing signs of accumulated fatigue due to suboptimal recovery metrics. Consider a light recovery day today to optimize cellular repair.";
  } else {
    brief = "Metrics are stable but show slight divergence from optimal trajectory. Focus on hydration and standard recovery tonight.";
  }

  return simulateNetwork(brief + reasoningLayer);
};

export const generateCoachResponse = async (userMessage, metrics, readiness, history = [], trends = null) => {
  const mood = analyzeMood(metrics);
  const msg = userMessage.toLowerCase();
  
  let response = "";
  let reasoningLayer = "";

  if (trends) {
    if (trends.sleepTrend === 'declining') {
      reasoningLayer = ` (Note: I am factoring in your declining sleep trend over the last 48 hours).`;
    } else if (trends.stressTrend === 'increasing') {
      reasoningLayer = ` (Note: Your stress levels have been creeping up lately, which is impacting this recommendation).`;
    }
  }

  // Structured decision tree based on user input + biometric context
  if (msg.includes('tired') || msg.includes('fatigue')) {
    if (metrics.sleep < 60) {
      response = `Your biometric data confirms this. Your sleep efficiency (${metrics.sleep}%) is too low. I am adjusting your protocol to prioritize 8.5h of sleep tonight.`;
    } else if (metrics.stress > 70) {
      response = `Your fatigue is likely driven by central nervous system strain (Stress: ${metrics.stress}%). Let's implement a 10-minute down-regulation breathwork session.`;
    } else {
      response = "Understood. Sometimes subjective fatigue precedes a drop in metrics. Let's take it easy today and monitor.";
    }
  } else if (msg.includes('workout') || msg.includes('train')) {
    if (readiness > 75) {
      response = `You are cleared hot. With a Readiness Index of ${readiness}%, your system can handle high volume and intensity today.`;
    } else if (readiness > 50) {
      response = `Your readiness is ${readiness}%. Keep the workout intensity moderate. Avoid redlining your HR today.`;
    } else {
      response = `Negative. Your burnout risk is ${mood.fatigueLevel}. I strongly advise against intense training today. Swap to active recovery.`;
    }
  } else if (msg.includes('stress') || msg.includes('anxious')) {
    response = `I detect a stress level of ${metrics.stress}%. Activating parasympathetic protocol: I've added a guided breathwork session to your Neural Sync recommendations.`;
  } else {
    // Default contextual response
    response = `Received. Your current Readiness Index is ${readiness}%. I am continuously monitoring your biometrics to optimize your trajectory.`;
  }

  return simulateNetwork(response + reasoningLayer, 1200); // Coach takes a bit longer to "think"
};

export const generateForecast = async (metrics, readiness, history = [], trends = null) => {
  const forecast = predictFutureState(metrics, readiness, history);
  
  if (trends && trends.sleepTrend === 'declining') {
    forecast.simulationContext += " Note: Your declining sleep trend is actively suppressing your optimal potential.";
  } else if (trends && trends.stressTrend === 'decreasing') {
    forecast.simulationContext += " Note: Your decreasing stress trend is accelerating your recovery trajectory.";
  }

  return simulateNetwork(forecast);
};
