import { demoHealthProfile } from '@/data/demoHealthProfile';
import { demoBiomarkers, demoUser } from '@/data/mock/healthProfile';

export type BodySystemStatus = 'good' | 'warning' | 'poor';
export type BodySystemTrend = 'improving' | 'stable' | 'worsening' | 'unknown';

export type BodySystemHeaderId = 'hormones' | 'metabolism' | 'nutrition' | 'stress' | 'digestion' | 'sleep';

export type DemoBodySystem = {
  id: 'hormonal' | 'energy' | 'nutritional' | 'stress_recovery' | 'digestive' | 'sleep';
  legacyIds: string[];
  headerSystemId: BodySystemHeaderId;
  title: string;
  score: number;
  statusLabel: string;
  trend: BodySystemTrend;
  trendLabel: string;
  state: BodySystemStatus;
  confidenceLabel: string;
  description: string;
  limitingFactor: string;
  supportingFactors: string[];
  recommendedAction: string;
  relatedSignals: string[];
  relatedBiomarkers: string[];
  relatedActions: string[];
  relatedSupplements: string[];
};

export type DemoBodyOverview = {
  score: number;
  statusLabel: string;
  trendLabel: string;
  confidenceLabel: string;
  summary: string;
  limitingFactors: string[];
  supportingFactors: string[];
  recommendedAction: string;
  sourceLabel: string;
  sourceDetails: string[];
};

export const demoBodySafetyNote =
  'Это информационная оценка для оптимизации образа жизни. При выраженных симптомах стоит обсудить результаты с врачом.';

const availableBiomarkers = demoBiomarkers.map((biomarker) => {
  if (biomarker.id === 'cortisol') {
    return 'Кортизол';
  }

  if (biomarker.id === 'vitamin-d') {
    return 'Витамин D';
  }

  return biomarker.name;
});

export const demoBodyOverview: DemoBodyOverview = {
  score: demoHealthProfile.overallScore,
  statusLabel: demoHealthProfile.healthStatus,
  trendLabel: 'Стабильно',
  confidenceLabel: 'Средняя точность',
  sourceLabel: 'Демо-профиль',
  summary: demoHealthProfile.summary,
  limitingFactors: [...demoHealthProfile.mainLimiters],
  supportingFactors: [...demoHealthProfile.mainStrengths],
  recommendedAction: demoHealthProfile.recommendedFocus,
  sourceDetails: [
    `Сегодня: энергия ${demoHealthProfile.energyScore}, восстановление ${demoHealthProfile.recoveryScore}, сон ${demoHealthProfile.sleepScore}, питание ${demoHealthProfile.nutritionScore}`,
    `Настроение ${demoHealthProfile.moodScore} и фокус ${demoHealthProfile.focusScore} стабильны, но зависят от восстановления`,
    `Профиль: ${demoUser.firstName}, архетип «Стратег», фокус на сне, восстановлении и питании`,
    `Анализы: ${availableBiomarkers.join(', ')}`,
    `План: ${demoHealthProfile.dailyActions.slice(0, 4).join(', ')}`
  ]
};

export const demoBodySystems: DemoBodySystem[] = [
  {
    id: 'hormonal',
    legacyIds: ['hormones'],
    headerSystemId: 'hormones',
    title: 'Гормональная система',
    score: 76,
    statusLabel: 'Хорошо',
    trend: 'stable',
    trendLabel: 'Стабильно',
    state: 'good',
    confidenceLabel: 'Средняя',
    description:
      'Система выглядит достаточно устойчивой, но чувствительна к качеству сна и уровню стресса.',
    limitingFactor: 'Стрессовая нагрузка',
    supportingFactors: ['Утренняя энергия держится в рабочем диапазоне', 'Профиль Бравермана помогает дозировать нагрузку'],
    recommendedAction: 'Защитить режим сна и восстановление',
    relatedSignals: ['тестостерон', 'кортизол', 'Braverman-профиль', 'энергия утром'],
    relatedBiomarkers: ['Кортизол'],
    relatedActions: ['Сон до 23:00', 'Вечернее снижение стимуляции', 'Короткие измеримые задачи'],
    relatedSupplements: ['Омега-3', 'Магний (цитрат)']
  },
  {
    id: 'energy',
    legacyIds: ['metabolism'],
    headerSystemId: 'metabolism',
    title: 'Энергия и метаболизм',
    score: 72,
    statusLabel: 'Требует внимания',
    trend: 'worsening',
    trendLabel: 'Слегка снижается',
    state: 'warning',
    confidenceLabel: 'Средняя',
    description:
      'Энергия проседает во второй половине дня, вероятно из-за сна, восстановления и питания.',
    limitingFactor: 'Дневная усталость',
    supportingFactors: ['HbA1c выглядит стабильным', 'Есть задача прогулки на 30 минут'],
    recommendedAction: 'Стабилизировать завтрак, прогулку и сон',
    relatedSignals: ['глюкоза', 'витамин D', 'сон', 'активность'],
    relatedBiomarkers: ['HbA1c', 'Витамин D'],
    relatedActions: ['Белковый завтрак', 'Прогулка после обеда', '2 литра воды в течение дня'],
    relatedSupplements: ['Витамин D3 + K2', 'Перга']
  },
  {
    id: 'nutritional',
    legacyIds: ['nutrition'],
    headerSystemId: 'nutrition',
    title: 'Питание и нутритивный статус',
    score: 70,
    statusLabel: 'Требует внимания',
    trend: 'stable',
    trendLabel: 'Стабильно',
    state: 'warning',
    confidenceLabel: 'Средняя',
    description:
      'Есть признаки, что питание и микронутриенты могут ограничивать энергию и восстановление.',
    limitingFactor: 'Недостаточная нутритивная плотность',
    supportingFactors: ['Есть базовая схема завтрака', 'В каталоге уже есть витамин D и омега-3'],
    recommendedAction: 'Усилить белок, минералы и регулярность питания',
    relatedSignals: ['витамин D', 'ферритин', 'магний', 'омега-3', 'белок'],
    relatedBiomarkers: ['Витамин D'],
    relatedActions: ['Белковый завтрак', 'Минералы с едой', 'Ровный питьевой режим'],
    relatedSupplements: ['Витамин D3 + K2', 'Омега-3', 'Магний (цитрат)']
  },
  {
    id: 'stress_recovery',
    legacyIds: ['stress'],
    headerSystemId: 'stress',
    title: 'Стресс и восстановление',
    score: 68,
    statusLabel: 'Главная зона внимания',
    trend: 'worsening',
    trendLabel: 'Нестабильно',
    state: 'warning',
    confidenceLabel: 'Средняя',
    description:
      'Восстановление сейчас может быть главным ограничителем энергии, настроения и продуктивности.',
    limitingFactor: 'Высокая нервная нагрузка',
    supportingFactors: ['В плане уже есть прогулка и вечерний магний', 'Настроение по Today пока держится хорошо'],
    recommendedAction: 'Вечерний режим, дыхание, магний, прогулка',
    relatedSignals: ['кортизол', 'сон', 'утренняя свежесть', 'перегрузка'],
    relatedBiomarkers: ['Кортизол'],
    relatedActions: ['Вечерний ритуал восстановления', '30-минутная прогулка', 'Снижение света вечером'],
    relatedSupplements: ['Магний (цитрат)', 'L-теанин']
  },
  {
    id: 'digestive',
    legacyIds: ['digestion'],
    headerSystemId: 'digestion',
    title: 'Пищеварение',
    score: 78,
    statusLabel: 'Хорошо',
    trend: 'stable',
    trendLabel: 'Стабильно',
    state: 'good',
    confidenceLabel: 'Средняя',
    description:
      'Система выглядит стабильной, но точность оценки зависит от заполненности питания и симптомов.',
    limitingFactor: 'Не хватает данных по реакции на еду',
    supportingFactors: ['План питания уже содержит более лёгкий ужин', 'Есть фокус на регулярность воды'],
    recommendedAction: 'Отслеживать питание и самочувствие после еды',
    relatedSignals: ['аппетит', 'вздутие', 'переносимость продуктов', 'ALT/AST если есть'],
    relatedBiomarkers: ['ALT/AST если есть'],
    relatedActions: ['Лёгкий ужин', 'Дневник реакции на продукты', 'Ферментированные овощи при хорошей переносимости'],
    relatedSupplements: ['Пчелиная пыльца', 'Мёд']
  },
  {
    id: 'sleep',
    legacyIds: [],
    headerSystemId: 'sleep',
    title: 'Сон и циркадные ритмы',
    score: 66,
    statusLabel: 'Требует внимания',
    trend: 'worsening',
    trendLabel: 'Нестабильно',
    state: 'warning',
    confidenceLabel: 'Средняя',
    description:
      'Сон влияет на гормоны, мотивацию, восстановление и дневную энергию.',
    limitingFactor: 'Поздний отход ко сну / вечерняя стимуляция',
    supportingFactors: ['В Today уже есть цель сна до 23:00', 'Магний вынесен на вечер'],
    recommendedAction: 'Сон до 23:00 и снижение света вечером',
    relatedSignals: ['качество сна', 'пробуждения', 'утренняя свежесть', 'вечерняя стимуляция'],
    relatedBiomarkers: ['Кортизол', 'Витамин D'],
    relatedActions: ['Сон до 23:00', 'Утренний свет', 'Снижение экрана и яркого света вечером'],
    relatedSupplements: ['Магний (цитрат)', 'L-теанин']
  }
];

export function getDemoBodySystemByRouteId(id?: string) {
  if (!id) {
    return undefined;
  }

  return demoBodySystems.find((system) => system.id === id || system.legacyIds.includes(id));
}
