export type AIRequestPayload = {
  userId: string;
  task: 'generate_health_profile' | 'ai_chat' | 'nutrition_plan' | 'fourteen_day_review';
  input: Record<string, unknown>;
};

export async function callHealthCoachAI(payload: AIRequestPayload) {
  // MVP placeholder.
  // Production AI calls must go through Supabase Edge Functions or another secure backend.
  // Never call OpenAI directly from the mobile app with a secret API key.
  return {
    status: 'mock',
    payload
  };
}
