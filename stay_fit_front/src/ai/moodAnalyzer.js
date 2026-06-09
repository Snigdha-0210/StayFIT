/**
 * moodAnalyzer.js
 * Analyzes raw biometric and user inputs to determine emotional and physiological state.
 */

export const analyzeMood = (metrics) => {
  const { sleep, stress, energy, workoutIntensity } = metrics;
  
  let fatigueLevel = 'Low';
  let motivationLevel = 'High';
  let emotionalState = 'Balanced';

  // Fatigue Logic
  if (sleep < 50 || energy < 40 || (workoutIntensity > 80 && sleep < 70)) {
    fatigueLevel = 'High';
  } else if (sleep < 75 || energy < 70 || workoutIntensity > 60) {
    fatigueLevel = 'Medium';
  }

  // Motivation Logic
  if (stress > 80 || fatigueLevel === 'High') {
    motivationLevel = 'Low';
  } else if (stress > 50 || fatigueLevel === 'Medium') {
    motivationLevel = 'Medium';
  }

  // Emotional State Logic
  if (stress > 75 && sleep < 50) {
    emotionalState = 'Overwhelmed';
  } else if (stress > 60) {
    emotionalState = 'Stressed';
  } else if (sleep > 80 && energy > 80) {
    emotionalState = 'Peak Flow';
  }

  return {
    fatigueLevel,
    motivationLevel,
    emotionalState
  };
};
