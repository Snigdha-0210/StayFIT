import { calculateDailyInference } from '../ai/inferenceEngine';
import { saveDailyMetrics } from '../firebase/firestoreService';

/**
 * CORE INTELLIGENCE SYSTEM PIPELINE
 * Orchestrates the flow from qualitative user behavior -> inference engine -> database -> UI state
 */
export const syncDailyState = async (userId, inputs, metricsHistory, currentRecoveryScore) => {
  if (!userId) throw new Error("User not authenticated.");

  // 1. Run inference engine on behavioral inputs
  const inferredMetrics = calculateDailyInference({
    ...inputs,
    recoveryScore: currentRecoveryScore
  }, metricsHistory);

  // 2. Prepare unified payload
  const fullState = {
    ...inputs,
    ...inferredMetrics
  };

  // 3. Append to isolated Firebase historical log
  await saveDailyMetrics(userId, fullState);

  // 4. Return new state to hydrate the UI immediately
  return fullState;
};
