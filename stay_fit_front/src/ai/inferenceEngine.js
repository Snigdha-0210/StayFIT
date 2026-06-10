/**
 * Behavioral Inference Engine
 * Converts qualitative user behavior (mood, effort) and historical data
 * into quantitative health scores without needing wearable APIs.
 */

// 1. Mood Score
export function inferMoodScore(moodSelection) {
  const moodMap = {
    'Zen': 95,
    'Calm': 85,
    'Neutral': 60,
    'Tired': 40,
    'Stressed': 30,
    'Overwhelmed': 10
  };
  return moodMap[moodSelection] || 60;
}

// 2. Stress Level (0-100, 100 = max stress)
export function inferStressLevel(moodScore, sleepDuration, history = []) {
  // Base stress from mood (inverted, lower mood = higher stress)
  let baseStress = 100 - moodScore;
  
  // Sleep modifier: lack of sleep heavily increases stress
  const optimalSleep = 8.0;
  if (sleepDuration < 6.0) {
    baseStress += 20;
  } else if (sleepDuration < 7.0) {
    baseStress += 10;
  } else if (sleepDuration >= 8.0) {
    baseStress -= 10; // good sleep reduces stress
  }

  // Consistent routine modifier (checking last 3 days)
  if (history.length >= 3) {
    const recentStress = history.slice(0, 3).reduce((sum, day) => sum + (day.stress || 0), 0) / 3;
    // If historically stressed, it's hard to shake off completely
    baseStress = (baseStress * 0.6) + (recentStress * 0.4);
  }

  return Math.max(0, Math.min(100, Math.round(baseStress)));
}

// 3. Workout Intensity (0-100)
export function inferWorkoutIntensity(perceivedEffort1to5, recoveryScore, history = []) {
  // Base scale: 1=20, 2=40, 3=60, 4=80, 5=100
  let baseIntensity = perceivedEffort1to5 * 20;

  // If recovery is low but effort was high, it taxes the body MORE
  if (recoveryScore < 40 && perceivedEffort1to5 >= 4) {
    baseIntensity += 10;
  }

  // High intensity streak (overtraining penalty)
  if (history.length >= 3) {
    const hardDays = history.slice(0, 3).filter(day => (day.workoutIntensity || 0) > 70).length;
    if (hardDays >= 3) {
      baseIntensity += 15; // compound fatigue
    }
  }

  return Math.max(0, Math.min(100, Math.round(baseIntensity)));
}

// 4. Fatigue Score (0-100, 100 = exhausted)
export function inferFatigueLevel(sleepDuration, workoutIntensity, stressLevel) {
  let fatigue = 0;
  
  // Sleep debt contribution (up to 40 points)
  if (sleepDuration < 8) {
    fatigue += (8 - sleepDuration) * 10;
  }

  // Workout contribution (up to 30 points)
  fatigue += workoutIntensity * 0.3;

  // Stress contribution (up to 30 points)
  fatigue += stressLevel * 0.3;

  return Math.max(0, Math.min(100, Math.round(fatigue)));
}

// 5. Orchestrator
export function calculateDailyInference(inputs, history) {
  const { moodSelection, effortLevel, sleepDuration, recoveryScore } = inputs;

  const moodScore = inferMoodScore(moodSelection);
  const stress = inferStressLevel(moodScore, sleepDuration, history);
  const workoutIntensity = inferWorkoutIntensity(effortLevel, recoveryScore, history);
  const fatigue = inferFatigueLevel(sleepDuration, workoutIntensity, stress);

  return {
    moodScore,
    stress,
    workoutIntensity,
    fatigue
  };
}
