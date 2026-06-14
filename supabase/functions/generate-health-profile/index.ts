// eslint-disable-next-line import/no-unresolved
import { createClient } from 'npm:@supabase/supabase-js@2.108.1';

type HealthStatus = 'good' | 'attention' | 'poor' | 'unknown';
type MotivationArchetype = 'The Strategist' | 'The Creator' | 'The Guardian' | 'The Explorer';
type TaskCategory = 'supplement' | 'nutrition' | 'movement' | 'sleep' | 'recovery' | 'bee_product' | 'water' | 'training';

type HealthScore = {
  label: string;
  value: number;
  status: HealthStatus;
  trend?: 'up' | 'down' | 'stable';
  limitingFactor?: string;
  action?: string;
};

type DailyTask = {
  id: string;
  title: string;
  category: TaskCategory;
  instruction: string;
  completed: boolean;
  time?: string;
};

type SupplementRecommendation = {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  foodInstruction: string;
  reason: string;
  confidence: 'low' | 'medium' | 'high';
  stackType: 'essential' | 'complete';
  nextIntake?: string;
  takenToday?: boolean;
  compatibilityNotes?: string;
  courseDuration?: string;
  safetyNote?: string;
};

type BeeProductRecommendation = {
  id: string;
  name: string;
  reason: string;
  howToUse: string;
  expectedBenefit: string;
  priority: 'low' | 'medium' | 'high';
  allergyWarning?: string;
};

type NutritionMeal = {
  id: string;
  meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Water';
  title: string;
  description: string;
  time: string;
  modification: string;
};

type WeeklyPlanDay = {
  id: string;
  day: string;
  focus: string;
  tasks: DailyTask[];
};

type AIHealthProfile = {
  id: string;
  generatedAt: string;
  source: 'mock' | 'edge';
  healthScore: number;
  healthStatus: string;
  confidence: 'low' | 'medium' | 'high';
  motivationArchetype: MotivationArchetype;
  coreScores: HealthScore[];
  systemScores: HealthScore[];
  summary: {
    limitingFactors: string[];
    biggestResult: string[];
    expectedEffect: string;
    nextStep: string;
    safetyNote: string;
  };
  supplementStack: SupplementRecommendation[];
  beeProducts: BeeProductRecommendation[];
  nutritionPlan: NutritionMeal[];
  sevenDayPlan: WeeklyPlanDay[];
};

type SupabaseWriteClient = {
  from: (tableName: string) => any;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return json({ ok: true });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405);
  }

  try {
    const body = await readJson(req);
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const authHeader = req.headers.get('Authorization') ?? '';

    if (!supabaseUrl || !supabaseAnonKey) {
      return json({
        status: 'mock',
        saved: false,
        message: 'Secure generation is not configured, so a demo health profile was returned.',
        profile: buildMockProfile()
      });
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    });

    const {
      data: { user },
      error: userError
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return json({
        status: 'mock',
        saved: false,
        message: 'No authenticated session was found, so a demo health profile was returned.',
        profile: buildMockProfile()
      });
    }

    const generatedProfile = await generateStructuredProfile(body);
    const profile = generatedProfile ?? buildMockProfile();

    if (!validateAIHealthProfile(profile)) {
      return json({ error: 'AI output failed structured validation.' }, 422);
    }

    if (profile.source !== 'edge' || !serviceRoleKey) {
      return json({
        status: profile.source,
        saved: false,
        message: 'A validated health profile was returned without writing to the database.',
        profile
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    await saveValidatedProfile(adminClient, user.id, profile);

    return json({
      status: 'edge',
      saved: true,
      message: 'Health profile generated and saved securely.',
      profile
    });
  } catch {
    return json(
      {
        error: 'Secure health profile generation failed.'
      },
      500
    );
  }
});

async function generateStructuredProfile(input: unknown): Promise<AIHealthProfile | null> {
  void input;

  return null;
}

async function saveValidatedProfile(client: SupabaseWriteClient, userId: string, profile: AIHealthProfile) {
  const { data: healthProfile, error: healthProfileError } = await client
    .from('ai_health_profiles')
    .insert({
      user_id: userId,
      overall_health_score: profile.healthScore,
      energy_score: findScore(profile.coreScores, 'Energy'),
      mood_score: findScore(profile.coreScores, 'Mood'),
      motivation_score: findScore(profile.coreScores, 'Motivation'),
      productivity_score: findScore(profile.coreScores, 'Productivity'),
      confidence_score: confidenceToNumber(profile.confidence),
      generated_json: profile
    })
    .select('id')
    .single();

  if (healthProfileError) {
    throw new Error(`Unable to save health profile: ${healthProfileError.message}`);
  }

  const profileId = healthProfile.id as string;

  await insertRows(
    client,
    'health_system_scores',
    profile.systemScores.map((score) => ({
      user_id: userId,
      ai_health_profile_id: profileId,
      system_code: mapSystemCode(score.label),
      score: score.value,
      status: score.status,
      explanation: score.limitingFactor ?? score.action ?? score.label
    }))
  );

  await insertRows(client, 'ai_summaries', [
    {
      user_id: userId,
      ai_health_profile_id: profileId,
      title: 'AI Summary',
      current_limiting_factors: profile.summary.limitingFactors,
      highest_impact_actions: profile.summary.biggestResult,
      expected_effects: [profile.summary.expectedEffect],
      safety_note: profile.summary.safetyNote
    }
  ]);

  await insertRows(
    client,
    'supplement_recommendations',
    profile.supplementStack.map((item) => ({
      user_id: userId,
      stack_type: item.stackType,
      supplement_name: item.name,
      dosage: item.dosage,
      timing: item.schedule,
      food_instruction: item.foodInstruction,
      compatibility_notes: item.compatibilityNotes,
      course_duration: item.courseDuration
    }))
  );

  await insertRows(
    client,
    'bee_product_recommendations',
    profile.beeProducts.map((item) => ({
      user_id: userId,
      product_name: item.name,
      priority: item.priority,
      how_to_use: item.howToUse,
      expected_benefit: item.expectedBenefit,
      allergy_warning: item.allergyWarning
    }))
  );

  await insertRows(client, 'nutrition_plans', [
    {
      user_id: userId,
      ai_health_profile_id: profileId,
      plan_type: 'essential',
      plan_json: profile.nutritionPlan
    }
  ]);

  const { data: actionPlan, error: actionPlanError } = await client
    .from('action_plans')
    .insert({
      user_id: userId,
      ai_health_profile_id: profileId,
      title: '7-Day Health Coach Plan',
      duration_days: 7,
      start_date: new Date().toISOString().slice(0, 10),
      end_date: addDays(6),
      status: 'active'
    })
    .select('id')
    .single();

  if (actionPlanError) {
    throw new Error(`Unable to save 7-day plan: ${actionPlanError.message}`);
  }

  const dailyTasks = profile.sevenDayPlan.flatMap((day, dayIndex) =>
    day.tasks.map((task) => ({
      user_id: userId,
      action_plan_id: actionPlan.id,
      task_date: addDays(dayIndex),
      category: mapTaskCategory(task.category),
      title: task.title,
      instruction: task.instruction,
      scheduled_time: toDatabaseTime(task.time),
      status: task.completed ? 'completed' : 'pending',
      completed_at: task.completed ? new Date().toISOString() : null
    }))
  );

  await insertRows(client, 'daily_tasks', dailyTasks);
  await client.from('onboarding_checklist').update({ ai_profile_generated: true, updated_at: new Date().toISOString() }).eq('user_id', userId);
}

async function insertRows(client: SupabaseWriteClient, tableName: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) {
    return;
  }

  const { error } = await client.from(tableName).insert(rows);

  if (error) {
    throw new Error(`Unable to save ${tableName}: ${error.message}`);
  }
}

function validateAIHealthProfile(value: unknown): value is AIHealthProfile {
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
    isMotivationArchetype(value.motivationArchetype) &&
    isHealthScoreArray(value.coreScores) &&
    isHealthScoreArray(value.systemScores) &&
    isSummary(value.summary) &&
    isSupplementArray(value.supplementStack) &&
    isBeeProductArray(value.beeProducts) &&
    isNutritionPlan(value.nutritionPlan) &&
    isWeeklyPlan(value.sevenDayPlan)
  );
}

function buildMockProfile(): AIHealthProfile {
  const safetyNote =
    'Recommendations are informational and do not replace consultation with a qualified healthcare professional.';

  return {
    id: 'mock-edge-health-profile',
    generatedAt: new Date().toISOString(),
    source: 'mock',
    healthScore: 82,
    healthStatus: 'Good condition',
    confidence: 'medium',
    motivationArchetype: 'The Strategist',
    coreScores: [
      { label: 'Energy', value: 78, status: 'good', trend: 'up', action: 'Morning light and protein breakfast' },
      { label: 'Motivation', value: 74, status: 'good', trend: 'stable', action: 'Keep tasks short and measurable' },
      { label: 'Mood', value: 81, status: 'good', trend: 'up', action: 'Evening recovery routine' }
    ],
    systemScores: [
      { label: 'Hormonal System', value: 76, status: 'good', trend: 'up', limitingFactor: 'Stress load', action: 'Protect sleep timing' },
      { label: 'Energy System', value: 72, status: 'attention', trend: 'stable', limitingFactor: 'Afternoon fatigue', action: 'Walk after lunch' },
      { label: 'Nutritional System', value: 68, status: 'attention', trend: 'up', limitingFactor: 'Low meal regularity', action: 'Protein at breakfast' },
      { label: 'Stress & Recovery', value: 61, status: 'attention', trend: 'stable', limitingFactor: 'Elevated evening stimulation', action: 'Screen cutoff' },
      { label: 'Sleep System', value: 70, status: 'attention', trend: 'up', limitingFactor: 'Late bedtime drift', action: 'Sleep before 23:00' },
      { label: 'Digestive System', value: 82, status: 'good', trend: 'stable', limitingFactor: 'Heavy dinners', action: 'Lighter dinner template' }
    ],
    summary: {
      limitingFactors: ['Elevated stress load', 'Inconsistent sleep timing', 'Low-normal vitamin D'],
      biggestResult: ['Sleep stabilization', 'Magnesium evening protocol', 'Perga support before deep work'],
      expectedEffect: 'Over the next 4-8 weeks, the plan targets steadier energy, deeper sleep, improved recovery, and better motivation.',
      nextStep: "Follow Today's Plan and complete the 7-day recovery base.",
      safetyNote
    },
    supplementStack: [
      {
        id: 'sup-1',
        name: 'Magnesium Bisglycinate',
        dosage: '200-400 mg',
        schedule: 'Evening',
        foodInstruction: 'After dinner or 1-2 hours before sleep',
        reason: 'Supports relaxation, recovery, and sleep quality.',
        confidence: 'high',
        stackType: 'essential',
        nextIntake: '21:30',
        takenToday: false,
        compatibilityNotes: 'Can pair with omega-3. Separate from high-dose zinc if stomach sensitivity appears.',
        courseDuration: '4-8 weeks, then review',
        safetyNote
      }
    ],
    beeProducts: [
      {
        id: 'bee-1',
        name: 'Perga',
        reason: 'Matches the focus on energy, concentration, recovery, and productivity.',
        howToUse: '5-10 g in the morning.',
        expectedBenefit: 'Supports energy and cognitive performance.',
        priority: 'high',
        allergyWarning: 'Avoid if allergic to bee products or pollen.'
      }
    ],
    nutritionPlan: [
      {
        id: 'breakfast',
        meal: 'Breakfast',
        title: 'Protein breakfast with eggs and greens',
        description: 'Eggs, greens, buckwheat, olive oil, and tea without sugar.',
        time: '08:30',
        modification: 'If rushed: Greek yogurt, berries, and walnuts.'
      }
    ],
    sevenDayPlan: [
      {
        id: 'day-1',
        day: 'Monday',
        focus: 'Recovery base',
        tasks: [
          {
            id: 'task-1',
            title: 'Walk 30 minutes',
            category: 'movement',
            instruction: 'Keep it easy and conversational.',
            completed: false,
            time: '18:00'
          }
        ]
      }
    ]
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

function isDailyTask(value: unknown): value is DailyTask {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    isTaskCategory(value.category) &&
    typeof value.instruction === 'string' &&
    typeof value.completed === 'boolean'
  );
}

function isMeal(value: unknown): value is NutritionMeal['meal'] {
  return value === 'Breakfast' || value === 'Lunch' || value === 'Dinner' || value === 'Snack' || value === 'Water';
}

function isTaskCategory(value: unknown): value is TaskCategory {
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

function isMotivationArchetype(value: unknown): value is MotivationArchetype {
  return value === 'The Strategist' || value === 'The Creator' || value === 'The Guardian' || value === 'The Explorer';
}

function isStringArray(value: unknown) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}

function findScore(scores: HealthScore[], label: string) {
  return scores.find((score) => score.label.toLowerCase().includes(label.toLowerCase()))?.value ?? null;
}

function confidenceToNumber(confidence: AIHealthProfile['confidence']) {
  switch (confidence) {
    case 'high':
      return 85;
    case 'medium':
      return 65;
    case 'low':
      return 40;
    default:
      return 50;
  }
}

function mapSystemCode(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes('hormonal')) return 'hormonal';
  if (normalized.includes('thyroid')) return 'thyroid';
  if (normalized.includes('metabolic')) return 'metabolic';
  if (normalized.includes('nutritional')) return 'nutritional';
  if (normalized.includes('stress') || normalized.includes('recovery')) return 'stress_recovery';
  if (normalized.includes('inflammation')) return 'inflammation';
  if (normalized.includes('energy')) return 'energy';
  if (normalized.includes('sleep')) return 'sleep';
  if (normalized.includes('digestive')) return 'digestive';

  return 'energy';
}

function mapTaskCategory(category: TaskCategory) {
  switch (category) {
    case 'supplement':
      return 'supplement';
    case 'nutrition':
      return 'nutrition';
    case 'bee_product':
      return 'bee_product';
    case 'sleep':
      return 'sleep';
    case 'movement':
    case 'training':
      return 'physical_activity';
    case 'water':
    case 'recovery':
      return 'lifestyle';
    default:
      return 'lifestyle';
  }
}

function toDatabaseTime(value?: string) {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) {
    return null;
  }

  return value;
}

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return date.toISOString().slice(0, 10);
}
