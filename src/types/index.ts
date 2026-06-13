export type HealthStatus = 'good' | 'attention' | 'poor' | 'unknown';

export type MotivationArchetype =
  | 'The Strategist'
  | 'The Creator'
  | 'The Guardian'
  | 'The Explorer';

export type HealthScore = {
  label: string;
  value: number;
  status: HealthStatus;
  trend?: 'up' | 'down' | 'stable';
  limitingFactor?: string;
  action?: string;
};

export type DailyTask = {
  id: string;
  title: string;
  category: 'supplement' | 'nutrition' | 'movement' | 'sleep' | 'recovery' | 'bee_product' | 'water' | 'training';
  instruction: string;
  completed: boolean;
  time?: string;
};

export type SupplementStackType = 'essential' | 'complete';

export type SupplementRecommendation = {
  id: string;
  name: string;
  dosage: string;
  capsuleDosage?: string;
  schedule: string;
  foodInstruction: string;
  reason: string;
  confidence: 'low' | 'medium' | 'high';
  stackType: SupplementStackType;
  nextIntake?: string;
  takenToday?: boolean;
  compatibilityNotes?: string;
  courseDuration?: string;
  safetyNote?: string;
};

export type BeeProductRecommendation = {
  id: string;
  name: string;
  reason: string;
  howToUse: string;
  expectedBenefit: string;
  priority: 'low' | 'medium' | 'high';
  allergyWarning?: string;
};

export type Biomarker = {
  id: string;
  name: string;
  value: string;
  unit: string;
  status: HealthStatus;
  explanation: string;
  referenceRange?: string;
  trend?: string;
  affects?: string[];
  improvementActions?: string[];
  relatedRecommendations?: string[];
};

export type NutritionMeal = {
  id: string;
  meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Water';
  title: string;
  description: string;
  time: string;
  modification: string;
};

export type WeeklyPlanDay = {
  id: string;
  day: string;
  focus: string;
  tasks: DailyTask[];
};

export type SuccessStory = {
  id: string;
  title: string;
  person: string;
  result: string;
};

export type AISummary = {
  limitingFactors: string[];
  biggestResult: string[];
  expectedEffect: string;
  nextStep: string;
  safetyNote: string;
};

export type AIHealthProfile = {
  id: string;
  generatedAt: string;
  source: 'mock' | 'edge';
  healthScore: number;
  healthStatus: string;
  confidence: 'low' | 'medium' | 'high';
  motivationArchetype: MotivationArchetype;
  coreScores: HealthScore[];
  systemScores: HealthScore[];
  summary: AISummary;
  supplementStack: SupplementRecommendation[];
  beeProducts: BeeProductRecommendation[];
  nutritionPlan: NutritionMeal[];
  sevenDayPlan: WeeklyPlanDay[];
};
