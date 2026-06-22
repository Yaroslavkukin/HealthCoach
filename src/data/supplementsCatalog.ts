import type { ImageSourcePropType } from 'react-native';

const productImages = {
  honey: require('../../assets/images/bee-product-honey-icon.png'),
  pergaHoney: require('../../assets/images/bee-product-perga-icon.png'),
  pollen: require('../../assets/images/bee-product-pollen-icon.png'),
  royalJelly: require('../../assets/images/bee-product-royal-jelly-icon.png'),
  supplement: require('../../assets/images/supplement-product-icon.png')
};

export type SupplementManufacturer = 'EVALITE' | 'HIVITAL' | 'AM BOOST' | 'NOW Foods' | 'Nootropics Depot';

export type SupplementProduct = {
  id: string;
  type: 'supplement' | 'beeProduct';
  nameRu: string;
  nameEn: string;
  category: string;
  categoryRu: string;
  categoryEn: string;
  shortDescriptionRu: string;
  shortDescriptionEn: string;
  detailedDescriptionRu?: string;
  detailedDescriptionEn?: string;
  defaultDosageRu?: string;
  defaultDosageEn?: string;
  timingRu?: string;
  timingEn?: string;
  intakeInstructionRu?: string;
  intakeInstructionEn?: string;
  courseRu?: string;
  courseEn?: string;
  safetyNoteRu?: string;
  safetyNoteEn?: string;
  compatibilityNoteRu?: string;
  compatibilityNoteEn?: string;
  productUrl?: string;
  sourceName?: string;
  manufacturer?: SupplementManufacturer;
  image: ImageSourcePropType;
};

const supplementSafetyNoteRu =
  'Перед началом любого протокола добавок или пчелопродуктов проконсультируйтесь с квалифицированным специалистом, особенно при хронических состояниях, приеме лекарств, беременности, грудном вскармливании или аллергиях.';
const supplementSafetyNoteEn =
  'Before starting any supplement or bee product protocol, consult a qualified healthcare professional, especially if you have medical conditions, take medication, are pregnant, breastfeeding, or have allergies.';
const beeProductSafetyNoteRu =
  'Избегайте при аллергии или чувствительности к пчелопродуктам. Пчелопродукты не заменяют сон, питание, движение и базовые добавки.';
const beeProductSafetyNoteEn =
  'Avoid if allergic or sensitive to bee products. Bee products do not replace sleep, nutrition, physical activity, or essential supplements.';

const sellerSources = {
  evalite: {
    sourceName: 'evalite.ru',
    productUrl: 'https://evalite.ru/',
    manufacturer: 'EVALITE'
  },
  forbase: {
    sourceName: 'forbase.shop',
    productUrl: 'https://forbase.shop/',
    manufacturer: 'AM BOOST'
  },
  hivital: {
    sourceName: 'hivital.com',
    productUrl: 'https://www.hivital.com/en/products/?add-to-cart=87629&quantity=1',
    manufacturer: 'HIVITAL'
  },
  b17: {
    sourceName: 'b17-shop.ru',
    productUrl: 'https://b17-shop.ru/',
    manufacturer: 'NOW Foods'
  },
  nootropicsDepot: {
    sourceName: 'iherb-russia.org',
    productUrl:
      'https://iherb-russia.org/product/california-gold-nutrition-ekstrakt-shafrana-s-ekstraktom-affron-28-mg-60-rastitelnyh-kapsul?ysclid=mqkupy5y5l938274205',
    manufacturer: 'Nootropics Depot'
  }
} as const;

type SellerSourceKey = keyof typeof sellerSources;

type DocumentSupplementSeed = {
  id: string;
  nameRu: string;
  nameEn: string;
  category: string;
  categoryRu: string;
  categoryEn: string;
  shortDescriptionRu: string;
  shortDescriptionEn?: string;
  detailedDescriptionRu?: string;
  detailedDescriptionEn?: string;
  defaultDosageRu?: string;
  defaultDosageEn?: string;
  timingRu?: string;
  timingEn?: string;
  intakeInstructionRu?: string;
  intakeInstructionEn?: string;
  courseRu?: string;
  courseEn?: string;
  compatibilityNoteRu?: string;
  compatibilityNoteEn?: string;
  source?: SellerSourceKey;
};

function createDocumentSupplementProduct(seed: DocumentSupplementSeed): SupplementProduct {
  const source = seed.source ? sellerSources[seed.source] : undefined;

  return {
    id: seed.id,
    type: 'supplement',
    nameRu: seed.nameRu,
    nameEn: seed.nameEn,
    category: seed.category,
    categoryRu: seed.categoryRu,
    categoryEn: seed.categoryEn,
    shortDescriptionRu: seed.shortDescriptionRu,
    shortDescriptionEn: seed.shortDescriptionEn ?? seed.shortDescriptionRu,
    detailedDescriptionRu: seed.detailedDescriptionRu,
    detailedDescriptionEn: seed.detailedDescriptionEn ?? seed.detailedDescriptionRu,
    defaultDosageRu: seed.defaultDosageRu,
    defaultDosageEn: seed.defaultDosageEn ?? seed.defaultDosageRu,
    timingRu: seed.timingRu,
    timingEn: seed.timingEn ?? seed.timingRu,
    intakeInstructionRu: seed.intakeInstructionRu,
    intakeInstructionEn: seed.intakeInstructionEn ?? seed.intakeInstructionRu,
    courseRu: seed.courseRu,
    courseEn: seed.courseEn ?? seed.courseRu,
    safetyNoteRu: supplementSafetyNoteRu,
    safetyNoteEn: supplementSafetyNoteEn,
    compatibilityNoteRu: seed.compatibilityNoteRu,
    compatibilityNoteEn: seed.compatibilityNoteEn ?? seed.compatibilityNoteRu,
    productUrl: source?.productUrl,
    sourceName: source?.sourceName,
    manufacturer: source?.manufacturer,
    image: productImages.supplement
  };
}

const documentedSupplementSeeds: DocumentSupplementSeed[] = [
  {
    id: 'magnesium-bisglycinate-am-boost',
    nameRu: 'Магний бисглицинат',
    nameEn: 'Magnesium bisglycinate',
    category: 'minerals',
    categoryRu: 'Минералы',
    categoryEn: 'Minerals',
    shortDescriptionRu: 'Легкоусвояемая форма магния из документа AM BOOST для расслабления и восстановления.',
    source: 'forbase'
  },
  {
    id: 'magnesium-malate-am-boost',
    nameRu: 'Магний малат',
    nameEn: 'Magnesium malate',
    category: 'minerals',
    categoryRu: 'Минералы',
    categoryEn: 'Minerals',
    shortDescriptionRu: 'Форма магния из документа AM BOOST для мышечного напряжения, судорог и общего восстановления.',
    source: 'forbase'
  },
  {
    id: 'magnesium-complex-am-boost',
    nameRu: 'Магний комплексный',
    nameEn: 'Magnesium complex',
    category: 'minerals',
    categoryRu: 'Минералы',
    categoryEn: 'Minerals',
    shortDescriptionRu: 'Синергия шести форм магния из документа AM BOOST: бисглицинат, цитрат, малат, таурат, треонат и аскорбат.',
    source: 'forbase'
  },
  {
    id: 'l-theanine-am-boost',
    nameRu: 'L-Теанин',
    nameEn: 'L-theanine',
    category: 'amino-acids',
    categoryRu: 'Аминокислоты',
    categoryEn: 'Amino acids',
    shortDescriptionRu: 'Аминокислота из документа AM BOOST для спокойной концентрации без потери ясности.',
    source: 'forbase'
  },
  {
    id: 'taurine-am-boost',
    nameRu: 'Таурин',
    nameEn: 'Taurine',
    category: 'amino-acids',
    categoryRu: 'Аминокислоты',
    categoryEn: 'Amino acids',
    shortDescriptionRu: 'Аминокислота из документа AM BOOST для ровной энергии, фокуса и восстановления.',
    source: 'forbase'
  },
  {
    id: 'beta-alanine-am-boost',
    nameRu: 'Бета-аланин',
    nameEn: 'Beta-alanine',
    category: 'sports-nutrition',
    categoryRu: 'Спортивное питание',
    categoryEn: 'Sports nutrition',
    shortDescriptionRu: 'Добавка из документа AM BOOST для коротких интенсивных нагрузок и общей работоспособности.',
    source: 'forbase'
  },
  {
    id: 'lecithin-am-boost',
    nameRu: 'Лецитин',
    nameEn: 'Lecithin',
    category: 'phospholipids',
    categoryRu: 'Фосфолипиды',
    categoryEn: 'Phospholipids',
    shortDescriptionRu: 'Подсолнечный лецитин из документа AM BOOST как источник фосфолипидов для мембран клеток.',
    source: 'forbase'
  },
  {
    id: 'zinc-complex-am-boost',
    nameRu: 'Цинк комплексный',
    nameEn: 'Zinc complex',
    category: 'minerals',
    categoryRu: 'Минералы',
    categoryEn: 'Minerals',
    shortDescriptionRu: 'Комплекс цинка из документа AM BOOST с пиколинатом, бисглицинатом и витаминами-синергистами.',
    source: 'forbase'
  },
  {
    id: 'glutamine-am-boost',
    nameRu: 'Глутамин',
    nameEn: 'Glutamine',
    category: 'amino-acids',
    categoryRu: 'Аминокислоты',
    categoryEn: 'Amino acids',
    shortDescriptionRu: 'Аминокислота из документа AM BOOST для поддержки мышц, ЖКТ, иммунитета и восстановления.',
    intakeInstructionRu: 'В документе указан пример: 20 г утром с тёплой водой и ещё 2-3 раза по 10 г в течение дня до еды.',
    source: 'forbase'
  },
  {
    id: 'combat-rage-am-boost',
    nameRu: 'Боевая ярость',
    nameEn: 'Combat Rage',
    category: 'sports-nutrition',
    categoryRu: 'Спортивное питание',
    categoryEn: 'Sports nutrition',
    shortDescriptionRu: 'Предтренировочный комплекс из документа AM BOOST с кофеином, экстрактом зелёного чая, таурином и бета-аланином.',
    source: 'forbase'
  },
  {
    id: 'witcher-elixir-am-boost',
    nameRu: 'Ведьмачий эликсир',
    nameEn: 'Witcher Elixir',
    category: 'adaptogens',
    categoryRu: 'Адаптогены',
    categoryEn: 'Adaptogens',
    shortDescriptionRu: 'Растительный комплекс из документа AM BOOST с женьшенем, родиолой и элеутерококком.',
    source: 'forbase'
  },
  {
    id: 'jaga-jaga-chocolate-am-boost',
    nameRu: 'Шоколад «Джага-Джага»',
    nameEn: 'Jaga-Jaga chocolate',
    category: 'functional-food',
    categoryRu: 'Функциональное питание',
    categoryEn: 'Functional food',
    shortDescriptionRu: 'Умный шоколад из документа AM BOOST с ноотропным эффектом и ежовиком гребенчатым.',
    source: 'forbase'
  },
  {
    id: 'titan-mass-gainer-am-boost',
    nameRu: 'Гейнер Titan Mass',
    nameEn: 'Titan Mass gainer',
    category: 'sports-nutrition',
    categoryRu: 'Спортивное питание',
    categoryEn: 'Sports nutrition',
    shortDescriptionRu: 'Высокоэнергетическая формула из документа AM BOOST для набора массы и восполнения энергии.',
    source: 'forbase'
  },
  {
    id: 'immune-activator-evalite',
    nameRu: 'Активатор иммунитета',
    nameEn: 'Immune Activator',
    category: 'immune-support',
    categoryRu: 'Иммунная поддержка',
    categoryEn: 'Immune support',
    shortDescriptionRu: 'Комплекс EVALITE с экстрактами кордицепса, чаги, рейши и шиитаке.',
    detailedDescriptionRu: 'В документе описан как продукт для поддержки естественного иммунитета и антиоксидантной защиты.',
    source: 'evalite'
  },
  {
    id: 'charisma-sexuality-evalite',
    nameRu: 'Харизма и сексуальность',
    nameEn: 'Charisma and Sexuality',
    category: 'beauty-support',
    categoryRu: 'Красота и тонус',
    categoryEn: 'Beauty support',
    shortDescriptionRu: 'Комплекс EVALITE с бамбуком, витамином C, гиалуронатом, морским коллагеном и коэнзимом Q10.',
    source: 'evalite'
  },
  {
    id: 'willpower-booster-evalite',
    nameRu: 'Усилитель силы воли',
    nameEn: 'Willpower Booster',
    category: 'adaptogens',
    categoryRu: 'Адаптогены',
    categoryEn: 'Adaptogens',
    shortDescriptionRu: 'Комплекс EVALITE с родиолой, женьшенем, янтарной кислотой и лимонником.',
    source: 'evalite'
  },
  {
    id: 'sechenov-elixir-evalite',
    nameRu: 'Эликсир Сеченова',
    nameEn: 'Sechenov Elixir',
    category: 'nootropics',
    categoryRu: 'Когнитивная поддержка',
    categoryEn: 'Cognitive support',
    shortDescriptionRu: 'Комплекс EVALITE с ежовиком гребенчатым, гинкго, L-теанином, витамином C и чёрным перцем.',
    source: 'evalite'
  },
  {
    id: 'magnesium-l-threonate-evalite',
    nameRu: 'Магний L-треонат',
    nameEn: 'Magnesium L-threonate',
    category: 'minerals',
    categoryRu: 'Минералы',
    categoryEn: 'Minerals',
    shortDescriptionRu: 'Форма магния EVALITE для дневной ясности ума и вечернего баланса без седативности.',
    source: 'evalite'
  },
  {
    id: 'sunflower-lecithin-evalite',
    nameRu: 'Лецитин подсолнечный лабораторный',
    nameEn: 'Laboratory sunflower lecithin',
    category: 'phospholipids',
    categoryRu: 'Фосфолипиды',
    categoryEn: 'Phospholipids',
    shortDescriptionRu: 'Подсолнечный лецитин EVALITE для поддержки липидного обмена, печени и нервной системы.',
    source: 'evalite'
  },
  {
    id: 'l-theanine-antistress-evalite',
    nameRu: 'L-Теанин 99.9% Антистресс',
    nameEn: 'L-theanine 99.9% Antistress',
    category: 'amino-acids',
    categoryRu: 'Аминокислоты',
    categoryEn: 'Amino acids',
    shortDescriptionRu: 'L-теанин EVALITE для концентрации и расслабления без чувства сонливости.',
    source: 'evalite'
  },
  {
    id: 'vertical-male-stamina-evalite',
    nameRu: 'Вертикально',
    nameEn: 'Vertical Male Stamina',
    category: 'men-health',
    categoryRu: 'Мужское здоровье',
    categoryEn: 'Men health',
    shortDescriptionRu: 'Комплекс EVALITE с адаптогенами и растительными афродизиаками.',
    detailedDescriptionRu: 'В документе отмечены женьшень, горянка, трибулис и мака; формула описана как мягкая и накопительная.',
    source: 'evalite'
  },
  {
    id: 'inositol-pro-vita-eb9-evalite',
    nameRu: 'Инозитрол Pro + Vit A/E/B9',
    nameEn: 'Inositol Pro + Vit A/E/B9',
    category: 'vitamins',
    categoryRu: 'Витамины',
    categoryEn: 'Vitamins',
    shortDescriptionRu: 'Комплекс EVALITE с мио-инозитолом, витамином A и фолиевой кислотой.',
    source: 'evalite'
  },
  {
    id: 'women-multivitamins-evalite',
    nameRu: 'Мультивитамины для женщин',
    nameEn: 'Women multivitamins',
    category: 'vitamins',
    categoryRu: 'Витамины',
    categoryEn: 'Vitamins',
    shortDescriptionRu: 'Мультивитаминный комплекс EVALITE для женщин с витаминами, минералами и растительными экстрактами.',
    source: 'evalite'
  },
  {
    id: 'alpha-lipoic-acid-evalite',
    nameRu: 'Альфа-липоевая кислота',
    nameEn: 'Alpha-lipoic acid',
    category: 'antioxidants',
    categoryRu: 'Антиоксиданты',
    categoryEn: 'Antioxidants',
    shortDescriptionRu: 'Альфа-липоевая кислота EVALITE для поддержки чувствительности к инсулину и антиоксидантной защиты.',
    source: 'evalite'
  },
  {
    id: 'functional-cacao-evalite',
    nameRu: 'Функциональный какао',
    nameEn: 'Functional cacao',
    category: 'functional-food',
    categoryRu: 'Функциональное питание',
    categoryEn: 'Functional food',
    shortDescriptionRu: 'Какао EVALITE с ежовиком гребенчатым и комплексом для иммунитета.',
    source: 'evalite'
  },
  {
    id: 'smart-chocolate-evalite',
    nameRu: 'Умный шоколад',
    nameEn: 'Smart chocolate',
    category: 'functional-food',
    categoryRu: 'Функциональное питание',
    categoryEn: 'Functional food',
    shortDescriptionRu: 'Тёмный шоколад EVALITE с суперконцентратом ежовика гребенчатого.',
    source: 'evalite'
  },
  {
    id: 'california-gold-nutrition-saffron-affron',
    nameRu: 'CALIFORNIA GOLD NUTRITION, ЭКСТРАКТ ШАФРАНА, С ЭКСТРАКТОМ AFFRON',
    nameEn: 'California Gold Nutrition, Saffron Extract with Affron Extract',
    category: 'saffron',
    categoryRu: 'Шафран',
    categoryEn: 'Saffron',
    shortDescriptionRu:
      'Экстракт шафрана California Gold Nutrition с Affron из документа Nootropics Depot для поддержки бодрого настроения и расслабления.',
    shortDescriptionEn:
      'California Gold Nutrition saffron extract with Affron from the Nootropics Depot document for mood and relaxation support.',
    detailedDescriptionRu:
      'В документе указано, что продукт подходит для вегетарианцев и веганов, не содержит глютен, ГМО и сою. Шафран описан как специя из Crocus sativus; экстракт позиционируется для поддержки бодрого настроения и расслабления.',
    detailedDescriptionEn:
      'The document states that the product is suitable for vegetarians and vegans and is free from gluten, GMOs, and soy. Saffron is described as a Crocus sativus spice; the extract is positioned for mood and relaxation support.',
    compatibilityNoteRu:
      'В документе указано: подходит для вегетарианцев и веганов; не содержит глютен, ГМО и сою.',
    compatibilityNoteEn:
      'The document states: suitable for vegetarians and vegans; free from gluten, GMOs, and soy.',
    source: 'nootropicsDepot'
  },
  {
    id: 'soy-isoflavones-now',
    nameRu: 'Соевые изофлавоны',
    nameEn: 'Soy isoflavones',
    category: 'women-health',
    categoryRu: 'Женское здоровье',
    categoryEn: 'Women health',
    shortDescriptionRu: 'Изофлавоны сои NOW Foods с 60 мг изофлавонов, описанные в женской корзине добавок.',
    source: 'b17'
  },
  {
    id: 'shatavari-now',
    nameRu: 'Шатавари',
    nameEn: 'Shatavari',
    category: 'women-health',
    categoryRu: 'Женское здоровье',
    categoryEn: 'Women health',
    shortDescriptionRu: 'Адаптоген NOW Foods для женского гормонального баланса из документа.',
    source: 'b17'
  },
  {
    id: 'gamma-e-complex-now',
    nameRu: 'Gamma E Complex',
    nameEn: 'Gamma E Complex',
    category: 'vitamins',
    categoryRu: 'Витамины',
    categoryEn: 'Vitamins',
    shortDescriptionRu: 'Комплекс NOW Foods с витаминами E и гамма-токоферолом.',
    source: 'b17'
  },
  {
    id: 'ashwagandha-standardized-now',
    nameRu: 'Ашваганда стандартизированный экстракт',
    nameEn: 'Ashwagandha standardized extract',
    category: 'adaptogens',
    categoryRu: 'Адаптогены',
    categoryEn: 'Adaptogens',
    shortDescriptionRu: 'Стандартизированный экстракт ашваганды NOW Foods из документа.',
    source: 'b17'
  },
  {
    id: 'saw-palmetto-extract-now',
    nameRu: 'Экстракт серенои',
    nameEn: 'Saw palmetto extract',
    category: 'men-health',
    categoryRu: 'Мужское здоровье',
    categoryEn: 'Men health',
    shortDescriptionRu: 'Экстракт серенои NOW Foods с маслом тыквенных семечек для мужского здоровья.',
    source: 'b17'
  },
  {
    id: 'vitex-berries-now',
    nameRu: 'Ягоды витекса для женщин',
    nameEn: 'Vitex berries for women',
    category: 'women-health',
    categoryRu: 'Женское здоровье',
    categoryEn: 'Women health',
    shortDescriptionRu: 'Витекс NOW Foods из документа для женского гормонального баланса.',
    source: 'b17'
  },
  {
    id: 'indole-3-carbinol-now',
    nameRu: 'Индол-3-карбинол',
    nameEn: 'Indole-3-carbinol',
    category: 'detox-support',
    categoryRu: 'Детокс-поддержка',
    categoryEn: 'Detox support',
    shortDescriptionRu: 'Продукт NOW Foods с индол-3-карбинолом и экстрактом льняного лигнана.',
    source: 'b17'
  },
  {
    id: 'nettle-root-extract-now',
    nameRu: 'Экстракт корня крапивы двудомной',
    nameEn: 'Nettle root extract',
    category: 'men-health',
    categoryRu: 'Мужское здоровье',
    categoryEn: 'Men health',
    shortDescriptionRu: 'Корень крапивы двудомной NOW Foods из документа.',
    source: 'b17'
  },
  {
    id: 'guggulipid-now',
    nameRu: 'Gugulipid Herbal Actives',
    nameEn: 'Gugulipid Herbal Actives',
    category: 'metabolic-support',
    categoryRu: 'Метаболическая поддержка',
    categoryEn: 'Metabolic support',
    shortDescriptionRu: 'Стандартизированный экстракт NOW Foods с гуггулстеронами.',
    source: 'b17'
  },
  {
    id: 'evening-primrose-oil-now',
    nameRu: 'Масло примулы вечерней',
    nameEn: 'Evening primrose oil',
    category: 'women-health',
    categoryRu: 'Женское здоровье',
    categoryEn: 'Women health',
    shortDescriptionRu: 'Super Primrose от NOW Foods с гамма-линоленовой кислотой.',
    source: 'b17'
  },
  {
    id: 'fenugreek-seed-now',
    nameRu: 'Семена пажитника',
    nameEn: 'Fenugreek seed',
    category: 'botanicals',
    categoryRu: 'Растительные экстракты',
    categoryEn: 'Botanical extracts',
    shortDescriptionRu: 'Семена пажитника NOW Foods из женской корзины добавок.',
    source: 'b17'
  },
  {
    id: 'cats-claw-extract-now',
    nameRu: 'Экстракт кошачьего когтя',
    nameEn: "Cat's claw extract",
    category: 'immune-support',
    categoryRu: 'Иммунная поддержка',
    categoryEn: 'Immune support',
    shortDescriptionRu: 'Экстракт коры ункарии NOW Foods из раздела для иммунитета.',
    source: 'b17'
  },
  {
    id: 'red-clover-liquid-now',
    nameRu: 'Красный клевер жидкий экстракт',
    nameEn: 'Red clover liquid extract',
    category: 'women-health',
    categoryRu: 'Женское здоровье',
    categoryEn: 'Women health',
    shortDescriptionRu: 'Жидкий экстракт красного клевера NOW Foods без спирта.',
    source: 'b17'
  },
  {
    id: 'pau-darco-bark-now',
    nameRu: 'Кора муравьиного дерева',
    nameEn: "Pau d'arco bark",
    category: 'botanicals',
    categoryRu: 'Растительные экстракты',
    categoryEn: 'Botanical extracts',
    shortDescriptionRu: 'Кора муравьиного дерева NOW Foods из раздела для иммунитета.',
    source: 'b17'
  },
  {
    id: 'vitamin-a-now',
    nameRu: 'Витамин A',
    nameEn: 'Vitamin A',
    category: 'vitamins',
    categoryRu: 'Витамины',
    categoryEn: 'Vitamins',
    shortDescriptionRu: 'Витамин A NOW Foods из раздела кожи, волос и внешнего вида.',
    source: 'b17'
  },
  {
    id: 'fo-ti-now',
    nameRu: 'Fo-Ti',
    nameEn: 'Fo-Ti',
    category: 'botanicals',
    categoryRu: 'Растительные экстракты',
    categoryEn: 'Botanical extracts',
    shortDescriptionRu: 'Горец многоцветковый NOW Foods из документа.',
    source: 'b17'
  },
  {
    id: 'oceanic-silica-now',
    nameRu: 'Океанский диоксид кремния из красных водорослей',
    nameEn: 'Oceanic silica from red algae',
    category: 'minerals',
    categoryRu: 'Минералы',
    categoryEn: 'Minerals',
    shortDescriptionRu: 'Диоксид кремния NOW Foods из порошка морских красных водорослей.',
    source: 'b17'
  },
  {
    id: 'concentrace-minerals-now',
    nameRu: 'ConcenTrace минералы и микроэлементы',
    nameEn: 'ConcenTrace minerals and trace elements',
    category: 'minerals',
    categoryRu: 'Минералы',
    categoryEn: 'Minerals',
    shortDescriptionRu: 'Таблетки NOW Foods с минералами и микроэлементами для водного баланса.',
    source: 'b17'
  },
  {
    id: 'astaxanthin-now',
    nameRu: 'Астаксантин',
    nameEn: 'Astaxanthin',
    category: 'antioxidants',
    categoryRu: 'Антиоксиданты',
    categoryEn: 'Antioxidants',
    shortDescriptionRu: 'Каротиноид NOW Foods из микроводорослей гематококк для антиоксидантной поддержки.',
    source: 'b17'
  },
  {
    id: 'iron-guard',
    nameRu: 'Iron Guard',
    nameEn: 'Iron Guard',
    category: 'minerals',
    categoryRu: 'Минералы',
    categoryEn: 'Minerals',
    shortDescriptionRu: 'Формула из документа для поддержки уровня железа, эритропоэза и синтеза гемоглобина.',
    intakeInstructionRu: '1-2 капсулы после завтрака.',
    source: 'b17'
  },
  {
    id: 'ibutamoren',
    nameRu: 'Ибутаморен',
    nameEn: 'Ibutamoren',
    category: 'specialized-products',
    categoryRu: 'Специализированные продукты',
    categoryEn: 'Specialized products',
    shortDescriptionRu: 'Специализированный продукт из документа для ускоренного восстановления между тренировками.',
    intakeInstructionRu: '15 мг 3 раза в неделю в вечернее время; при весе больше 110 кг в документе указано повышение до 30 мг.',
    source: 'b17'
  },
  {
    id: 'cialis-v',
    nameRu: 'Сиалис / Cialis-V',
    nameEn: 'Cialis-V',
    category: 'specialized-products',
    categoryRu: 'Специализированные продукты',
    categoryEn: 'Specialized products',
    shortDescriptionRu: 'Специализированный продукт из документа для кровообращения и либидо.',
    intakeInstructionRu: 'Начальная дозировка 5-10 мг; при необходимости в документе указано повышение до 20 мг.',
    source: 'b17'
  },
  {
    id: 'tirzepatide',
    nameRu: 'Тирзепатид',
    nameEn: 'Tirzepatide',
    category: 'specialized-products',
    categoryRu: 'Специализированные продукты',
    categoryEn: 'Specialized products',
    shortDescriptionRu: 'Специализированный продукт из документа, описанный как агонист ГПП-1/ГИП для контроля аппетита.',
    intakeInstructionRu: 'В документе указан пример: 1 инъекция 2,5 мг в неделю, с возможным повышением до 5 мг при переносимости.',
    courseRu: 'До 6 месяцев с перерывом минимум 3 месяца.',
    source: 'b17'
  },
  {
    id: 'slu-pp-332',
    nameRu: 'SLU-PP-332',
    nameEn: 'SLU-PP-332',
    category: 'specialized-products',
    categoryRu: 'Специализированные продукты',
    categoryEn: 'Specialized products',
    shortDescriptionRu: 'Специализированный продукт из документа для метаболической поддержки и рекомпозиции.',
    intakeInstructionRu: '1-2 капсулы на пустой желудок за полчаса до еды дважды в день ежедневно.',
    courseRu: '8-10 недель, затем перерыв 2-4 недели.',
    source: 'b17'
  },
  {
    id: 'bpc-157',
    nameRu: 'BPC 157',
    nameEn: 'BPC 157',
    category: 'specialized-products',
    categoryRu: 'Специализированные продукты',
    categoryEn: 'Specialized products',
    shortDescriptionRu: 'Пептидный продукт из документа, описанный для восстановления тканей.',
    intakeInstructionRu: 'В документе указан пример: 2 раза в день утром и вечером по 250-500 мкг подкожно.',
    courseRu: '6-12 недель, затем отдых длительностью как курс.',
    source: 'b17'
  },
  {
    id: 'glutathione-h',
    nameRu: 'Глутатион',
    nameEn: 'Glutathione-H',
    category: 'antioxidants',
    categoryRu: 'Антиоксиданты',
    categoryEn: 'Antioxidants',
    shortDescriptionRu: 'Антиоксидантный продукт из документа для поддержки печени, кожи и anti-age направления.',
    intakeInstructionRu: 'В документе описан формат: 1 ампула = 1 укол.',
    source: 'b17'
  },
  {
    id: 'red-fly-agaric',
    nameRu: 'Красный Мухоморыч',
    nameEn: 'Red fly agaric',
    category: 'botanicals',
    categoryRu: 'Растительные экстракты',
    categoryEn: 'Botanical extracts',
    shortDescriptionRu: 'Продукт из документа для эмоциональных перегрузок, сна и креативности.',
    intakeInstructionRu: '1 капсула утром и 1 капсула вечером; в документе указано начинать с пробной капсулы 200 мг.',
    courseRu: '1-2 месяца, затем месяц перерыв.',
    compatibilityNoteRu: 'В документе отмечена связка с ашвагандой и ежовиком.',
    source: 'b17'
  },
  {
    id: 'cordyceps',
    nameRu: 'Кордицепс',
    nameEn: 'Cordyceps',
    category: 'mushrooms',
    categoryRu: 'Грибы и адаптогены',
    categoryEn: 'Mushrooms and adaptogens',
    shortDescriptionRu: 'Лечебный гриб из документа для тонуса, иммунитета и общего самочувствия.',
    intakeInstructionRu: 'Утром и вечером по 1 капсуле.',
    courseRu: 'Можно принимать курсом 1-2 месяца либо при необходимости.',
    source: 'b17'
  },
  {
    id: 'panther-amanita',
    nameRu: 'Пантерный мухомор',
    nameEn: 'Panther amanita',
    category: 'botanicals',
    categoryRu: 'Растительные экстракты',
    categoryEn: 'Botanical extracts',
    shortDescriptionRu: 'Продукт из документа, описанный как более сильный вариант мухомора.',
    intakeInstructionRu: 'По одной капсуле на голодный желудок за 1-2 часа до еды.',
    courseRu: '1-2 месяца.',
    compatibilityNoteRu: 'В документе указано не совмещать с Красным Мухоморычем.',
    source: 'b17'
  },
  {
    id: 'cetraria',
    nameRu: 'Цетрария',
    nameEn: 'Cetraria',
    category: 'botanicals',
    categoryRu: 'Растительные экстракты',
    categoryEn: 'Botanical extracts',
    shortDescriptionRu: 'Исландский мох из документа с растительной слизью, усниновой кислотой и микроэлементами.',
    intakeInstructionRu: '1 капсула утром и вечером перед едой.',
    source: 'b17'
  },
  {
    id: 'serrapeptase-nattokinase',
    nameRu: 'Серрапептаза + наттокиназа',
    nameEn: 'Serrapeptase + nattokinase',
    category: 'enzymes',
    categoryRu: 'Ферменты',
    categoryEn: 'Enzymes',
    shortDescriptionRu: 'Ферментный продукт из документа с серрапептазой и наттокиназой.',
    intakeInstructionRu: '1 капсула утром на голодный желудок минимум за 1 час до еды.',
    courseRu: 'В документе указано, что можно принимать на постоянной основе.',
    source: 'b17'
  },
  {
    id: 'alpha-gpc',
    nameRu: 'Альфа GPC',
    nameEn: 'Alpha GPC',
    category: 'nootropics',
    categoryRu: 'Когнитивная поддержка',
    categoryEn: 'Cognitive support',
    shortDescriptionRu: 'Прекурсор ацетилхолина из документа для памяти, фокуса и скорости реакции.',
    intakeInstructionRu: 'По 1 капсуле утром и в обед.',
    courseRu: '1 месяц приём, затем 1 месяц перерыв.',
    compatibilityNoteRu: 'В документе отмечено потреблять больше животных жиров во время приёма.',
    source: 'b17'
  },
  {
    id: 'salvus',
    nameRu: 'Salvus',
    nameEn: 'Salvus',
    category: 'digestive-support',
    categoryRu: 'ЖКТ и пищеварение',
    categoryEn: 'Digestive support',
    shortDescriptionRu: 'Комплекс из документа для поддержки слизистой оболочки кишечника и микробиоты.',
    intakeInstructionRu: '1 капсула 2-3 раза в день с приёмом пищи.',
    courseRu: 'Можно принимать курсом или на постоянной основе.',
    source: 'b17'
  },
  {
    id: 'ashwagandha',
    nameRu: 'Ашваганда',
    nameEn: 'Ashwagandha',
    category: 'adaptogens',
    categoryRu: 'Адаптогены',
    categoryEn: 'Adaptogens',
    shortDescriptionRu: 'Адаптоген из документа для нервной системы, стресса и сна.',
    intakeInstructionRu: 'По 1 капсуле вечером.',
    courseRu: 'В документе указано, что можно принимать на постоянной основе без перерывов.',
    source: 'b17'
  },
  {
    id: 'methylene-blue',
    nameRu: 'Метиленовый синий',
    nameEn: 'Methylene blue',
    category: 'nootropics',
    categoryRu: 'Когнитивная поддержка',
    categoryEn: 'Cognitive support',
    shortDescriptionRu: 'Ноотропный продукт из документа с иммуномодулирующими и антиоксидантными свойствами.',
    intakeInstructionRu: '1-2 капсулы утром на голодный желудок минимум за час до еды.',
    courseRu: 'От 2 до 16 недель, перерыв 4 недели.',
    source: 'b17'
  },
  {
    id: 'multi-vitamins',
    nameRu: 'Мульти витамины',
    nameEn: 'Multi vitamins',
    category: 'vitamins',
    categoryRu: 'Витамины',
    categoryEn: 'Vitamins',
    shortDescriptionRu: 'Комплекс из документа с активными формами витаминов, хелатированными минералами и базовыми добавками.',
    intakeInstructionRu: '1 капсула утром после приёма пищи.',
    courseRu: 'Можно принимать на постоянной основе или курсом 1-2 месяца.',
    source: 'b17'
  },
  {
    id: 'choline-inositol',
    nameRu: 'Холин-инозитол',
    nameEn: 'Choline-inositol',
    category: 'vitamins',
    categoryRu: 'Витамины',
    categoryEn: 'Vitamins',
    shortDescriptionRu: 'Синергия холина и инозитола из документа для метаболизма, настроения и фертильности.',
    intakeInstructionRu: '2-4 капсулы вечером.',
    courseRu: '1 месяц, после перерыва можно повторить курс.',
    source: 'b17'
  },
  {
    id: 'astragalus',
    nameRu: 'Астрагалус',
    nameEn: 'Astragalus',
    category: 'adaptogens',
    categoryRu: 'Адаптогены',
    categoryEn: 'Adaptogens',
    shortDescriptionRu: 'Экстракт астрагала из документа как адаптоген китайской медицины.',
    intakeInstructionRu: '2-3 капсулы днём с приёмом пищи.',
    courseRu: 'Можно принимать курсом или на постоянной основе.',
    source: 'b17'
  },
  {
    id: 'vitamin-d',
    nameRu: 'Витамин D',
    nameEn: 'Vitamin D',
    category: 'vitamins',
    categoryRu: 'Витамины',
    categoryEn: 'Vitamins',
    shortDescriptionRu: 'Витамин D из документа для пользователей, которые не живут в жарких странах.',
    intakeInstructionRu: '1000 единиц на 10 кг веса.',
    source: 'b17'
  },
  {
    id: 'lysine',
    nameRu: 'Лизин',
    nameEn: 'L-lysine',
    category: 'amino-acids',
    categoryRu: 'Аминокислоты',
    categoryEn: 'Amino acids',
    shortDescriptionRu: 'Условно незаменимая аминокислота из документа для коллагена, иммунной системы и азотистого баланса.',
    intakeInstructionRu: '1 капсула утром и 1 капсула перед сном на голодный желудок.',
    courseRu: 'Можно принимать курсом или круглогодично.',
    source: 'b17'
  },
  {
    id: 'silica',
    nameRu: 'Кремний',
    nameEn: 'Silica',
    category: 'minerals',
    categoryRu: 'Минералы',
    categoryEn: 'Minerals',
    shortDescriptionRu: 'Кремний из документа для соединительной ткани, кожи, волос, ногтей и костной системы.',
    intakeInstructionRu: '1 капсула 2-3 раза в день с едой.',
    courseRu: 'Принимается на постоянной основе, перерывов не требуется; можно также принимать курсом.',
    source: 'b17'
  },
  {
    id: 'glycine',
    nameRu: 'Глицин',
    nameEn: 'Glycine',
    category: 'amino-acids',
    categoryRu: 'Аминокислоты',
    categoryEn: 'Amino acids',
    shortDescriptionRu: 'Аминокислота из документа для нервной системы, когнитивной функции и восстановления.',
    intakeInstructionRu: '1 мерная ложка (3 г) 1-2 раза в день, растворив в воде или соке.',
    source: 'b17'
  },
  {
    id: 'tmg-trimethylglycine',
    nameRu: 'Триметилглицин',
    nameEn: 'TMG trimethylglycine',
    category: 'methylation-support',
    categoryRu: 'Метилирование',
    categoryEn: 'Methylation support',
    shortDescriptionRu: 'TMG из документа для метилирования, гомоцистеина, печени и метаболизма.',
    intakeInstructionRu: '3000 мг в день, в любое время.',
    courseRu: 'Можно принимать курсом или круглогодично.',
    source: 'b17'
  },
  {
    id: 'pussy-boy-antidote',
    nameRu: 'Пусси Бой Антидот',
    nameEn: 'Pussy Boy Antidote',
    category: 'specialized-products',
    categoryRu: 'Специализированные продукты',
    categoryEn: 'Specialized products',
    shortDescriptionRu: 'Комплексная добавка из документа для хронической усталости, стресса и умственной производительности.',
    intakeInstructionRu: 'Дважды в день по 1 капсуле с приёмом пищи.',
    courseRu: 'Можно принимать круглогодично.',
    source: 'b17'
  },
  {
    id: 'black-seed-oil',
    nameRu: 'Масло чёрного тмина',
    nameEn: 'Black seed oil',
    category: 'oils',
    categoryRu: 'Масла',
    categoryEn: 'Oils',
    shortDescriptionRu: 'Масло чёрного тмина из документа для защитных функций организма и общего состояния.',
    intakeInstructionRu: 'По 2 капсулы 2 раза в день.',
    courseRu: 'Курс приёма 1 месяц, затем перерыв.',
    source: 'b17'
  },
  {
    id: 'leucine-methionine',
    nameRu: 'L-лейцин + L-метионин',
    nameEn: 'Leucine + methionine',
    category: 'amino-acids',
    categoryRu: 'Аминокислоты',
    categoryEn: 'Amino acids',
    shortDescriptionRu: 'Незаменимые аминокислоты из документа для восстановления после тренировок и набора мышечной массы.',
    intakeInstructionRu: '3-5 капсул 2-3 раза в день.',
    source: 'b17'
  },
  {
    id: 'creatine',
    nameRu: 'Креатин',
    nameEn: 'Creatine',
    category: 'sports-nutrition',
    categoryRu: 'Спортивное питание',
    categoryEn: 'Sports nutrition',
    shortDescriptionRu: 'Креатин из документа как базовая добавка для силы, мощности и когнитивной функции.',
    source: 'b17'
  }
];

const documentSupplementProducts = documentedSupplementSeeds.map(createDocumentSupplementProduct);

export const supplementsCatalog: SupplementProduct[] = [
  {
    id: 'vitamin-d3-k2',
    type: 'supplement',
    nameRu: 'Витамин D3 + K2',
    nameEn: 'Vitamin D3 + K2',
    category: 'vitamins',
    categoryRu: 'Витамины',
    categoryEn: 'Vitamins',
    shortDescriptionRu: 'Витамины K2 и D3 из документа EVALITE для обменных процессов, кожи, волос и ногтей.',
    shortDescriptionEn: 'Vitamins K2 and D3 from the EVALITE document for metabolic processes, skin, hair, and nails.',
    detailedDescriptionRu: 'В документе указан состав: микрокристаллическая целлюлоза, желатиновая капсула, холекальциферол (витамин D3) и менахинон-7 (витамин K2).',
    detailedDescriptionEn: 'The document lists microcrystalline cellulose, gelatin capsule, cholecalciferol (vitamin D3), and menaquinone-7 (vitamin K2).',
    defaultDosageRu: '1 капсула',
    defaultDosageEn: '1 capsule',
    timingRu: 'Утро',
    timingEn: 'Morning',
    intakeInstructionRu: 'Во время завтрака, запивая водой.',
    intakeInstructionEn: 'During breakfast, with water.',
    courseRu: '8 недель, затем повторный анализ',
    courseEn: '8 weeks, then retest',
    compatibilityNoteRu: 'Принимать с едой; персонализация должна опираться на анализы.',
    compatibilityNoteEn: 'Take with food; personalization should use labs.',
    safetyNoteRu: supplementSafetyNoteRu,
    safetyNoteEn: supplementSafetyNoteEn,
    productUrl: 'https://evalite.ru/',
    sourceName: 'evalite.ru',
    manufacturer: 'EVALITE',
    image: productImages.supplement
  },
  {
    id: 'omega-3',
    type: 'supplement',
    nameRu: 'Омега-3 (EPA/DHA)',
    nameEn: 'Omega-3 (EPA/DHA)',
    category: 'fatty-acids',
    categoryRu: 'Жирные кислоты',
    categoryEn: 'Fatty acids',
    shortDescriptionRu: 'Высококонцентрированный рыбий жир из документа AM BOOST с ЭПК и ДГК.',
    shortDescriptionEn: 'High-concentration fish oil from the AM BOOST document with EPA and DHA.',
    detailedDescriptionRu: 'В документе омега-3 описана как поддержка сердца, мозга, зрения, суставов, нервной системы и эмоционального фона; указаны ЭПК 600 мг и ДГК 240 мг.',
    detailedDescriptionEn: 'The document describes omega-3 as support for heart, brain, vision, joints, nervous system, and emotional balance, with EPA 600 mg and DHA 240 mg listed.',
    defaultDosageRu: '1 капсула',
    defaultDosageEn: '1 capsule',
    timingRu: 'Утро',
    timingEn: 'Morning',
    intakeInstructionRu: 'Во время завтрака, запивая водой.',
    intakeInstructionEn: 'During breakfast, with water.',
    courseRu: '8-12 недель, затем переоценка',
    courseEn: '8-12 weeks, then reassess',
    compatibilityNoteRu: 'Лучше принимать с едой, содержащей жир.',
    compatibilityNoteEn: 'Best with a meal containing fat.',
    safetyNoteRu: supplementSafetyNoteRu,
    safetyNoteEn: supplementSafetyNoteEn,
    productUrl: 'https://forbase.shop/',
    sourceName: 'forbase.shop',
    manufacturer: 'AM BOOST',
    image: productImages.supplement
  },
  {
    id: 'royal-jelly',
    type: 'beeProduct',
    nameRu: 'Маточное молочко',
    nameEn: 'Royal Jelly',
    category: 'bee-products',
    categoryRu: 'Пчелопродукты',
    categoryEn: 'Bee products',
    shortDescriptionRu: 'Может поддерживать тонус и мотивацию при высокой когнитивной нагрузке.',
    shortDescriptionEn: 'May support vitality and motivation under high cognitive load.',
    detailedDescriptionRu: 'Питательный секрет рабочих пчел. В документации позиционируется как натуральный инструмент поддержки тонуса, когнитивной функции и адаптации к стрессу.',
    detailedDescriptionEn: 'Nutrient-dense secretion produced by worker bees. The documentation positions it as a natural support tool for vitality, cognition, and stress adaptation.',
    defaultDosageRu: '1/2 ч. л.',
    defaultDosageEn: '1/2 tsp',
    timingRu: 'Утро',
    timingEn: 'Morning',
    intakeInstructionRu: 'Утром натощак.',
    intakeInstructionEn: 'In the morning, before food.',
    courseRu: '2-4 недели, затем пересмотреть',
    courseEn: '2-4 weeks, then review',
    compatibilityNoteRu: 'Избегайте при аллергии или чувствительности к пчелопродуктам.',
    compatibilityNoteEn: 'Avoid if allergic or sensitive to bee products.',
    safetyNoteRu: beeProductSafetyNoteRu,
    safetyNoteEn: beeProductSafetyNoteEn,
    image: productImages.royalJelly
  },
  {
    id: 'vitamin-c',
    type: 'supplement',
    nameRu: 'Витамин C',
    nameEn: 'Vitamin C',
    category: 'vitamins',
    categoryRu: 'Витамины',
    categoryEn: 'Vitamins',
    shortDescriptionRu: 'Буферизованный витамин C из документа для иммунной системы, кожи, костей и суставов.',
    shortDescriptionEn: 'Buffered vitamin C from the document for immune system, skin, bones, and joints.',
    detailedDescriptionRu: 'В документе ASCORBATE-C описан как аскорбат кальция, который не влияет на кислотность желудка и участвует в выработке коллагена.',
    detailedDescriptionEn: 'The document describes ASCORBATE-C as calcium ascorbate that does not affect stomach acidity and participates in collagen production.',
    defaultDosageRu: '1 капсула',
    defaultDosageEn: '1 capsule',
    timingRu: 'Днем',
    timingEn: 'Day',
    intakeInstructionRu: 'Во время или после обеда.',
    intakeInstructionEn: 'During or after lunch.',
    courseRu: 'В документе указано: 3 капсулы после завтрака.',
    courseEn: 'The document lists: 3 capsules after breakfast.',
    safetyNoteRu: supplementSafetyNoteRu,
    safetyNoteEn: supplementSafetyNoteEn,
    productUrl: 'https://www.hivital.com/en/products/?add-to-cart=87629&quantity=1',
    sourceName: 'hivital.com',
    manufacturer: 'HIVITAL',
    image: productImages.supplement
  },
  {
    id: 'bee-pollen',
    type: 'beeProduct',
    nameRu: 'Пчелиная пыльца',
    nameEn: 'Bee Pollen',
    category: 'bee-products',
    categoryRu: 'Пчелопродукты',
    categoryEn: 'Bee products',
    shortDescriptionRu: 'Питательный продукт для пользователей, которые хорошо переносят пчелопродукты.',
    shortDescriptionEn: 'Supportive nutrient-dense food for users who tolerate bee products.',
    detailedDescriptionRu: 'Цветочная пыльца, собранная пчелами. В документации описана как источник аминокислот, микронутриентов и биологически активных соединений.',
    detailedDescriptionEn: 'Flower pollen collected by bees. The documentation describes it as rich in amino acids, micronutrients, and biologically active compounds.',
    defaultDosageRu: '1/2 ч. л.',
    defaultDosageEn: '1/2 tsp',
    timingRu: 'Днем',
    timingEn: 'Day',
    intakeInstructionRu: 'После еды.',
    intakeInstructionEn: 'After food.',
    courseRu: '2 недели, затем оценить переносимость',
    courseEn: '2 weeks, then review tolerance',
    compatibilityNoteRu: 'Избегайте при аллергии на пыльцу; начинайте с малого количества и прекращайте при чувствительности.',
    compatibilityNoteEn: 'Avoid with pollen allergy; start small and stop if sensitivity appears.',
    safetyNoteRu: beeProductSafetyNoteRu,
    safetyNoteEn: beeProductSafetyNoteEn,
    image: productImages.pollen
  },
  {
    id: 'honey',
    type: 'beeProduct',
    nameRu: 'Мёд',
    nameEn: 'Honey',
    category: 'bee-products',
    categoryRu: 'Пчелопродукты',
    categoryEn: 'Bee products',
    shortDescriptionRu: 'Демо-поддержка утренней энергии и регулярности рутины.',
    shortDescriptionEn: 'Demo support for morning energy and routine consistency.',
    detailedDescriptionRu: 'Натуральный источник углеводов, ферментов, антиоксидантов и биоактивных соединений. В документации отмечен как поддержка быстрой энергии и восстановления.',
    detailedDescriptionEn: 'Natural source of carbohydrates, enzymes, antioxidants, and bioactive compounds. The documentation notes quick energy and recovery support.',
    defaultDosageRu: '1 ч. л.',
    defaultDosageEn: '1 tsp',
    timingRu: 'Днем',
    timingEn: 'Day',
    intakeInstructionRu: 'В первой половине дня.',
    intakeInstructionEn: 'In the first half of the day.',
    courseRu: 'Использовать только при переносимости, затем пересмотреть',
    courseEn: 'Use only when tolerated, then review',
    compatibilityNoteRu: 'Избегайте при аллергии или чувствительности к пчелопродуктам; отслеживайте переносимость.',
    compatibilityNoteEn: 'Avoid if allergic or sensitive to bee products; monitor personal tolerance.',
    safetyNoteRu: beeProductSafetyNoteRu,
    safetyNoteEn: beeProductSafetyNoteEn,
    image: productImages.honey
  },
  {
    id: 'perga-honey',
    type: 'beeProduct',
    nameRu: 'Перга с мёдом',
    nameEn: 'Perga with honey',
    category: 'bee-products',
    categoryRu: 'Пчелопродукты',
    categoryEn: 'Bee products',
    shortDescriptionRu: 'Соответствует фокусу на энергии, концентрации, восстановлении и продуктивности.',
    shortDescriptionEn: 'Matches the focus on energy, concentration, recovery, and productivity.',
    detailedDescriptionRu: 'Перга описана в документации как ферментированная пчелиная пыльца с повышенной биодоступностью и приоритетный пчелопродукт Health Coach.',
    detailedDescriptionEn: 'Perga is documented as fermented bee pollen with enhanced bioavailability and the primary bee product within Health Coach.',
    defaultDosageRu: '1 ч. л.',
    defaultDosageEn: '1 tsp',
    timingRu: 'Днем',
    timingEn: 'Day',
    intakeInstructionRu: 'С едой или тёплой водой.',
    intakeInstructionEn: 'With food or warm water.',
    compatibilityNoteRu: 'Избегайте при аллергии на пчелопродукты или пыльцу.',
    compatibilityNoteEn: 'Avoid if allergic to bee products or pollen.',
    safetyNoteRu: beeProductSafetyNoteRu,
    safetyNoteEn: beeProductSafetyNoteEn,
    image: productImages.pergaHoney
  },
  {
    id: 'magnesium-citrate',
    type: 'supplement',
    nameRu: 'Магний (цитрат)',
    nameEn: 'Magnesium (citrate)',
    category: 'minerals',
    categoryRu: 'Минералы',
    categoryEn: 'Minerals',
    shortDescriptionRu: 'Цитрат магния с витамином B6 из документа EVALITE для мышечного напряжения и мягкой поддержки при ПМС.',
    shortDescriptionEn: 'Magnesium citrate with vitamin B6 from the EVALITE document for muscle tension and soft PMS support.',
    detailedDescriptionRu: 'В документе указан состав: цитрат магния, пиридоксина гидрохлорид (витамин B6), микрокристаллическая целлюлоза и желатиновая капсула.',
    detailedDescriptionEn: 'The document lists magnesium citrate, pyridoxine hydrochloride (vitamin B6), microcrystalline cellulose, and gelatin capsule.',
    defaultDosageRu: '1 капсула',
    defaultDosageEn: '1 capsule',
    timingRu: 'Вечер',
    timingEn: 'Evening',
    intakeInstructionRu: 'За 1-2 часа до сна.',
    intakeInstructionEn: '1-2 hours before sleep.',
    courseRu: '4-8 недель, затем обзор',
    courseEn: '4-8 weeks, then review',
    compatibilityNoteRu: 'Можно сочетать с Omega-3. Разносите с высокими дозами цинка при чувствительности желудка.',
    compatibilityNoteEn: 'Can pair with omega-3. Separate from high-dose zinc if stomach sensitivity appears.',
    safetyNoteRu: supplementSafetyNoteRu,
    safetyNoteEn: supplementSafetyNoteEn,
    productUrl: 'https://evalite.ru/',
    sourceName: 'evalite.ru',
    manufacturer: 'EVALITE',
    image: productImages.supplement
  },
  {
    id: 'zinc-picolinate',
    type: 'supplement',
    nameRu: 'Цинк (пиколинат)',
    nameEn: 'Zinc (picolinate)',
    category: 'minerals',
    categoryRu: 'Минералы',
    categoryEn: 'Minerals',
    shortDescriptionRu: 'Минеральная добавка из текущей вечерней схемы приема.',
    shortDescriptionEn: 'Mineral supplement from the current evening intake schedule.',
    defaultDosageRu: '1 капсула',
    defaultDosageEn: '1 capsule',
    timingRu: 'Вечер',
    timingEn: 'Evening',
    intakeInstructionRu: 'После ужина или перед сном.',
    intakeInstructionEn: 'After dinner or before sleep.',
    compatibilityNoteRu: 'Разносите с высокими дозами магния при чувствительности желудка.',
    compatibilityNoteEn: 'Separate from high-dose magnesium if stomach sensitivity appears.',
    safetyNoteRu: supplementSafetyNoteRu,
    safetyNoteEn: supplementSafetyNoteEn,
    productUrl: 'https://forbase.shop/',
    sourceName: 'forbase.shop',
    manufacturer: 'AM BOOST',
    image: productImages.supplement
  },
  ...documentSupplementProducts
];

export const recommendedSupplementProductIds = [
  'vitamin-d3-k2',
  'omega-3',
  'royal-jelly',
  'vitamin-c',
  'bee-pollen',
  'honey',
  'perga-honey',
  'magnesium-citrate',
  'zinc-picolinate'
] as const;

export const recommendedSupplementProducts = recommendedSupplementProductIds
  .map((id) => supplementsCatalog.find((product) => product.id === id))
  .filter((product): product is SupplementProduct => Boolean(product));
