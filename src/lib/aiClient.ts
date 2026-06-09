import {
  demoAISummary,
  demoBeeProducts,
  demoCoreScores,
  demoNutritionMeals,
  demoSupplements,
  demoSystemScores,
  demoUser,
  demoWeeklyPlan,
  supplementSafetyNote
} from '@/data/mock/healthProfile';
import { supabase } from '@/lib/supabase';
import { getAuthPlaceholderContext } from '@/services/phase3Persistence';
import type { AIHealthProfile } from '@/types';

export type AIRequestPayload = {
  userId: string;
  task: 'generate_health_profile' | 'ai_chat' | 'nutrition_plan' | 'fourteen_day_review';
  input: Record<string, unknown>;
};

export type HealthProfileGenerationResult = {
  ok: boolean;
  mode: AIHealthProfile['source'];
  saved: boolean;
  message: string;
  profile: AIHealthProfile;
  error?: string;
};

type EdgeHealthProfileResponse = {
  status?: string;
  saved?: boolean;
  message?: string;
  warning?: string;
  profile?: unknown;
};

let latestGeneratedProfile: AIHealthProfile | null = null;

export function buildMockAIHealthProfile(): AIHealthProfile {
  return {
    id: 'mock-ai-health-profile',
    generatedAt: new Date().toISOString(),
    source: 'mock',
    healthScore: demoUser.healthScore,
    healthStatus: demoUser.healthStatus,
    confidence: 'medium',
    motivationArchetype: demoUser.archetype as AIHealthProfile['motivationArchetype'],
    coreScores: demoCoreScores,
    systemScores: demoSystemScores,
    summary: {
      limitingFactors: demoAISummary.limitingFactors,
      biggestResult: demoAISummary.biggestResult,
      expectedEffect: demoAISummary.expectedEffect,
      nextStep: demoAISummary.nextStep,
      safetyNote: supplementSafetyNote
    },
    supplementStack: demoSupplements,
    beeProducts: demoBeeProducts,
    nutritionPlan: demoNutritionMeals,
    sevenDayPlan: demoWeeklyPlan
  };
}

export function getLatestGeneratedHealthProfile(): AIHealthProfile {
  if (!latestGeneratedProfile) {
    latestGeneratedProfile = buildMockAIHealthProfile();
  }

  return latestGeneratedProfile;
}

export async function generateHealthProfile(): Promise<HealthProfileGenerationResult> {
  const fallbackProfile = buildMockAIHealthProfile();
  const context = await getAuthPlaceholderContext();

  if (context.mode === 'mock' || !supabase) {
    latestGeneratedProfile = fallbackProfile;

    return {
      ok: true,
      mode: 'mock',
      saved: false,
      message: 'Using a demo health profile because secure generation is unavailable.',
      profile: fallbackProfile
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke('generate-health-profile', {
      body: {
        task: 'generate_health_profile',
        requestedAt: new Date().toISOString()
      }
    });

    if (error) {
      latestGeneratedProfile = fallbackProfile;

      return {
        ok: false,
        mode: 'mock',
        saved: false,
        message: 'Secure generation is unavailable, so the demo health profile is shown.',
        profile: fallbackProfile,
        error: error.message
      };
    }

    const response = normalizeEdgeResponse(data);

    if (!validateAIHealthProfile(response.profile)) {
      latestGeneratedProfile = fallbackProfile;

      return {
        ok: false,
        mode: 'mock',
        saved: false,
        message: 'Secure generation returned an incomplete profile, so the demo health profile is shown.',
        profile: fallbackProfile,
        error: 'Invalid health profile structure.'
      };
    }

    latestGeneratedProfile = response.profile;

    return {
      ok: true,
      mode: response.profile.source,
      saved: response.saved ?? false,
      message: response.message ?? 'Health profile generated through the secure backend.',
      profile: response.profile
    };
  } catch (error) {
    latestGeneratedProfile = fallbackProfile;

    return {
      ok: false,
      mode: 'mock',
      saved: false,
      message: 'Secure generation could not be reached, so the demo health profile is shown.',
      profile: fallbackProfile,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export async function callHealthCoachAI(payload: AIRequestPayload) {
  if (payload.task === 'generate_health_profile') {
    return generateHealthProfile();
  }

  return {
    status: 'mock',
    payload
  };
}

export function validateAIHealthProfile(value: unknown): value is AIHealthProfile {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.generatedAt === 'string' &&
    (value.source === 'mock' || value.source === 'edge') &&
    typeof value.healthScore === 'number' &&
    typeof value.healthStatus === 'string' &&
    (value.confidence === 'low' || value.confidence === 'medium' || value.confidence === 'high') &&
    typeof value.motivationArchetype === 'string' &&
    isHealthScoreArray(value.coreScores) &&
    isHealthScoreArray(value.systemScores) &&
    isSummary(value.summary) &&
    isSupplementArray(value.supplementStack) &&
    isBeeProductArray(value.beeProducts) &&
    isNutritionPlan(value.nutritionPlan) &&
    isWeeklyPlan(value.sevenDayPlan)
  );
}

function normalizeEdgeResponse(value: unknown): EdgeHealthProfileResponse {
  if (!isRecord(value)) {
    return {};
  }

  return {
    status: typeof value.status === 'string' ? value.status : undefined,
    saved: typeof value.saved === 'boolean' ? value.saved : undefined,
    message: typeof value.message === 'string' ? value.message : undefined,
    warning: typeof value.warning === 'string' ? value.warning : undefined,
    profile: value.profile
  };
}

function isSummary(value: unknown) {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isStringArray(value.limitingFactors) &&
    isStringArray(value.biggestResult) &&
    typeof value.expectedEffect === 'string' &&
    typeof value.nextStep === 'string' &&
    typeof value.safetyNote === 'string'
  );
}

function isHealthScoreArray(value: unknown) {
  return Array.isArray(value) && value.every((item) => isRecord(item) && typeof item.label === 'string' && typeof item.value === 'number');
}

function isSupplementArray(value: unknown) {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.dosage === 'string' &&
        typeof item.schedule === 'string' &&
        typeof item.foodInstruction === 'string' &&
        typeof item.reason === 'string' &&
        (item.confidence === 'low' || item.confidence === 'medium' || item.confidence === 'high') &&
        (item.stackType === 'essential' || item.stackType === 'complete')
    )
  );
}

function isBeeProductArray(value: unknown) {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.reason === 'string' &&
        typeof item.howToUse === 'string' &&
        typeof item.expectedBenefit === 'string' &&
        (item.priority === 'low' || item.priority === 'medium' || item.priority === 'high')
    )
  );
}

function isNutritionPlan(value: unknown) {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item.id === 'string' &&
        isMeal(item.meal) &&
        typeof item.title === 'string' &&
        typeof item.description === 'string' &&
        typeof item.time === 'string' &&
        typeof item.modification === 'string'
    )
  );
}

function isWeeklyPlan(value: unknown) {
  return (
    Array.isArray(value) &&
    value.every(
      (day) =>
        isRecord(day) &&
        typeof day.id === 'string' &&
        typeof day.day === 'string' &&
        typeof day.focus === 'string' &&
        Array.isArray(day.tasks) &&
        day.tasks.every(isDailyTask)
    )
  );
}

function isDailyTask(value: unknown) {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    isTaskCategory(value.category) &&
    typeof value.instruction === 'string' &&
    typeof value.completed === 'boolean'
  );
}

function isMeal(value: unknown) {
  return value === 'Breakfast' || value === 'Lunch' || value === 'Dinner' || value === 'Snack' || value === 'Water';
}

function isTaskCategory(value: unknown) {
  return (
    value === 'supplement' ||
    value === 'nutrition' ||
    value === 'movement' ||
    value === 'sleep' ||
    value === 'recovery' ||
    value === 'bee_product' ||
    value === 'water' ||
    value === 'training'
  );
}

function isStringArray(value: unknown) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
