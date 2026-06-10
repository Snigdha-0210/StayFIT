/**
 * Recovery Fusion Engine
 * Blends sleep data with behavioral metrics to infer recovery, readiness, and burnout risk.
 */

export function processRecoveryData(sleepScore, stress, energy, workoutIntensity) {
  // Convert stress to a positive factor (low stress = high score)
  const lowStressScore = Math.max(0, 100 - stress);
  
  // Workout balance: High intensity should slightly lower immediate readiness
  // (Assuming optimal balance is a mix of recovery and training)
  const workoutBalanceScore = workoutIntensity > 80 ? 40 : 
                              workoutIntensity > 50 ? 70 : 
                              workoutIntensity > 20 ? 90 : 80;

  // Core Fusion Formula
  let recoveryScore = (0.35 * sleepScore) + 
                      (0.25 * lowStressScore) + 
                      (0.20 * energy) + 
                      (0.20 * workoutBalanceScore);
                      
  recoveryScore = Math.min(100, Math.max(0, Math.round(recoveryScore)));

  // Burnout Risk Categorization
  let burnoutRisk = { label: 'Low', color: 'text-tertiary-fixed-dim' }; // Defaults
  if (stress > 75 && sleepScore < 60) {
    burnoutRisk = { label: 'High', color: 'text-error' };
  } else if (stress > 60 || sleepScore < 70) {
    burnoutRisk = { label: 'Medium', color: 'text-warning' };
  }

  return {
    recoveryScore,
    readinessScore: recoveryScore, // Readiness is strongly correlated with Recovery
    burnoutRisk
  };
}
