/**
 * Daily Wellness Service
 * Generates trends and insights from historical data to feed the OS dashboards.
 */

export function generateDailyWellnessReport(metricsHistory) {
  if (!metricsHistory || metricsHistory.length === 0) {
    return {
      weeklySleepTrend: 0,
      fatigueAccumulation: 'Low',
      recoveryTrend: 'Stable',
    };
  }

  // Get last 7 days of data
  const last7Days = metricsHistory.slice(0, 7);
  
  const avgSleep = last7Days.reduce((sum, entry) => sum + (entry.sleepScore || entry.sleep || 0), 0) / last7Days.length;
  const avgStress = last7Days.reduce((sum, entry) => sum + (entry.stress || 0), 0) / last7Days.length;
  
  // Fatigue Accumulation logic
  let fatigue = 'Low';
  if (avgStress > 60 && avgSleep < 65) fatigue = 'High';
  else if (avgStress > 50 || avgSleep < 75) fatigue = 'Moderate';

  // Recovery Trend
  let trend = 'Stable';
  if (last7Days.length > 2) {
    const recent = last7Days[0]?.recoveryScore || last7Days[0]?.sleep || 0;
    const older = last7Days[last7Days.length - 1]?.recoveryScore || last7Days[last7Days.length - 1]?.sleep || 0;
    if (recent > older + 5) trend = 'Improving';
    else if (recent < older - 5) trend = 'Declining';
  }

  return {
    weeklySleepTrend: Math.round(avgSleep),
    fatigueAccumulation: fatigue,
    recoveryTrend: trend
  };
}
