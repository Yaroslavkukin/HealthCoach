import type { HealthScore } from '@/types';

export function calculateOverallHealthScore(scores: HealthScore[]): number {
  if (scores.length === 0) return 0;
  const total = scores.reduce((sum, score) => sum + score.value, 0);
  return Math.round(total / scores.length);
}

export function getScoreLabel(score: number): 'good' | 'attention' | 'poor' {
  if (score >= 75) return 'good';
  if (score >= 50) return 'attention';
  return 'poor';
}
