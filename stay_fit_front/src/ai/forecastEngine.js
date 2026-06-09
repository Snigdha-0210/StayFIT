/**
 * forecastEngine.js
 * Simulates future trajectories based on current readiness, user behavior, and historical data.
 */

export const predictFutureState = (metrics, readiness, history = []) => {
  const { stress, sleep, workoutIntensity } = metrics;
  
  // Decay factors
  const decayDay1 = (stress > 70 ? 15 : 0) + (sleep < 60 ? 20 : 0) + (workoutIntensity > 80 && readiness < 60 ? 25 : 0);
  const decayDay3 = decayDay1 * 1.5;
  const decayDay7 = decayDay1 * 2;

  // Improvement factors
  const improveDay1 = 15 + (sleep < 60 ? 10 : 0) + (stress > 70 ? 10 : 0);
  const improveDay3 = improveDay1 * 1.5;
  const improveDay7 = improveDay1 * 2;

  const currentTrajectory = {
    day1: Math.max(0, readiness - decayDay1 - 5),
    day3: Math.max(0, readiness - decayDay3 - 10),
    day7: Math.max(0, readiness - decayDay7 - 15)
  };

  const optimizedTrajectory = {
    day1: Math.min(100, readiness + improveDay1),
    day3: Math.min(100, readiness + improveDay3),
    day7: Math.min(100, readiness + improveDay7)
  };

  // Generate Simulation Context Text
  let simulationContext = '';
  if (stress > 75) {
    simulationContext = "Based on your sympathetic nervous system activity and recent high-strain HR patterns, your cognitive focus is likely to dip by 14:00 tomorrow unless cortisol clearance is prioritized tonight.";
  } else if (sleep < 50) {
    simulationContext = "Sleep debt accumulation is significant. Continuing this trajectory will lead to reduced motor coordination and heightened injury risk during workouts tomorrow.";
  } else if (readiness > 80) {
    simulationContext = "Your system is primed. Continuing current optimization will maintain peak performance window for the next 48 hours.";
  } else {
    simulationContext = "Your metrics are stable. Small targeted improvements in sleep or stress management will yield a noticeable boost in readiness tomorrow.";
  }

  return {
    currentTrajectory,
    optimizedTrajectory,
    simulationContext
  };
};
