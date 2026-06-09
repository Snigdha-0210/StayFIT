/**
 * aiPipeline.js
 * The Single Intelligence Pipeline for the Stay FIT app.
 * Merges deterministic engine scores with natural language LLM generation.
 */

import { calculateReadinessIndex, calculateRecoveryConfidence } from '../ai/engine';
import { analyzeMood } from '../ai/moodAnalyzer';
import { generateCoachingText } from '../api/aiClient';

export const runIntelligencePipeline = async (currentMetrics, history = [], userPrompt = null) => {
  // 1. Pass metrics into engine.js for computed scores
  const recoveryScore = await calculateReadinessIndex(currentMetrics);
  const mood = analyzeMood(currentMetrics);
  
  // Use mood's fatigueLevel to derive a burnout score % for the LLM
  // High fatigue risk = higher burnout score
  let burnoutRiskScore = 50;
  if (mood.fatigueLevel === 'High') burnoutRiskScore = 85;
  if (mood.fatigueLevel === 'Low') burnoutRiskScore = 20;

  // Compute confidence metric
  const recoveryConfidence = calculateRecoveryConfidence(history);

  // 2. Prepare payload for aiClient
  const aiPayload = {
    mood: mood.emotionalState,
    sleep: currentMetrics.sleep,
    energy: currentMetrics.energy,
    stress: currentMetrics.stress,
    workout: currentMetrics.workoutIntensity,
    burnoutScore: burnoutRiskScore,
    recoveryScore: recoveryScore,
    userPrompt: userPrompt
  };

  // 3. Send engine output + user metrics to aiClient.js
  const aiCoachResponse = await generateCoachingText(aiPayload);

  // 4. Return final merged object
  return {
    recoveryScore,
    burnoutRisk: mood.fatigueLevel,
    energyLevel: currentMetrics.energy,
    stressLevel: currentMetrics.stress,
    recoveryConfidence,
    aiCoachResponse
  };
};
