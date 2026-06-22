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
import { buildDemoAiCoachFallbackMessage, buildDemoAiCoachResponse } from '@/data/demoAiCoach';
import { demoHealthProfile } from '@/data/demoHealthProfile';
import type { Language } from '@/i18n';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { getAuthPlaceholderContext } from '@/services/phase3Persistence';
import type { AIHealthProfile, NutritionMeal } from '@/types';

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

export type AIChatResult = {
  ok: boolean;
  mode: 'edge' | 'mock';
  message: string;
  answer: string;
  nutritionPlan?: NutritionMeal[];
  error?: string;
  fallbackMode?: 'demo';
};

export type NutritionPlanState = {
  source: AIHealthProfile['source'];
  meals: NutritionMeal[];
  generatedAt?: string;
};

type EdgeHealthProfileResponse = {
  status?: string;
  saved?: boolean;
  message?: string;
  warning?: string;
  profile?: unknown;
};

type EdgeChatResponse = {
  ok?: boolean;
  mode?: string;
  status?: string;
  code?: string;
  detail?: string;
  message?: string;
  answer?: string;
  nutritionPlan?: unknown;
  aiError?: string;
  fallbackMode?: string;
  generatedAt?: string;
  model?: string;
};

let latestGeneratedProfile: AIHealthProfile | null = null;
let latestNutritionPlan: NutritionPlanState | null = null;
const profileListeners = new Set<(profile: AIHealthProfile) => void>();
const nutritionPlanListeners = new Set<(plan: NutritionPlanState) => void>();

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

export function subscribeToLatestGeneratedHealthProfile(listener: (profile: AIHealthProfile) => void) {
  profileListeners.add(listener);

  return () => {
    profileListeners.delete(listener);
  };
}

export function getLatestNutritionPlan(): NutritionPlanState {
  if (!latestNutritionPlan) {
    latestNutritionPlan = {
      source: 'mock',
      meals: demoNutritionMeals
    };
  }

  return latestNutritionPlan;
}

export function subscribeToLatestNutritionPlan(listener: (plan: NutritionPlanState) => void) {
  nutritionPlanListeners.add(listener);

  return () => {
    nutritionPlanListeners.delete(listener);
  };
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
    setLatestNutritionPlanFromAI(response.profile.nutritionPlan, response.profile.generatedAt);
    emitProfileUpdate(latestGeneratedProfile);

    return {
      ok: true,
      mode: latestGeneratedProfile.source,
      saved: response.saved ?? false,
      message: response.message ?? 'Health profile generated through the secure backend.',
      profile: latestGeneratedProfile
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

  if (payload.task === 'nutrition_plan') {
    return generateNutritionPlanFromChat(readInputMessage(payload.input), readInputLanguage(payload.input));
  }

  if (payload.task === 'ai_chat') {
    return sendAIChatMessage(readInputMessage(payload.input), readInputContext(payload.input), readInputLanguage(payload.input));
  }

  return {
    status: 'mock',
    payload
  };
}

export async function generateNutritionPlanFromChat(message: string, language: Language = 'en'): Promise<AIChatResult> {
  return sendAIChatMessage(message, 'nutrition', language);
}

async function sendAIChatMessage(message: string, context: string, language: Language): Promise<AIChatResult> {
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return {
      ok: false,
      mode: 'mock',
      message: 'Enter a question for Health Coach AI.',
      answer: '',
      error: 'Empty AI chat message.'
    };
  }

  if (!isSupabaseConfigured || !supabase) {
    const detail = buildMissingSupabaseConfigError();
    console.error('AI chat configuration error', {
      error: detail,
      missing: getMissingSupabasePublicEnvKeys()
    });

    return buildDemoChatFallbackResult(trimmedMessage, context, language, detail);
  }

  try {
    const { data, error, response: functionResponse } = await supabase.functions.invoke<EdgeChatResponse>('ai-chat', {
      body: {
        task: context === 'nutrition' ? 'nutrition_plan' : 'ai_chat',
        message: trimmedMessage,
        context,
        locale: language,
        profileContext: buildAiChatProfileContext(),
        demoMode: true
      }
    });

    const response = normalizeEdgeChatResponse(data);

    if (error) {
      const errorResponse = normalizeEdgeChatResponse(await readFunctionErrorBody(functionResponse));
      const detail =
        errorResponse.aiError ??
        errorResponse.detail ??
        errorResponse.message ??
        response.aiError ??
        response.detail ??
        response.message ??
        error.message;

      console.error('AI chat function invocation failed', {
        task: context === 'nutrition' ? 'nutrition_plan' : 'ai_chat',
        context,
        error: detail
      });

      return buildDemoChatFallbackResult(trimmedMessage, context, language, detail);
    }

    if (!response.ok) {
      const detail = response.code ?? response.aiError ?? response.detail ?? response.message ?? 'AI chat request failed.';

      console.error('AI chat returned an error response', {
        task: context === 'nutrition' ? 'nutrition_plan' : 'ai_chat',
        context,
        error: detail
      });

      return buildDemoChatFallbackResult(trimmedMessage, context, language, detail);
    }

    if (response.mode === 'provider') {
      const providerAnswer = response.message ?? response.answer ?? '';

      if (!providerAnswer) {
        return buildDemoChatFallbackResult(trimmedMessage, context, language, 'Provider returned an empty answer.');
      }

      return {
        ok: true,
        mode: 'edge',
        message: 'AI response generated.',
        answer: providerAnswer
      };
    }

    if (context === 'nutrition') {
      if (!isNutritionPlan(response.nutritionPlan)) {
        return buildDemoChatFallbackResult(trimmedMessage, context, language, 'Invalid nutrition plan structure.');
      }

      const nutritionPlan = setLatestNutritionPlanFromAI(response.nutritionPlan, response.generatedAt);

      return {
        ok: true,
        mode: 'edge',
        message: response.message ?? 'Nutrition plan generated.',
        answer: response.answer ?? 'Your nutrition plan is ready and saved to the Nutrition page.',
        nutritionPlan: nutritionPlan.meals
      };
    }

    return {
      ok: true,
      mode: 'edge',
      message: response.message ?? 'AI response generated.',
      answer: response.answer ?? ''
    };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error('AI chat request threw before completion', {
      task: context === 'nutrition' ? 'nutrition_plan' : 'ai_chat',
      context,
      error: detail
    });

    return buildDemoChatFallbackResult(trimmedMessage, context, language, detail);
  }
}

function buildDemoChatFallbackResult(message: string, context: string, language: Language, error: string): AIChatResult {
  const answer = buildDemoAiCoachResponse({
    message,
    language,
    context: context === 'nutrition' ? 'nutrition' : 'general'
  });
  const result: AIChatResult = {
    ok: false,
    mode: 'mock',
    message: buildDemoAiCoachFallbackMessage(language),
    answer,
    error,
    fallbackMode: 'demo'
  };

  if (context === 'nutrition') {
    latestNutritionPlan = {
      source: 'mock',
      meals: demoNutritionMeals
    };
    emitNutritionPlanUpdate(latestNutritionPlan);

    return {
      ...result,
      nutritionPlan: demoNutritionMeals
    };
  }

  return result;
}

function buildMissingSupabaseConfigError() {
  const missingKeys = getMissingSupabasePublicEnvKeys();

  if (missingKeys.length === 0) {
    return 'Secure AI chat is unavailable because Supabase is not configured.';
  }

  return `Secure AI chat is unavailable: missing ${missingKeys.join(', ')}.`;
}

function getMissingSupabasePublicEnvKeys() {
  return [
    process.env.EXPO_PUBLIC_SUPABASE_URL ? null : 'EXPO_PUBLIC_SUPABASE_URL',
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? null : 'EXPO_PUBLIC_SUPABASE_ANON_KEY'
  ].filter((key): key is string => Boolean(key));
}

function buildAiChatProfileContext() {
  return {
    userName: demoHealthProfile.userName,
    overallScore: demoHealthProfile.overallScore,
    energyScore: demoHealthProfile.energyScore,
    recoveryScore: demoHealthProfile.recoveryScore,
    sleepScore: demoHealthProfile.sleepScore,
    nutritionScore: demoHealthProfile.nutritionScore,
    mainLimiters: demoHealthProfile.mainLimiters,
    recommendedFocus: demoHealthProfile.recommendedFocus
  };
}

function setLatestNutritionPlanFromAI(meals: NutritionMeal[], generatedAt?: string) {
  const nutritionPlan: NutritionPlanState = {
    source: 'edge',
    generatedAt,
    meals
  };

  latestNutritionPlan = nutritionPlan;
  emitNutritionPlanUpdate(nutritionPlan);

  return nutritionPlan;
}

function emitProfileUpdate(profile: AIHealthProfile) {
  profileListeners.forEach((listener) => {
    listener(profile);
  });
}

function emitNutritionPlanUpdate(plan: NutritionPlanState) {
  nutritionPlanListeners.forEach((listener) => {
    listener(plan);
  });
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

function normalizeEdgeChatResponse(value: unknown): EdgeChatResponse {
  if (!isRecord(value)) {
    return {};
  }

  return {
    ok: typeof value.ok === 'boolean' ? value.ok : undefined,
    mode: typeof value.mode === 'string' ? value.mode : undefined,
    status: typeof value.status === 'string' ? value.status : undefined,
    code: typeof value.code === 'string' ? value.code : undefined,
    detail: typeof value.detail === 'string' ? value.detail : undefined,
    message: typeof value.message === 'string' ? value.message : undefined,
    answer: typeof value.answer === 'string' ? value.answer : undefined,
    nutritionPlan: value.nutritionPlan,
    aiError: typeof value.aiError === 'string' ? value.aiError : undefined,
    fallbackMode: typeof value.fallbackMode === 'string' ? value.fallbackMode : undefined,
    generatedAt: typeof value.generatedAt === 'string' ? value.generatedAt : undefined,
    model: typeof value.model === 'string' ? value.model : undefined
  };
}

async function readFunctionErrorBody(response?: Response): Promise<unknown> {
  if (!response) {
    return {};
  }

  try {
    const responseForRead = response.clone();
    const contentType = responseForRead.headers.get('Content-Type') ?? '';

    if (contentType.includes('application/json')) {
      return await responseForRead.json();
    }

    const detail = await responseForRead.text();

    return detail ? { detail } : {};
  } catch {
    return {};
  }
}

function readInputMessage(input: Record<string, unknown>) {
  return typeof input.message === 'string' ? input.message : '';
}

function readInputContext(input: Record<string, unknown>) {
  return typeof input.context === 'string' ? input.context : 'general';
}

function readInputLanguage(input: Record<string, unknown>): Language {
  return input.language === 'ru' ? 'ru' : 'en';
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

function isNutritionPlan(value: unknown): value is NutritionMeal[] {
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
