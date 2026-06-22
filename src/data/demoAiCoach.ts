import { demoBodyOverview, demoBodySystems, type DemoBodySystem } from '@/data/demoBodyData';
import { demoHealthProfile } from '@/data/demoHealthProfile';
import { demoNutritionMeals, demoSupplements, demoWeeklyPlan } from '@/data/mock/healthProfile';
import type { Language } from '@/i18n';

export type DemoAiCoachTopic =
  | 'today'
  | 'energy'
  | 'sleep'
  | 'recovery'
  | 'body'
  | 'supplements'
  | 'nutrition'
  | 'analyses'
  | 'weekly';

export type DemoAiCoachContext = 'general' | 'nutrition';

export type DemoAiCoachPrompt = {
  id: DemoAiCoachTopic;
  label: Record<Language, string>;
};

export const demoAiCoachPrompts: DemoAiCoachPrompt[] = [
  {
    id: 'energy',
    label: {
      ru: 'Почему у меня проседает энергия?',
      en: 'Why does my energy dip?'
    }
  },
  {
    id: 'today',
    label: {
      ru: 'Что сделать сегодня для восстановления?',
      en: 'What should I do today for recovery?'
    }
  },
  {
    id: 'body',
    label: {
      ru: 'Какие системы тела требуют внимания?',
      en: 'Which body systems need attention?'
    }
  },
  {
    id: 'sleep',
    label: {
      ru: 'Как улучшить сон на этой неделе?',
      en: 'How can I improve sleep this week?'
    }
  },
  {
    id: 'supplements',
    label: {
      ru: 'Какие добавки сейчас в фокусе?',
      en: 'Which supplements are in focus now?'
    }
  },
  {
    id: 'analyses',
    label: {
      ru: 'Что показывает демо-анализ?',
      en: 'What does the demo analysis show?'
    }
  }
];

type DemoAiCoachResponseInput = {
  message: string;
  language: Language;
  context?: DemoAiCoachContext;
};

const englishUserName = 'Alexey';
const systemAttentionRu = getAttentionSystems('ru');
const systemAttentionEn = getAttentionSystems('en');
const supplementFocusRu = ['магний (цитрат)', 'омега-3', 'витамин D3 + K2', 'L-теанин'];
const supplementFocusEn = demoSupplements.slice(0, 4).map((item) => item.name).join(', ');
const nutritionFocusEn = demoNutritionMeals.slice(0, 3).map((item) => item.title).join(', ');
const weeklyFocusEn = demoWeeklyPlan.slice(0, 4).map((day) => day.focus).join(', ');

export function buildDemoAiCoachResponse({ message, language, context = 'general' }: DemoAiCoachResponseInput) {
  const topic = resolveDemoAiCoachTopic(message, context);

  return language === 'ru' ? buildRussianResponse(topic) : buildEnglishResponse(topic);
}

export function buildDemoAiCoachFallbackMessage(language: Language) {
  return language === 'ru'
    ? 'Сейчас показан демо-ответ на основе примера профиля. После подключения ИИ-провайдера ответы будут строиться на ваших данных.'
    : 'Showing a demo response based on the sample profile. Once the AI provider is connected, responses will be based on your data.';
}

function buildRussianResponse(topic: DemoAiCoachTopic) {
  switch (topic) {
    case 'energy':
      return `По демо-профилю энергия сейчас на уровне ${demoHealthProfile.energyScore}/100. Главные ограничители — сон ${demoHealthProfile.sleepScore}/100 и восстановление ${demoHealthProfile.recoveryScore}/100. На сегодня лучше сфокусироваться на белковом завтраке, прогулке 20-30 минут, воде/минералах и спокойном вечере без перегрузки.`;
    case 'sleep':
      return `Сон — одна из главных зон внимания: ${demoHealthProfile.sleepScore}/100. Цель на неделю — стабилизировать отход ко сну, снизить яркий свет вечером и завершать активные задачи раньше. Это может поддержать восстановление, энергию и фокус.`;
    case 'recovery':
      return `Восстановление сейчас на уровне ${demoHealthProfile.recoveryScore}/100 и может ограничивать энергию во второй половине дня. Самый полезный фокус — снизить вечернюю стимуляцию, добавить спокойную прогулку, оставить магний на вечер и не перегружать последние часы перед сном.`;
    case 'body':
      return `Самые важные зоны внимания в демо-профиле — ${systemAttentionRu}. Гормональная система и пищеварение выглядят стабильнее, но зависят от сна, нагрузки и регулярности питания.`;
    case 'supplements':
      return `Сейчас в фокусе демо-профиля: ${supplementFocusRu.join(', ')}. Они связаны с восстановлением, спокойным фокусом, нутритивной поддержкой и вечерней рутиной. Это информационная подсказка: дозировки и совместимость лучше обсуждать со специалистом при выраженных симптомах или приеме лекарств.`;
    case 'nutrition':
      return `Питание сейчас оценивается на ${demoHealthProfile.nutritionScore}/100. Главная задача — регулярный белковый завтрак, плотный обед без сладких соусов, легкий ужин и вода/минералы в течение дня. Такой режим может поддержать энергию и восстановление.`;
    case 'analyses':
      return `Демо-анализ подсвечивает кортизол как зону внимания и витамин D как сигнал для нутритивной поддержки. HbA1c выглядит стабильнее. Это информационная оценка для выбора фокуса: сон, восстановление, свет утром и регулярное питание.`;
    case 'weekly':
      return `Недельный план строится вокруг простых действий: ${demoHealthProfile.weeklyFocus.slice(0, 4).join(', ')}. Лучше не пытаться менять все сразу: начните со сна до 23:00, прогулки, белкового завтрака и спокойного вечера.`;
    case 'today':
    default:
      return `Для ${demoHealthProfile.userName} общий демо-балл сейчас ${demoBodyOverview.score}/100. Сегодня главный фокус — сон, восстановление и стабильная энергия во второй половине дня. Практичный минимум: утренний свет, белковый завтрак, вода/минералы, прогулка 20-30 минут и спокойный вечер.`;
  }
}

function buildEnglishResponse(topic: DemoAiCoachTopic) {
  switch (topic) {
    case 'energy':
      return `In the demo profile, ${englishUserName}'s energy is ${demoHealthProfile.energyScore}/100. The main limiters are sleep at ${demoHealthProfile.sleepScore}/100 and recovery at ${demoHealthProfile.recoveryScore}/100. Today, focus on a protein breakfast, a 20-30 minute walk, water/minerals, and a calm evening without overload.`;
    case 'sleep':
      return `Sleep is one of the main attention zones: ${demoHealthProfile.sleepScore}/100. This week, stabilize bedtime, reduce bright light in the evening, and finish active tasks earlier. That may support recovery, energy, and focus.`;
    case 'recovery':
      return `Recovery is ${demoHealthProfile.recoveryScore}/100 and may be limiting afternoon energy. The useful focus is lowering evening stimulation, adding an easy walk, keeping magnesium in the evening routine, and avoiding overload before sleep.`;
    case 'body':
      return `The main attention zones in the demo profile are ${systemAttentionEn}. Hormonal and digestive systems look steadier, but still depend on sleep, load, and meal regularity.`;
    case 'supplements':
      return `Current supplement focus: ${supplementFocusEn}. They connect to recovery, calm focus, micronutrient support, and the evening routine. This is informational; discuss dosage and compatibility with a qualified professional if symptoms are strong or medications are involved.`;
    case 'nutrition':
      return `Nutrition is currently ${demoHealthProfile.nutritionScore}/100. The demo plan emphasizes ${nutritionFocusEn}, plus water and minerals across the day. This can support steadier energy and recovery.`;
    case 'analyses':
      return `The demo analysis highlights cortisol as an attention-zone signal and vitamin D as a micronutrient-support signal. HbA1c looks steadier. This is not a diagnosis; it is an informational view to guide sleep, recovery, morning light, and regular meals.`;
    case 'weekly':
      return `The weekly plan focuses on ${weeklyFocusEn}. Keep it simple: sleep before 23:00, a walk, a protein breakfast, and a calm evening routine before adding more tasks.`;
    case 'today':
    default:
      return `For ${englishUserName}, the demo score is ${demoBodyOverview.score}/100. Today's main focus is sleep, recovery, and steadier afternoon energy. A practical minimum: morning light, protein breakfast, water/minerals, a 20-30 minute walk, and a calm evening.`;
  }
}

function resolveDemoAiCoachTopic(message: string, context: DemoAiCoachContext): DemoAiCoachTopic {
  const normalized = message.toLowerCase();

  if (context === 'nutrition') {
    return 'nutrition';
  }

  if (includesAny(normalized, ['sleep', 'сон', 'спать', 'циркад', 'bedtime'])) return 'sleep';
  if (includesAny(normalized, ['recovery', 'stress', 'cortisol', 'восстанов', 'стресс', 'кортизол'])) return 'recovery';
  if (includesAny(normalized, ['systems', 'body', 'систем', 'тело'])) return 'body';
  if (includesAny(normalized, ['supplement', 'magnesium', 'omega', 'vitamin', 'добав', 'магний', 'омега', 'витамин'])) return 'supplements';
  if (includesAny(normalized, ['analysis', 'analyses', 'biomarker', 'blood', 'анализ', 'биомаркер'])) return 'analyses';
  if (includesAny(normalized, ['week', 'weekly', 'недел'])) return 'weekly';
  if (includesAny(normalized, ['nutrition', 'food', 'eat', 'ration', 'meal', 'питание', 'рацион', 'есть', 'обед', 'ужин', 'kfc'])) return 'nutrition';
  if (includesAny(normalized, ['energy', 'tired', 'fatigue', 'энерг', 'устал', 'проседает'])) return 'energy';

  return 'today';
}

function getAttentionSystems(language: Language) {
  const attentionSystemIds = ['stress_recovery', 'sleep', 'nutritional'] as const;
  const attentionSystems = attentionSystemIds
    .map((id) => demoBodySystems.find((system) => system.id === id))
    .filter((system): system is DemoBodySystem => Boolean(system));

  if (language === 'ru') {
    return attentionSystems.map((system) => system.title.toLowerCase()).join(', ');
  }

  const englishTitles: Record<string, string> = {
    energy: 'energy and metabolism',
    nutritional: 'nutrition and micronutrient status',
    stress_recovery: 'stress and recovery',
    sleep: 'sleep and circadian rhythm'
  };

  return attentionSystems.map((system) => englishTitles[system.id] ?? system.id).join(', ');
}

function includesAny(value: string, needles: string[]) {
  return needles.some((needle) => value.includes(needle));
}
