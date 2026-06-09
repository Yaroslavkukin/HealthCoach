import type { BeeProductRecommendation, Biomarker, DailyTask, HealthScore, SupplementRecommendation } from '@/types';

export const demoCoreScores: HealthScore[] = [
  { label: 'Energy', value: 78, status: 'good', trend: 'up' },
  { label: 'Motivation', value: 74, status: 'good', trend: 'stable' },
  { label: 'Mood', value: 81, status: 'good', trend: 'up' }
];

export const demoSystemScores: HealthScore[] = [
  { label: 'Hormonal System', value: 76, status: 'good', trend: 'up' },
  { label: 'Energy System', value: 72, status: 'attention', trend: 'stable' },
  { label: 'Nutritional System', value: 68, status: 'attention', trend: 'up' },
  { label: 'Stress & Recovery', value: 61, status: 'attention', trend: 'stable' },
  { label: 'Sleep System', value: 70, status: 'attention', trend: 'up' },
  { label: 'Digestive System', value: 82, status: 'good', trend: 'stable' }
];

export const demoTasks: DailyTask[] = [
  {
    id: 'task-1',
    title: 'Omega-3',
    category: 'supplement',
    instruction: 'Take with breakfast.',
    completed: true,
    time: '09:00'
  },
  {
    id: 'task-2',
    title: 'Perga',
    category: 'bee_product',
    instruction: 'Take in the morning before work.',
    completed: false,
    time: '10:00'
  },
  {
    id: 'task-3',
    title: 'Walk 30 minutes',
    category: 'movement',
    instruction: 'Use walking as today\'s recovery base.',
    completed: false,
    time: '18:00'
  },
  {
    id: 'task-4',
    title: 'Magnesium bisglycinate',
    category: 'supplement',
    instruction: 'Take 1–2 hours before sleep.',
    completed: false,
    time: '21:30'
  }
];

export const demoSupplements: SupplementRecommendation[] = [
  {
    id: 'sup-1',
    name: 'Magnesium Bisglycinate',
    dosage: '200–400 mg',
    schedule: 'Evening',
    foodInstruction: 'After dinner or 1–2 hours before sleep',
    reason: 'Supports relaxation, recovery, and sleep quality.',
    confidence: 'high',
    stackType: 'essential',
    nextIntake: '21:30',
    takenToday: false
  },
  {
    id: 'sup-2',
    name: 'Omega-3',
    dosage: '1000 mg',
    schedule: 'Morning',
    foodInstruction: 'With food',
    reason: 'Supports nervous system, inflammation balance, and general recovery.',
    confidence: 'medium',
    stackType: 'essential',
    nextIntake: 'Tomorrow 09:00',
    takenToday: true
  },
  {
    id: 'sup-3',
    name: 'L-Theanine',
    dosage: '100–200 mg',
    schedule: 'Day or evening',
    foodInstruction: 'Can be taken with or without food',
    reason: 'Supports calm focus without sedation.',
    confidence: 'medium',
    stackType: 'complete',
    nextIntake: 'Optional'
  }
];

export const demoBeeProducts: BeeProductRecommendation[] = [
  {
    id: 'bee-1',
    name: 'Perga',
    reason: 'Matches the Health Coach focus on energy, concentration, recovery, and productivity.',
    howToUse: '5–10 g in the morning.',
    expectedBenefit: 'Supports energy and cognitive performance.',
    priority: 'high'
  },
  {
    id: 'bee-2',
    name: 'Royal Jelly',
    reason: 'May support vitality and motivation under high cognitive load.',
    howToUse: 'Morning, according to product instructions.',
    expectedBenefit: 'Supports tone, cognition, and stress adaptation.',
    priority: 'high'
  }
];

export const demoBiomarkers: Biomarker[] = [
  {
    id: 'cortisol',
    name: 'Cortisol',
    value: '560',
    unit: 'nmol/L',
    status: 'attention',
    explanation: 'Elevated cortisol may be associated with stress load and insufficient recovery.'
  },
  {
    id: 'vitamin-d',
    name: 'Vitamin D',
    value: '27',
    unit: 'ng/ml',
    status: 'attention',
    explanation: 'Vitamin D status may influence energy, mood, and immune resilience.'
  },
  {
    id: 'hba1c',
    name: 'HbA1c',
    value: '5.1',
    unit: '%',
    status: 'good',
    explanation: 'HbA1c reflects long-term glucose regulation.'
  }
];
