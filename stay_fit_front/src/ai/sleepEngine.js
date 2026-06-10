/**
 * Sleep Intelligence Engine
 * Infers sleep duration and quality purely from timing and behavioral inputs, without wearables.
 */

const IDEAL_SLEEP_DURATION = 8.0;

/**
 * Calculates time difference in hours between two HH:MM strings.
 * Assumes sleepTime is typically PM/early AM and wakeTime is AM/PM.
 */
function calculateDuration(sleepTimeStr, wakeTimeStr) {
  if (!sleepTimeStr || !wakeTimeStr) return 0;
  const [sHours, sMins] = sleepTimeStr.split(':').map(Number);
  const [wHours, wMins] = wakeTimeStr.split(':').map(Number);

  let sleepMinutes = sHours * 60 + sMins;
  let wakeMinutes = wHours * 60 + wMins;

  // Handle overnight crossover (e.g. 23:00 to 07:00)
  if (wakeMinutes < sleepMinutes) {
    wakeMinutes += 24 * 60;
  }

  return (wakeMinutes - sleepMinutes) / 60;
}

/**
 * Core engine logic to calculate sleep metrics
 */
export function processSleepData(sleepStartTime, wakeUpTime, stressLevel) {
  const duration = calculateDuration(sleepStartTime, wakeUpTime);
  
  // Calculate Base Quality based on duration (100% at 8 hours)
  let qualityScore = Math.min(100, (duration / IDEAL_SLEEP_DURATION) * 100);

  // Penalty for late-night sleeping
  const sHour = parseInt(sleepStartTime.split(':')[0], 10);
  // If sleeping between 1 AM and 5 AM
  if (sHour >= 1 && sHour <= 5) {
    qualityScore -= 15;
  }

  // Penalty for high stress before bed
  if (stressLevel > 70) {
    qualityScore -= 10;
  } else if (stressLevel > 40) {
    qualityScore -= 5;
  }

  qualityScore = Math.max(0, Math.min(100, Math.round(qualityScore)));

  const sleepDebt = Math.max(0, IDEAL_SLEEP_DURATION - duration);

  let category = "Poor";
  if (qualityScore >= 85) category = "Excellent";
  else if (qualityScore >= 70) category = "Good";
  else if (qualityScore >= 50) category = "Average";

  return {
    sleepDuration: parseFloat(duration.toFixed(2)),
    sleepQualityScore: qualityScore,
    sleepDebt: parseFloat(sleepDebt.toFixed(2)),
    sleepCategory: category
  };
}
