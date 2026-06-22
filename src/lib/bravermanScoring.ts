import { bravermanQuestions } from '@/data/bravermanQuestions';
import type {
  BravermanArchetype,
  BravermanAttentionSeverity,
  BravermanNeurotransmitter,
  BravermanResult,
  BravermanScores
} from '@/types/braverman';

export const BRAVERMAN_RESULT_STORAGE_KEY = 'healthCoach.bravermanResult.v1';

const deterministicOrder: BravermanNeurotransmitter[] = ['dopamine', 'acetylcholine', 'gaba', 'serotonin'];

const archetypeByProfile: Record<BravermanNeurotransmitter, BravermanArchetype> = {
  dopamine: 'Стратег',
  acetylcholine: 'Создатель',
  gaba: 'Хранитель',
  serotonin: 'Исследователь'
};

function createEmptyScores(): BravermanScores {
  return {
    dominant: {
      dopamine: 0,
      acetylcholine: 0,
      gaba: 0,
      serotonin: 0
    },
    attention: {
      dopamine: 0,
      acetylcholine: 0,
      gaba: 0,
      serotonin: 0
    }
  };
}

function sortProfiles(scores: Record<BravermanNeurotransmitter, number>, direction: 'asc' | 'desc') {
  return [...deterministicOrder].sort((first, second) => {
    const scoreDifference = scores[first] - scores[second];

    if (scoreDifference !== 0) {
      return direction === 'asc' ? scoreDifference : -scoreDifference;
    }

    return deterministicOrder.indexOf(first) - deterministicOrder.indexOf(second);
  });
}

function getAttentionSeverity(score: number): BravermanAttentionSeverity {
  if (score <= 5) {
    return 'low';
  }

  if (score <= 15) {
    return 'medium';
  }

  return 'high';
}

export function calculateBravermanResult(answers: Record<string, boolean>): BravermanResult {
  const scores = createEmptyScores();

  bravermanQuestions.forEach((question) => {
    if (!answers[question.id]) {
      return;
    }

    scores[question.type][question.neurotransmitter] += 1;
  });

  const dominantProfiles = sortProfiles(scores.dominant, 'desc');
  const attentionProfiles = sortProfiles(scores.attention, 'desc');
  const oppositeProfiles = sortProfiles(scores.dominant, 'asc');
  const dominantProfile = dominantProfiles[0];
  const secondaryProfile = dominantProfiles[1];
  const oppositeProfile = oppositeProfiles[0];
  const mainAttentionArea = attentionProfiles[0];
  const dominantScore = scores.dominant[dominantProfile];
  const secondaryScore = scores.dominant[secondaryProfile];

  return {
    completedAt: new Date().toISOString(),
    scores,
    dominantProfile,
    secondaryProfile,
    oppositeProfile,
    mainAttentionArea,
    attentionSeverity: getAttentionSeverity(scores.attention[mainAttentionArea]),
    motivationArchetype: archetypeByProfile[dominantProfile],
    isMixedProfile: dominantScore - secondaryScore <= 2
  };
}
