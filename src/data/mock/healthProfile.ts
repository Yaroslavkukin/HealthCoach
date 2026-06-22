import type {
  BeeProductRecommendation,
  Biomarker,
  DailyTask,
  HealthScore,
  NutritionMeal,
  SuccessStory,
  SupplementRecommendation,
  WeeklyPlanDay
} from '@/types';
import { demoHealthProfile } from '@/data/demoHealthProfile';

export const supplementSafetyNote =
  'Before starting any supplement or bee product protocol, consult a qualified healthcare professional, especially if you have medical conditions, take medication, are pregnant, breastfeeding, or have allergies. Avoid bee products if you are sensitive to honey, pollen, royal jelly, or other bee products.';

export const demoUser = {
  firstName: demoHealthProfile.userName,
  age: 30,
  goal: 'Increase energy and recovery',
  archetype: 'The Strategist',
  profileCompletion: 72,
  healthScore: demoHealthProfile.overallScore,
  healthStatus: 'Good condition',
  planFocus: demoHealthProfile.planFocus
};

export const demoCoreScores: HealthScore[] = [
  { label: 'Energy', value: demoHealthProfile.energyScore, status: 'attention', trend: 'down', action: 'Morning light and protein breakfast' },
  { label: 'Recovery', value: demoHealthProfile.recoveryScore, status: 'attention', trend: 'stable', action: 'Evening recovery routine' },
  { label: 'Sleep', value: demoHealthProfile.sleepScore, status: 'attention', trend: 'down', action: 'Sleep before 23:00' }
];

export const demoSystemScores: HealthScore[] = [
  {
    label: 'Hormonal System',
    value: 76,
    status: 'good',
    trend: 'stable',
    limitingFactor: 'Stress load',
    action: 'Protect sleep timing'
  },
  {
    label: 'Energy System',
    value: 72,
    status: 'attention',
    trend: 'stable',
    limitingFactor: 'Afternoon fatigue',
    action: 'Walk after lunch'
  },
  {
    label: 'Nutritional System',
    value: demoHealthProfile.nutritionScore,
    status: 'attention',
    trend: 'stable',
    limitingFactor: 'Low meal regularity',
    action: 'Protein at breakfast'
  },
  {
    label: 'Stress & Recovery',
    value: demoHealthProfile.recoveryScore,
    status: 'attention',
    trend: 'stable',
    limitingFactor: 'Elevated evening stimulation',
    action: 'Magnesium and screen cutoff'
  },
  {
    label: 'Sleep System',
    value: demoHealthProfile.sleepScore,
    status: 'attention',
    trend: 'down',
    limitingFactor: 'Late bedtime drift',
    action: 'Sleep before 23:00'
  },
  {
    label: 'Digestive System',
    value: 78,
    status: 'good',
    trend: 'stable',
    limitingFactor: 'Occasional heavy dinners',
    action: 'Lighter dinner template'
  }
];

export const demoTasks: DailyTask[] = [
  {
    id: 'task-1',
    title: 'Morning light',
    category: 'movement',
    instruction: 'Get 10-20 minutes of outdoor light early.',
    completed: true,
    time: '08:00'
  },
  {
    id: 'task-2',
    title: 'Protein breakfast',
    category: 'nutrition',
    instruction: 'Eat protein with breakfast before caffeine.',
    completed: false,
    time: '08:30'
  },
  {
    id: 'task-3',
    title: 'Walk 30 minutes',
    category: 'movement',
    instruction: 'Keep it easy; today is recovery-focused.',
    completed: false,
    time: '13:30'
  },
  {
    id: 'task-4',
    title: '2 liters of water',
    category: 'water',
    instruction: 'Front-load hydration before evening.',
    completed: false,
    time: 'All day'
  },
  {
    id: 'task-5',
    title: 'Magnesium citrate',
    category: 'supplement',
    instruction: 'Take 1-2 hours before sleep.',
    completed: false,
    time: '21:30'
  },
  {
    id: 'task-6',
    title: 'Sleep target',
    category: 'sleep',
    instruction: 'Lights out before 23:00.',
    completed: false,
    time: '23:00'
  }
];

export const demoSupplements: SupplementRecommendation[] = [
  {
    id: 'sup-1',
    name: 'Magnesium citrate',
    dosage: '1 capsule',
    teaspoonDosage: '1 capsule',
    schedule: 'Evening',
    foodInstruction: 'After dinner or 1-2 hours before sleep',
    reason: 'Supports the evening recovery routine and sleep consistency.',
    confidence: 'high',
    stackType: 'essential',
    nextIntake: '21:30',
    takenToday: false,
    compatibilityNotes: 'Can pair with omega-3. Separate from high-dose zinc if stomach sensitivity appears.',
    courseDuration: '4-8 weeks, then review',
    safetyNote: supplementSafetyNote
  },
  {
    id: 'sup-2',
    name: 'Omega-3',
    dosage: '1000 mg',
    teaspoonDosage: '1 teaspoon',
    schedule: 'Morning',
    foodInstruction: 'With food',
    reason: 'Supports nervous system, inflammation balance, and general recovery.',
    confidence: 'medium',
    stackType: 'essential',
    nextIntake: 'Tomorrow 09:00',
    takenToday: true,
    compatibilityNotes: 'Best with a meal containing fat.',
    courseDuration: '8-12 weeks, then reassess',
    safetyNote: supplementSafetyNote
  },
  {
    id: 'sup-3',
    name: 'Vitamin D3 + K2',
    dosage: '1 capsule',
    teaspoonDosage: '1 capsule',
    schedule: 'Morning',
    foodInstruction: 'With breakfast',
    reason: 'Supports micronutrient status when the demo vitamin D signal is in an attention zone.',
    confidence: 'medium',
    stackType: 'essential',
    nextIntake: 'Tomorrow 09:00',
    takenToday: true,
    compatibilityNotes: 'Take with food; future phase should personalize dose from labs.',
    courseDuration: '8 weeks, then retest',
    safetyNote: supplementSafetyNote
  },
  {
    id: 'sup-4',
    name: 'L-Theanine',
    dosage: '100-200 mg',
    teaspoonDosage: '1/2 teaspoon',
    schedule: 'Day or evening',
    foodInstruction: 'Can be taken with or without food',
    reason: 'Supports calm focus without sedation.',
    confidence: 'medium',
    stackType: 'complete',
    nextIntake: 'Optional',
    takenToday: false,
    compatibilityNotes: 'Useful before focused work or evening wind-down.',
    courseDuration: 'As needed during high-stress weeks',
    safetyNote: supplementSafetyNote
  },
  {
    id: 'sup-5',
    name: 'Honey',
    dosage: '1 teaspoon',
    teaspoonDosage: '1 teaspoon',
    schedule: 'Morning',
    foodInstruction: 'With breakfast or warm tea',
    reason: 'Demo support for morning energy and routine consistency.',
    confidence: 'medium',
    stackType: 'essential',
    nextIntake: 'Tomorrow 09:00',
    takenToday: false,
    compatibilityNotes: 'Avoid if allergic or sensitive to bee products; monitor personal tolerance.',
    courseDuration: 'Use only when tolerated, then review',
    safetyNote: supplementSafetyNote
  },
  {
    id: 'sup-6',
    name: 'Bee Pollen',
    dosage: '1/2 teaspoon',
    teaspoonDosage: '1/2 teaspoon',
    schedule: 'Morning',
    foodInstruction: 'After food',
    reason: 'Supportive nutrient-dense food for users who tolerate bee products.',
    confidence: 'medium',
    stackType: 'complete',
    nextIntake: 'Tomorrow 09:00',
    takenToday: false,
    compatibilityNotes: 'Avoid with pollen allergy; start small and stop if sensitivity appears.',
    courseDuration: '2 weeks, then review tolerance',
    safetyNote: supplementSafetyNote
  },
  {
    id: 'sup-7',
    name: 'Royal Jelly',
    dosage: '1/2 teaspoon',
    teaspoonDosage: '1/2 teaspoon',
    schedule: 'Morning',
    foodInstruction: 'In the morning, with food',
    reason: 'May support vitality and motivation under high cognitive load.',
    confidence: 'medium',
    stackType: 'complete',
    nextIntake: 'Tomorrow 09:00',
    takenToday: false,
    compatibilityNotes: 'Avoid if allergic or sensitive to bee products.',
    courseDuration: '2-4 weeks, then review',
    safetyNote: supplementSafetyNote
  }
];

export const demoBeeProducts: BeeProductRecommendation[] = [
  {
    id: 'bee-1',
    name: 'Perga',
    reason: 'Matches the focus on energy, concentration, recovery, and productivity.',
    howToUse: '5-10 g in the morning.',
    expectedBenefit: 'Supports energy and cognitive performance.',
    priority: 'high',
    allergyWarning: 'Avoid if allergic to bee products or pollen.'
  },
  {
    id: 'bee-2',
    name: 'Royal Jelly',
    reason: 'May support vitality and motivation under high cognitive load.',
    howToUse: 'Morning, according to product instructions.',
    expectedBenefit: 'Supports tone, cognition, and stress adaptation.',
    priority: 'high',
    allergyWarning: 'Avoid if allergic to bee products.'
  },
  {
    id: 'bee-3',
    name: 'Bee Pollen',
    reason: 'Supportive nutrient-dense food for users who tolerate bee products.',
    howToUse: 'Start with a very small amount with breakfast.',
    expectedBenefit: 'Supports nutrient density and daily food quality.',
    priority: 'medium',
    allergyWarning: 'Do not use with pollen allergy.'
  }
];

export const demoBiomarkers: Biomarker[] = [
  {
    id: 'cortisol',
    name: 'Cortisol',
    value: '548',
    unit: 'nmol/L',
    status: 'attention',
    referenceRange: '140-535 nmol/L',
    trend: 'Near the upper edge of the demo range',
    explanation: 'Cortisol in an attention zone may be associated with stress load and insufficient recovery.',
    affects: ['Sleep depth', 'Energy stability', 'Mood', 'Recovery'],
    improvementActions: ['Sleep 7-9 hours', 'Walk daily', 'Reduce late caffeine', 'Use an evening wind-down routine'],
    relatedRecommendations: ['Magnesium evening protocol', '30-minute recovery walk', 'Sleep before 23:00']
  },
  {
    id: 'vitamin-d',
    name: 'Vitamin D',
    value: '28',
    unit: 'ng/ml',
    status: 'attention',
    referenceRange: '30-60 ng/ml',
    trend: 'Stable, slightly below the demo target',
    explanation: 'Vitamin D status may influence energy, mood, and immune resilience.',
    affects: ['Mood', 'Immune resilience', 'Energy', 'Recovery'],
    improvementActions: ['Morning daylight', 'Review intake with a professional', 'Retest after 8 weeks'],
    relatedRecommendations: ['Vitamin D3 with breakfast', 'Morning walk']
  },
  {
    id: 'hba1c',
    name: 'HbA1c',
    value: '5.1',
    unit: '%',
    status: 'good',
    referenceRange: '4.8-5.6%',
    trend: 'Stable',
    explanation: 'HbA1c reflects long-term glucose regulation.',
    affects: ['Energy after meals', 'Cravings', 'Recovery'],
    improvementActions: ['Protein breakfast', 'Walk after lunch', 'Avoid refined sugar'],
    relatedRecommendations: ['Balanced lunch template', 'Post-meal walk']
  }
];

export const demoNutritionMeals: NutritionMeal[] = [
  {
    id: 'breakfast',
    meal: 'Breakfast',
    title: 'Protein-rich breakfast for stable energy',
    description: 'Eggs or Greek yogurt, greens, buckwheat or sourdough, olive oil, and tea without sugar.',
    time: '08:30',
    modification: 'If rushed: Greek yogurt, berries, and walnuts.'
  },
  {
    id: 'lunch',
    meal: 'Lunch',
    title: 'Regular recovery plate',
    description: 'Chicken or fish, rice or potatoes, cooked vegetables, and fermented vegetables if tolerated.',
    time: '13:30',
    modification: 'Restaurant option: grilled protein, side rice, salad, no sweet sauce.'
  },
  {
    id: 'dinner',
    meal: 'Dinner',
    title: 'Sleep-supporting lighter dinner',
    description: 'Turkey, fish, or cottage cheese with vegetables. Keep it easy to digest and avoid late sugar.',
    time: '19:30',
    modification: 'If eating late: reduce starch and keep the portion smaller.'
  },
  {
    id: 'snack',
    meal: 'Snack',
    title: 'Afternoon energy support',
    description: 'Use a small snack only if energy drops between meals.',
    time: '16:30',
    modification: 'If sensitive to pollen, skip bee products and use nuts or yogurt.'
  },
  {
    id: 'water',
    meal: 'Water',
    title: 'Water and minerals across the day',
    description: 'Drink steadily before evening. Add minerals if training, sweating, or eating irregularly.',
    time: 'All day',
    modification: 'Set two 750 ml bottle targets before 18:00.'
  }
];

export const demoWeeklyPlan: WeeklyPlanDay[] = [
  { id: 'mon', day: 'Monday', focus: 'Baseline and morning routine', tasks: demoTasks.slice(0, 4) },
  {
    id: 'tue',
    day: 'Tuesday',
    focus: 'Protein breakfast',
    tasks: [
      { ...demoTasks[0], id: 'tue-1', completed: false },
      { ...demoTasks[1], id: 'tue-2', completed: false },
      { ...demoTasks[3], id: 'tue-3', completed: false },
      { ...demoTasks[5], id: 'tue-4', completed: false }
    ]
  },
  {
    id: 'wed',
    day: 'Wednesday',
    focus: 'Evening recovery routine',
    tasks: [
      { ...demoTasks[2], id: 'wed-1', completed: false },
      { ...demoTasks[3], id: 'wed-2', completed: false },
      { ...demoTasks[4], id: 'wed-3', completed: false },
      { ...demoTasks[5], id: 'wed-4', completed: false }
    ]
  },
  {
    id: 'thu',
    day: 'Thursday',
    focus: 'Walking and sunlight',
    tasks: [
      { ...demoTasks[0], id: 'thu-1', completed: false },
      { ...demoTasks[2], id: 'thu-2', title: 'Walk 35 minutes', completed: false },
      { ...demoTasks[3], id: 'thu-3', completed: false },
      { ...demoTasks[5], id: 'thu-4', completed: false }
    ]
  },
  {
    id: 'fri',
    day: 'Friday',
    focus: 'Nutrition density',
    tasks: [
      { ...demoTasks[1], id: 'fri-1', completed: false },
      { ...demoTasks[3], id: 'fri-2', completed: false },
      { id: 'fri-3', title: 'Omega-3', category: 'supplement', instruction: 'Take with breakfast to support recovery balance.', completed: false, time: '09:00' },
      { ...demoTasks[5], id: 'fri-4', completed: false }
    ]
  },
  {
    id: 'sat',
    day: 'Saturday',
    focus: 'Low-stimulation evening',
    tasks: [
      { ...demoTasks[2], id: 'sat-1', completed: false },
      { ...demoTasks[4], id: 'sat-2', completed: false },
      { ...demoTasks[5], id: 'sat-3', completed: false }
    ]
  },
  {
    id: 'sun',
    day: 'Sunday',
    focus: 'Review and adjust',
    tasks: [
      { ...demoTasks[0], id: 'sun-1', completed: false },
      { ...demoTasks[1], id: 'sun-2', completed: false },
      { ...demoTasks[5], id: 'sun-3', completed: false }
    ]
  }
];

export const demoSuccessStories: SuccessStory[] = [
  {
    id: 'story-1',
    title: 'Energy improved',
    person: 'Founder beta user, 34',
    result: 'Built a steady morning routine and reported fewer afternoon crashes after two weeks.'
  },
  {
    id: 'story-2',
    title: 'Sleep stabilized',
    person: 'Preview cohort user, 29',
    result: 'Used a simpler evening protocol and moved bedtime earlier by 35 minutes.'
  },
  {
    id: 'story-3',
    title: 'Motivation returned',
    person: 'Strategist archetype, 41',
    result: 'Connected daily tasks to a 90-day goal and completed 78% of weekly actions.'
  }
];

export const demoAssistantQuestions = [
  'Why is my cortisol high?',
  'Can I take magnesium and zinc together?',
  'What should I eat today?',
  'What should I order at KFC?',
  'Why do I feel tired after lunch?'
];

export const demoAISummary = {
  limitingFactors: ['Stress load and insufficient recovery', 'Inconsistent sleep timing', 'Micronutrient support needs attention'],
  biggestResult: ['Sleep stabilization', 'Protein breakfast routine', 'Evening recovery routine'],
  expectedEffect: 'Over the next 4-8 weeks, the demo plan targets steadier energy, deeper sleep, improved recovery, and better motivation.',
  nextStep: 'Best weekly focus: lower nervous load, stabilize meals, and keep evenings light.'
};
