// This is an original Health Coach-adapted Braverman-style question bank. It follows the documented scoring structure but does not copy the public questionnaire wording.
import type {
  BravermanNeurotransmitter,
  BravermanQuestion,
  BravermanQuestionType,
  BravermanSourceBlock
} from '@/types/braverman';

type QuestionBlockConfig = {
  sourceBlock: BravermanSourceBlock;
  neurotransmitter: BravermanNeurotransmitter;
  type: BravermanQuestionType;
  startOrder: number;
  count: number;
  stems: string[];
  endings: string[];
};

function buildQuestionBlock({
  sourceBlock,
  neurotransmitter,
  type,
  startOrder,
  count,
  stems,
  endings
}: QuestionBlockConfig): BravermanQuestion[] {
  const texts = stems.flatMap((stem) => endings.map((ending) => `${stem} ${ending}`)).slice(0, count);

  return texts.map((text, index) => ({
    id: `${sourceBlock}-${String(index + 1).padStart(3, '0')}`,
    order: startOrder + index,
    text,
    neurotransmitter,
    type,
    sourceBlock
  }));
}

const dopamineDominantStems = [
  'Мне обычно легче включаться в задачу, когда',
  'В привычном ритме я быстрее собираюсь, если',
  'Мне ближе действовать уверенно, когда',
  'Я чаще сохраняю интерес к делу, если',
  'Мне проще принимать решение, когда',
  'Я чувствую больше энергии, если',
  'Мне нравится двигаться вперёд, когда',
  'В работе и быту мне помогает, когда',
  'Я легче беру ответственность, если',
  'Мне комфортнее планировать день, когда'
];

const dopamineDominantEndings = [
  'есть понятная цель и видимый следующий шаг.',
  'можно быстро увидеть результат своих действий.',
  'задача связана с прогрессом, достижением или соревнованием с самим собой.',
  'можно измерить успех и отметить завершённый этап.',
  'есть конкретный вызов, который хочется преодолеть.'
];

const acetylcholineDominantStems = [
  'Мне обычно интереснее заниматься задачей, когда',
  'В обычной жизни мне легче думать, если',
  'Я быстрее оживляюсь, когда',
  'Мне проще учиться, если',
  'Мне ближе искать решение, когда',
  'Я чаще замечаю возможности, если',
  'Мне комфортнее работать, когда',
  'Я легче переключаюсь на новое, если',
  'Мне нравится обсуждать идеи, когда',
  'В планах меня больше вдохновляет, когда'
];

const acetylcholineDominantEndings = [
  'есть пространство для идей и разных вариантов.',
  'можно пробовать необычный подход без жёсткой схемы.',
  'появляется новая информация или неожиданный ракурс.',
  'можно соединять факты, образы и личные наблюдения.',
  'есть выбор, гибкость и возможность экспериментировать.'
];

const gabaDominantStems = [
  'Мне обычно спокойнее действовать, когда',
  'В привычном ритме мне помогает, если',
  'Мне легче сохранять устойчивость, когда',
  'Я лучше выполняю задачи, если',
  'Мне комфортнее принимать решения, когда',
  'Я чаще чувствую порядок в делах, если',
  'Мне проще поддерживать привычки, когда',
  'В команде или семье мне важно, чтобы',
  'Я легче возвращаюсь к равновесию, если',
  'Мне ближе планировать неделю, когда'
];

const gabaDominantEndings = [
  'есть понятная структура и предсказуемый порядок.',
  'день построен вокруг стабильных повторяемых шагов.',
  'правила и ожидания проговорены заранее.',
  'можно спокойно следовать плану без лишней спешки.',
  'есть ощущение надёжности, ритма и завершённости.'
];

const serotoninDominantStems = [
  'Мне обычно легче сохранять хороший настрой, когда',
  'В обычной жизни мне важно, чтобы',
  'Я быстрее восстанавливаюсь, если',
  'Мне проще включаться в дела, когда',
  'Мне ближе выбирать привычки, если',
  'Я чаще чувствую внутренний ресурс, когда',
  'Мне комфортнее общаться, если',
  'Я легче принимаю перемены, когда',
  'Мне нравится строить день так, чтобы',
  'Я лучше держу ритм, если'
];

const serotoninDominantEndings = [
  'есть ощущение удовольствия, смысла и живого интереса.',
  'план не выглядит давлением и оставляет место для выбора.',
  'рядом есть поддержка, тёплый контакт или приятная атмосфера.',
  'можно учитывать настроение, восстановление и личные ощущения.',
  'есть баланс между полезным действием и ощущением жизни.'
];

const dopamineAttentionStems = [
  'В последнее время мне бывает сложнее',
  'Сейчас я чаще замечаю, что мне трудно',
  'В последние дни мне не всегда удаётся',
  'Сейчас мне может не хватать ресурса, чтобы',
  'В текущем состоянии мне бывает непросто',
  'Недавно я чаще откладываю моменты, где нужно',
  'Сейчас мне сложнее сохранять импульс, когда',
  'В последнее время я быстрее устаю от задач, где',
  'Сейчас мне бывает труднее начать дело, если',
  'В последние дни мне сложнее чувствовать азарт, когда'
];

const dopamineAttentionEndings = [
  'начать действие без внешнего толчка.',
  'держать фокус на цели до завершения этапа.',
  'видеть смысл в задачах, где результат появится не сразу.'
];

const acetylcholineAttentionStems = [
  'В последнее время мне бывает сложнее',
  'Сейчас я чаще замечаю напряжение, когда нужно',
  'В последние дни мне не всегда легко',
  'Сейчас мне может быть трудно',
  'В текущем состоянии мне непросто',
  'Недавно я чаще устаю, когда нужно',
  'Сейчас мне сложнее сохранять интерес, если нужно',
  'В последнее время мне труднее находить свежий взгляд, когда нужно',
  'Сейчас мне бывает непросто удерживать внимание, если нужно',
  'В последние дни мне сложнее быстро включаться, когда нужно'
];

const acetylcholineAttentionEndings = [
  'придумывать новые варианты решения.',
  'запоминать детали и связывать их между собой.',
  'переключаться между идеями без ощущения перегруза.'
];

const gabaAttentionStems = [
  'В последнее время мне бывает сложнее',
  'Сейчас я чаще замечаю, что мне трудно',
  'В последние дни мне не всегда удаётся',
  'Сейчас мне может не хватать спокойствия, чтобы',
  'В текущем состоянии мне бывает непросто',
  'Недавно я быстрее напрягаюсь, когда нужно',
  'Сейчас мне труднее сохранять ровный ритм, если нужно',
  'В последнее время мне сложнее расслабиться, когда нужно',
  'Сейчас мне бывает трудно чувствовать устойчивость, если нужно',
  'В последние дни мне сложнее возвращаться к спокойствию, когда нужно'
];

const gabaAttentionEndings = [
  'сохранять ровный темп без внутренней спешки.',
  'восстанавливаться после нагрузки или общения.',
  'придерживаться привычной структуры без срывов ритма.'
];

const serotoninAttentionStems = [
  'В последнее время мне бывает сложнее',
  'Сейчас я чаще замечаю, что мне трудно',
  'В последние дни мне не всегда удаётся',
  'Сейчас мне может не хватать мягкости, чтобы',
  'В текущем состоянии мне бывает непросто',
  'Недавно я быстрее теряю удовольствие, когда нужно',
  'Сейчас мне сложнее поддерживать настроение, если нужно',
  'В последнее время мне труднее чувствовать интерес, когда нужно',
  'Сейчас мне бывает непросто восстанавливаться эмоционально, если нужно',
  'В последние дни мне сложнее выбирать заботливый темп, когда нужно'
];

const serotoninAttentionEndings = [
  'получать удовольствие от обычных дел.',
  'сохранять эмоциональную гибкость при изменениях.',
  'чувствовать лёгкость, интерес и желание продолжать.'
];

export const bravermanQuestions: BravermanQuestion[] = [
  ...buildQuestionBlock({
    sourceBlock: '1A',
    neurotransmitter: 'dopamine',
    type: 'dominant',
    startOrder: 1,
    count: 50,
    stems: dopamineDominantStems,
    endings: dopamineDominantEndings
  }),
  ...buildQuestionBlock({
    sourceBlock: '2A',
    neurotransmitter: 'acetylcholine',
    type: 'dominant',
    startOrder: 51,
    count: 50,
    stems: acetylcholineDominantStems,
    endings: acetylcholineDominantEndings
  }),
  ...buildQuestionBlock({
    sourceBlock: '3A',
    neurotransmitter: 'gaba',
    type: 'dominant',
    startOrder: 101,
    count: 50,
    stems: gabaDominantStems,
    endings: gabaDominantEndings
  }),
  ...buildQuestionBlock({
    sourceBlock: '4A',
    neurotransmitter: 'serotonin',
    type: 'dominant',
    startOrder: 151,
    count: 50,
    stems: serotoninDominantStems,
    endings: serotoninDominantEndings
  }),
  ...buildQuestionBlock({
    sourceBlock: '1B',
    neurotransmitter: 'dopamine',
    type: 'attention',
    startOrder: 201,
    count: 29,
    stems: dopamineAttentionStems,
    endings: dopamineAttentionEndings
  }),
  ...buildQuestionBlock({
    sourceBlock: '2B',
    neurotransmitter: 'acetylcholine',
    type: 'attention',
    startOrder: 230,
    count: 29,
    stems: acetylcholineAttentionStems,
    endings: acetylcholineAttentionEndings
  }),
  ...buildQuestionBlock({
    sourceBlock: '3B',
    neurotransmitter: 'gaba',
    type: 'attention',
    startOrder: 259,
    count: 29,
    stems: gabaAttentionStems,
    endings: gabaAttentionEndings
  }),
  ...buildQuestionBlock({
    sourceBlock: '4B',
    neurotransmitter: 'serotonin',
    type: 'attention',
    startOrder: 288,
    count: 28,
    stems: serotoninAttentionStems,
    endings: serotoninAttentionEndings
  })
];
