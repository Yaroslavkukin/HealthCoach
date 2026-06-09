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
};

export type DailyTask = {
  id: string;
  title: string;
  category: 'supplement' | 'nutrition' | 'movement' | 'sleep' | 'recovery' | 'bee_product';
  instruction: string;
  completed: boolean;
  time?: string;
};

export type SupplementStackType = 'essential' | 'complete';

export type SupplementRecommendation = {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  foodInstruction: string;
  reason: string;
  confidence: 'low' | 'medium' | 'high';
  stackType: SupplementStackType;
  nextIntake?: string;
  takenToday?: boolean;
};

export type BeeProductRecommendation = {
  id: string;
  name: string;
  reason: string;
  howToUse: string;
  expectedBenefit: string;
  priority: 'low' | 'medium' | 'high';
};

export type Biomarker = {
  id: string;
  name: string;
  value: string;
  unit: string;
  status: HealthStatus;
  explanation: string;
};
