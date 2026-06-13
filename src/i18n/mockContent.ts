import type { TranslationKey } from '@/i18n/translations/en';
import type {
  AISummary,
  BeeProductRecommendation,
  Biomarker,
  DailyTask,
  HealthScore,
  NutritionMeal,
  SuccessStory,
  SupplementRecommendation,
  WeeklyPlanDay
} from '@/types';
import type { ReviewFollowUp } from '@/data/mock/testingReadiness';

type Translate = (key: TranslationKey, params?: Record<string, string | number>) => string;

const simpleLabelKeys: Record<string, TranslationKey> = {
  good: 'common.good',
  attention: 'common.attention',
  poor: 'common.poor',
  unknown: 'common.unknown',
  high: 'common.high',
  medium: 'common.medium',
  low: 'common.low',
  complete: 'readiness.status.complete',
  partial: 'readiness.status.partial',
  empty: 'readiness.status.empty'
};

const timeTextKeys: Record<string, TranslationKey> = {
  'All day': 'mock.time.allDay',
  'Tomorrow 09:00': 'mock.time.tomorrow0900',
  Optional: 'mock.time.optional',
  Morning: 'mock.time.morning',
  Evening: 'mock.time.evening',
  'Day or evening': 'mock.time.dayOrEvening'
};

const notificationTimingKeys: Record<string, TranslationKey> = {
  '08:00 daily': 'readiness.timing.morningPlan',
  'With scheduled meals': 'readiness.timing.supplementWindow',
  'Day 14 after onboarding': 'readiness.timing.review'
};

const healthScoreLabelKeys: Record<string, TranslationKey> = {
  Energy: 'mock.score.energy',
  Motivation: 'mock.score.motivation',
  Mood: 'mock.score.mood',
  Productivity: 'mock.score.productivity',
  'Hormonal System': 'mock.score.hormonal',
  'Energy System': 'mock.score.energySystem',
  'Nutritional System': 'mock.score.nutritional',
  'Stress & Recovery': 'mock.score.stressRecovery',
  'Sleep System': 'mock.score.sleepSystem',
  'Digestive System': 'mock.score.digestive'
};

const healthScoreTextKeys: Record<string, TranslationKey> = {
  'Morning light and protein breakfast': 'mock.score.action.morningLight',
  'Keep tasks short and measurable': 'mock.score.action.shortTasks',
  'Evening recovery routine': 'mock.score.action.eveningRecovery',
  'Stress load': 'mock.score.limit.stressLoad',
  'Protect sleep timing': 'mock.score.action.sleepTiming',
  'Afternoon fatigue': 'mock.score.limit.afternoonFatigue',
  'Walk after lunch': 'mock.score.action.walkLunch',
  'Low meal regularity': 'mock.score.limit.mealRegularity',
  'Protein at breakfast': 'mock.score.action.proteinBreakfast',
  'Elevated evening stimulation': 'mock.score.limit.eveningStimulation',
  'Magnesium and screen cutoff': 'mock.score.action.magnesiumScreen',
  'Late bedtime drift': 'mock.score.limit.bedtimeDrift',
  'Sleep before 23:00': 'mock.score.action.sleepBefore',
  'Occasional heavy dinners': 'mock.score.limit.heavyDinners',
  'Lighter dinner template': 'mock.score.action.lighterDinner'
};

const taskTitleKeys: Record<string, TranslationKey> = {
  'Omega-3': 'mock.task.omega.title',
  Perga: 'mock.task.perga.title',
  'Walk 30 minutes': 'mock.task.walk30.title',
  '2 liters of water': 'mock.task.water.title',
  'Magnesium bisglycinate': 'mock.task.magnesium.title',
  'Sleep target': 'mock.task.sleep.title',
  'Walk 35 minutes': 'mock.task.walk35.title',
  'Protein breakfast': 'mock.task.proteinBreakfast.title',
  'Zone 2 training': 'mock.task.zone2.title'
};

const taskInstructionKeys: Record<string, TranslationKey> = {
  'Take with breakfast to support recovery balance.': 'mock.task.omega.instruction',
  'Take in the morning before deep work.': 'mock.task.perga.instruction',
  'Keep it easy; today is recovery-focused.': 'mock.task.walk30.instruction',
  'Front-load hydration before evening.': 'mock.task.water.instruction',
  'Take 1-2 hours before sleep.': 'mock.task.magnesium.instruction',
  'Lights out before 23:00.': 'mock.task.sleep.instruction',
  'Eat 30-40 g protein early.': 'mock.task.proteinBreakfast.instruction',
  'Keep intensity conversational.': 'mock.task.zone2.instruction'
};

const supplementKeys: Record<string, { name: TranslationKey; reason: TranslationKey; food: TranslationKey; compatibility?: TranslationKey; course?: TranslationKey }> = {
  'sup-1': {
    name: 'mock.supplement.magnesium.name',
    reason: 'mock.supplement.magnesium.reason',
    food: 'mock.supplement.magnesium.food',
    compatibility: 'mock.supplement.magnesium.compatibility',
    course: 'mock.supplement.magnesium.course'
  },
  'sup-2': {
    name: 'mock.supplement.omega.name',
    reason: 'mock.supplement.omega.reason',
    food: 'mock.supplement.omega.food',
    compatibility: 'mock.supplement.omega.compatibility',
    course: 'mock.supplement.omega.course'
  },
  'sup-3': {
    name: 'mock.supplement.vitaminD.name',
    reason: 'mock.supplement.vitaminD.reason',
    food: 'mock.supplement.vitaminD.food',
    compatibility: 'mock.supplement.vitaminD.compatibility',
    course: 'mock.supplement.vitaminD.course'
  },
  'sup-4': {
    name: 'mock.supplement.theanine.name',
    reason: 'mock.supplement.theanine.reason',
    food: 'mock.supplement.theanine.food',
    compatibility: 'mock.supplement.theanine.compatibility',
    course: 'mock.supplement.theanine.course'
  }
};

const beeKeys: Record<string, { name: TranslationKey; reason: TranslationKey; how: TranslationKey; benefit: TranslationKey; warning: TranslationKey }> = {
  'bee-1': {
    name: 'mock.bee.perga.name',
    reason: 'mock.bee.perga.reason',
    how: 'mock.bee.perga.how',
    benefit: 'mock.bee.perga.benefit',
    warning: 'mock.bee.perga.warning'
  },
  'bee-2': {
    name: 'mock.bee.royalJelly.name',
    reason: 'mock.bee.royalJelly.reason',
    how: 'mock.bee.royalJelly.how',
    benefit: 'mock.bee.royalJelly.benefit',
    warning: 'mock.bee.royalJelly.warning'
  },
  'bee-3': {
    name: 'mock.bee.pollen.name',
    reason: 'mock.bee.pollen.reason',
    how: 'mock.bee.pollen.how',
    benefit: 'mock.bee.pollen.benefit',
    warning: 'mock.bee.pollen.warning'
  }
};

const mealKeys: Record<string, { meal: TranslationKey; title: TranslationKey; description: TranslationKey; modification: TranslationKey }> = {
  breakfast: {
    meal: 'mock.meal.breakfast.meal',
    title: 'mock.meal.breakfast.title',
    description: 'mock.meal.breakfast.description',
    modification: 'mock.meal.breakfast.modification'
  },
  lunch: {
    meal: 'mock.meal.lunch.meal',
    title: 'mock.meal.lunch.title',
    description: 'mock.meal.lunch.description',
    modification: 'mock.meal.lunch.modification'
  },
  dinner: {
    meal: 'mock.meal.dinner.meal',
    title: 'mock.meal.dinner.title',
    description: 'mock.meal.dinner.description',
    modification: 'mock.meal.dinner.modification'
  },
  snack: {
    meal: 'mock.meal.snack.meal',
    title: 'mock.meal.snack.title',
    description: 'mock.meal.snack.description',
    modification: 'mock.meal.snack.modification'
  },
  water: {
    meal: 'mock.meal.water.meal',
    title: 'mock.meal.water.title',
    description: 'mock.meal.water.description',
    modification: 'mock.meal.water.modification'
  }
};

const dayKeys: Record<string, { day: TranslationKey; short: TranslationKey; focus: TranslationKey }> = {
  mon: { day: 'mock.weekday.mon', short: 'mock.weekdayShort.mon', focus: 'mock.focus.recoveryBase' },
  tue: { day: 'mock.weekday.tue', short: 'mock.weekdayShort.tue', focus: 'mock.focus.stableEnergy' },
  wed: { day: 'mock.weekday.wed', short: 'mock.weekdayShort.wed', focus: 'mock.focus.lightTraining' },
  thu: { day: 'mock.weekday.thu', short: 'mock.weekdayShort.thu', focus: 'mock.focus.sleepProtection' },
  fri: { day: 'mock.weekday.fri', short: 'mock.weekdayShort.fri', focus: 'mock.focus.workCapacity' },
  sat: { day: 'mock.weekday.sat', short: 'mock.weekdayShort.sat', focus: 'mock.focus.outdoorMovement' },
  sun: { day: 'mock.weekday.sun', short: 'mock.weekdayShort.sun', focus: 'mock.focus.reviewReset' }
};

const storyKeys: Record<string, { title: TranslationKey; person: TranslationKey; result: TranslationKey }> = {
  'story-1': { title: 'mock.story.energy.title', person: 'mock.story.energy.person', result: 'mock.story.energy.result' },
  'story-2': { title: 'mock.story.sleep.title', person: 'mock.story.sleep.person', result: 'mock.story.sleep.result' },
  'story-3': { title: 'mock.story.motivation.title', person: 'mock.story.motivation.person', result: 'mock.story.motivation.result' }
};

const assistantQuestionKeys: TranslationKey[] = ['mock.assistant.q1', 'mock.assistant.q2', 'mock.assistant.q3', 'mock.assistant.q4', 'mock.assistant.q5'];

export function translateUserGoal(value: string, t: Translate) {
  return value === 'Increase energy and recovery' ? t('mock.user.goal.energyRecovery') : value;
}

export function translateHealthStatus(value: string, t: Translate) {
  return value === 'Good condition' ? t('mock.user.status.goodCondition') : value;
}

export function translateArchetype(value: string, t: Translate) {
  return value === 'The Strategist' ? t('mock.archetype.strategist') : value;
}

export function translateSimpleLabel(value: string, t: Translate) {
  return simpleLabelKeys[value] ? t(simpleLabelKeys[value]) : value;
}

export function translateTimeText(value: string, t: Translate) {
  return timeTextKeys[value] ? t(timeTextKeys[value]) : value;
}

export function translateNotificationTiming(value: string, t: Translate) {
  return notificationTimingKeys[value] ? t(notificationTimingKeys[value]) : value;
}

export function translateHealthScore(score: HealthScore, t: Translate): HealthScore {
  return {
    ...score,
    label: healthScoreLabelKeys[score.label] ? t(healthScoreLabelKeys[score.label]) : score.label,
    limitingFactor: score.limitingFactor && healthScoreTextKeys[score.limitingFactor] ? t(healthScoreTextKeys[score.limitingFactor]) : score.limitingFactor,
    action: score.action && healthScoreTextKeys[score.action] ? t(healthScoreTextKeys[score.action]) : score.action
  };
}

export function translateTask(task: DailyTask, t: Translate): DailyTask {
  return {
    ...task,
    title: taskTitleKeys[task.title] ? t(taskTitleKeys[task.title]) : task.title,
    instruction: taskInstructionKeys[task.instruction] ? t(taskInstructionKeys[task.instruction]) : task.instruction,
    time: task.time ? translateTimeText(task.time, t) : task.time
  };
}

export function translateSupplement(supplement: SupplementRecommendation, t: Translate): SupplementRecommendation {
  const keys = supplementKeys[supplement.id];

  if (!keys) {
    return supplement;
  }

  return {
    ...supplement,
    name: t(keys.name),
    reason: t(keys.reason),
    schedule: translateTimeText(supplement.schedule, t),
    foodInstruction: t(keys.food),
    compatibilityNotes: keys.compatibility ? t(keys.compatibility) : supplement.compatibilityNotes,
    courseDuration: keys.course ? t(keys.course) : supplement.courseDuration,
    nextIntake: supplement.nextIntake ? translateTimeText(supplement.nextIntake, t) : supplement.nextIntake,
    safetyNote: t('mock.supplement.safety')
  };
}

export function translateBeeProduct(product: BeeProductRecommendation, t: Translate): BeeProductRecommendation {
  const keys = beeKeys[product.id];

  if (!keys) {
    return product;
  }

  return {
    ...product,
    name: t(keys.name),
    reason: t(keys.reason),
    howToUse: t(keys.how),
    expectedBenefit: t(keys.benefit),
    allergyWarning: t(keys.warning)
  };
}

export function translateNutritionMeal(meal: NutritionMeal, t: Translate): NutritionMeal {
  const keys = mealKeys[meal.id];

  if (!keys) {
    return meal;
  }

  return {
    ...meal,
    meal: t(keys.meal) as NutritionMeal['meal'],
    title: t(keys.title),
    description: t(keys.description),
    modification: t(keys.modification),
    time: translateTimeText(meal.time, t)
  };
}

export function translateWeeklyDay(day: WeeklyPlanDay, t: Translate) {
  const keys = dayKeys[day.id];

  return {
    day: keys ? t(keys.day) : day.day,
    shortDay: keys ? t(keys.short) : day.day.slice(0, 3),
    focus: keys ? t(keys.focus) : day.focus
  };
}

export function translateSuccessStory(story: SuccessStory, t: Translate): SuccessStory {
  const keys = storyKeys[story.id];

  if (!keys) {
    return story;
  }

  return {
    ...story,
    title: t(keys.title),
    person: t(keys.person),
    result: t(keys.result)
  };
}

export function translateReviewFollowUp(item: ReviewFollowUp, t: Translate): ReviewFollowUp {
  const keysById: Record<string, { title: TranslationKey; detail: TranslationKey }> = {
    'today-plan': { title: 'review.followUp.today', detail: 'review.followUp.todayDetail' },
    supplements: { title: 'review.followUp.supplements', detail: 'review.followUp.supplementsDetail' },
    nutrition: { title: 'review.followUp.nutrition', detail: 'review.followUp.nutritionDetail' }
  };
  const keys = keysById[item.id];

  if (!keys) {
    return item;
  }

  return {
    ...item,
    title: t(keys.title),
    detail: t(keys.detail)
  };
}

export function translateAssistantQuestion(question: string, index: number, t: Translate) {
  return assistantQuestionKeys[index] ? t(assistantQuestionKeys[index]) : question;
}

export function translateAISummary(summary: Partial<AISummary>, t: Translate): AISummary {
  return {
    ...summary,
    limitingFactors: [t('mock.summary.limiting1'), t('mock.summary.limiting2'), t('mock.summary.limiting3')],
    biggestResult: [t('mock.summary.biggest1'), t('mock.summary.biggest2'), t('mock.summary.biggest3')],
    expectedEffect: t('mock.summary.expected'),
    nextStep: t('mock.summary.nextStep'),
    safetyNote: t('mock.supplement.safety')
  };
}

export function translatePersistenceMessage(message: string, t: Translate) {
  const keyByMessage: Record<string, TranslationKey> = {
    'Profile read skipped; using mock profile data.': 'service.profileReadMock',
    'Unable to read Supabase profile.': 'service.profileReadError',
    'Profile loaded from Supabase.': 'service.profileReadSupabase',
    'Profile saved to mock fallback.': 'service.profileSavedMock',
    'Unable to save Supabase profile.': 'service.profileSavedError',
    'Profile saved to Supabase.': 'service.profileSavedSupabase',
    'Mock profile delete acknowledged.': 'service.profileDeleteMock',
    'Unable to delete Supabase profile.': 'service.profileDeleteError',
    'Profile deleted from Supabase.': 'service.profileDeletedSupabase',
    'Delivery information saved to mock fallback.': 'service.deliverySavedMock',
    'Unable to read delivery profile.': 'service.deliveryReadError',
    'Unable to save delivery profile.': 'service.deliverySavedError',
    'Delivery profile saved to Supabase.': 'service.deliverySavedSupabase',
    'Blood upload metadata saved to mock fallback.': 'service.bloodSavedMock',
    'Unable to save blood upload metadata.': 'service.bloodSavedError',
    'Blood upload metadata saved to Supabase.': 'service.bloodSavedSupabase',
    'Onboarding checklist saved to mock fallback.': 'service.checklistSavedMock',
    'Unable to read onboarding checklist.': 'service.checklistReadError',
    'Unable to save onboarding checklist.': 'service.checklistSavedError',
    'Onboarding checklist saved to Supabase.': 'service.checklistSavedSupabase',
    'Daily task status saved to mock fallback.': 'service.taskSavedMock',
    'Unable to save daily task status.': 'service.taskSavedError',
    'Daily task status saved to Supabase.': 'service.taskSavedSupabase',
    'Lifestyle assessment saved to mock fallback.': 'service.lifestyleSavedMock',
    'Unable to save lifestyle assessment.': 'service.lifestyleSavedError',
    'Lifestyle assessment saved to Supabase.': 'service.lifestyleSavedSupabase',
    'Nutrition assessment saved to mock fallback.': 'service.nutritionSavedMock',
    'Unable to save nutrition assessment.': 'service.nutritionSavedError',
    'Nutrition assessment saved to Supabase.': 'service.nutritionSavedSupabase',
    'Braverman assessment saved to mock fallback.': 'service.bravermanSavedMock',
    'Unable to save Braverman assessment.': 'service.bravermanSavedError',
    'Braverman assessment saved to Supabase.': 'service.bravermanSavedSupabase',
    'Using a demo health profile because secure generation is unavailable.': 'service.aiMockUnavailable',
    'Health profile generated through the secure backend.': 'service.aiGeneratedSecure',
    'Secure generation is unavailable, so the demo health profile is shown.': 'service.aiSecureUnavailable',
    'Secure generation returned an incomplete profile, so the demo health profile is shown.': 'service.aiInvalidProfile',
    'Secure generation could not be reached, so the demo health profile is shown.': 'service.aiUnreachable'
  };

  return keyByMessage[message] ? t(keyByMessage[message]) : message;
}

export function translateBiomarker(marker: Biomarker, t: Translate): Biomarker {
  switch (marker.id) {
    case 'cortisol':
      return {
        ...marker,
        name: t('mock.biomarker.cortisol.name'),
        referenceRange: t('mock.biomarker.cortisol.reference'),
        trend: t('mock.biomarker.cortisol.trend'),
        explanation: t('mock.biomarker.cortisol.explanation'),
        affects: [
          t('mock.biomarker.cortisol.affect.sleep'),
          t('mock.biomarker.cortisol.affect.energy'),
          t('mock.biomarker.cortisol.affect.mood'),
          t('mock.biomarker.cortisol.affect.recovery')
        ],
        improvementActions: [
          t('mock.biomarker.cortisol.action.sleep'),
          t('mock.biomarker.cortisol.action.walk'),
          t('mock.biomarker.cortisol.action.caffeine'),
          t('mock.biomarker.cortisol.action.windDown')
        ],
        relatedRecommendations: [
          t('mock.biomarker.cortisol.related.magnesium'),
          t('mock.biomarker.cortisol.related.walk'),
          t('mock.biomarker.cortisol.related.sleep')
        ]
      };
    case 'vitamin-d':
      return {
        ...marker,
        name: t('mock.biomarker.vitaminD.name'),
        referenceRange: t('mock.biomarker.vitaminD.reference'),
        trend: t('mock.biomarker.vitaminD.trend'),
        explanation: t('mock.biomarker.vitaminD.explanation'),
        affects: [
          t('mock.biomarker.vitaminD.affect.mood'),
          t('mock.biomarker.vitaminD.affect.immune'),
          t('mock.biomarker.vitaminD.affect.energy'),
          t('mock.biomarker.vitaminD.affect.recovery')
        ],
        improvementActions: [
          t('mock.biomarker.vitaminD.action.daylight'),
          t('mock.biomarker.vitaminD.action.professional'),
          t('mock.biomarker.vitaminD.action.retest')
        ],
        relatedRecommendations: [t('mock.biomarker.vitaminD.related.d3'), t('mock.biomarker.vitaminD.related.walk')]
      };
    case 'hba1c':
      return {
        ...marker,
        name: t('mock.biomarker.hba1c.name'),
        referenceRange: t('mock.biomarker.hba1c.reference'),
        trend: t('mock.biomarker.hba1c.trend'),
        explanation: t('mock.biomarker.hba1c.explanation'),
        affects: [
          t('mock.biomarker.hba1c.affect.energy'),
          t('mock.biomarker.hba1c.affect.cravings'),
          t('mock.biomarker.hba1c.affect.recovery')
        ],
        improvementActions: [
          t('mock.biomarker.hba1c.action.protein'),
          t('mock.biomarker.hba1c.action.walk'),
          t('mock.biomarker.hba1c.action.sugar')
        ],
        relatedRecommendations: [t('mock.biomarker.hba1c.related.lunch'), t('mock.biomarker.hba1c.related.walk')]
      };
    default:
      return marker;
  }
}
