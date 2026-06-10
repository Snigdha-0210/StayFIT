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
  let recommendedProtocol = '';
  let tags = [];

  if (stress > 75) {
    simulationContext = "Based on your sympathetic nervous system activity and recent high-strain HR patterns, your cognitive focus is likely to dip by 14:00 tomorrow unless cortisol clearance is prioritized tonight.";
    recommendedProtocol = "Initiate 15m down-regulation breathwork to clear cortisol. Prioritize a 90-minute sleep cycle extension tonight.";
    tags = [{ icon: 'bedtime', text: '+1.5h Sleep' }, { icon: 'air', text: 'Breathwork' }];
  } else if (sleep < 50) {
    simulationContext = "Sleep debt accumulation is significant. Continuing this trajectory will lead to reduced motor coordination and heightened injury risk during workouts tomorrow.";
    recommendedProtocol = "Mandatory recovery protocol: No high-intensity training tomorrow. Target 9+ hours of sleep tonight with magnesium supplementation.";
    tags = [{ icon: 'hotel', text: 'Max Sleep' }, { icon: 'no_drinks', text: 'No Caffeine' }];
  } else if (readiness > 80) {
    simulationContext = "Your system is primed. Continuing current optimization will maintain peak performance window for the next 48 hours.";
    recommendedProtocol = "Green light for high-volume intensity. Ensure intra-workout carbs and standard post-training protein synthesis protocols.";
    tags = [{ icon: 'bolt', text: 'High Intensity' }, { icon: 'restaurant', text: 'Carb Load' }];
  } else {
    simulationContext = "Your metrics are stable. Small targeted improvements in sleep or stress management will yield a noticeable boost in readiness tomorrow.";
    recommendedProtocol = "Maintain baseline protocol. Add 500ml extra water today and perform a light 10m mobility flow before bed.";
    tags = [{ icon: 'water_drop', text: '+500ml Water' }, { icon: 'accessibility_new', text: 'Mobility' }];
  }

  return {
    currentTrajectory,
    optimizedTrajectory,
    simulationContext,
    recommendedProtocol,
    tags
  };
};
