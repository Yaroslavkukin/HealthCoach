import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';

const takeAnalysesHeaderIllustration = require('../assets/images/take-analyses-header-illustration.png');
const takeAnalysesIntroCard = require('../assets/images/take-analyses-intro-card.png');

type AnalysisPackageGender = 'male' | 'female';
type AnalysisPackageTier = 'foundation' | 'advanced' | 'complete';

type AnalysisPackage = {
  code: string;
  gender: AnalysisPackageGender;
  tier: AnalysisPackageTier;
  name: string;
  badge: string;
  purpose: string;
  recommendedFor: string[];
  markers: string[];
};

const maleFoundationMarkers = [
  'Тестостерон',
  'Свободный тестостерон',
  'ДГТ',
  'ГСПГ',
  'Эстрадиол',
  'Пролактин',
  'Кортизол',
  'ТТГ',
  'ЛГ',
  'ФСГ',
  'HbA1c',
  'ПСА общий и свободный'
];

const maleAdvancedMarkers = [
  ...maleFoundationMarkers,
  'Гормон роста',
  'Гомоцистеин',
  'Инсулин',
  'Лептин',
  'Витамин D',
  'Витамин B12',
  'Т3 свободный',
  'Т4 свободный',
  'ДГЭА-S',
  'C-пептид',
  'Общий анализ крови'
];

const femaleFoundationMarkers = [
  'Общий анализ крови',
  'ТТГ',
  'Т3 свободный',
  'Т4 свободный',
  'Тестостерон',
  'Свободный тестостерон',
  'ДГТ',
  'Эстрадиол',
  'Прогестерон',
  'Пролактин',
  'Кортизол',
  'Гормон роста',
  'ГСПГ',
  'Инсулин',
  'Лептин',
  'ЛГ',
  'ФСГ',
  'HbA1c',
  'Витамин D'
];

const ANALYSIS_PACKAGES: AnalysisPackage[] = [
  {
    code: 'male-foundation',
    gender: 'male',
    tier: 'foundation',
    name: 'Базовый',
    badge: 'Старт',
    purpose: 'Первичная оценка гормонов, метаболизма и энергии.',
    recommendedFor: ['Первый вход', 'Энергия', 'Гормональный баланс', 'Продуктивность'],
    markers: maleFoundationMarkers
  },
  {
    code: 'male-advanced',
    gender: 'male',
    tier: 'advanced',
    name: 'Продвинутый',
    badge: 'Оптимальный',
    purpose: 'Расширенная оценка гормонов, щитовидной системы, метаболизма и нутриентов.',
    recommendedFor: ['Устойчивая усталость', 'Туман в голове', 'Низкая мотивация', 'Слабое восстановление'],
    markers: maleAdvancedMarkers
  },
  {
    code: 'male-complete',
    gender: 'male',
    tier: 'complete',
    name: 'Абсолютный',
    badge: 'Максимум',
    purpose: 'Максимальная биологическая оптимизация и глубокий контроль динамики.',
    recommendedFor: ['Полная оптимизация', 'Высокая нагрузка', 'Биохакинг', 'Долгосрочное отслеживание'],
    markers: [
      ...maleAdvancedMarkers,
      'IGF-1',
      'Аминокислотный профиль',
      'Ацилкарнитины',
      'Минеральный профиль',
      'Жирорастворимые витамины A, D, E, K',
      'Ферритин',
      'Оксидативный стресс',
      'CRP',
      'Липидный профиль',
      'Печёночные маркеры',
      'Почечные маркеры',
      'Онкомаркеры',
      'ECP',
      'Фибриноген',
      'LDH'
    ]
  },
  {
    code: 'female-foundation',
    gender: 'female',
    tier: 'foundation',
    name: 'Базовый',
    badge: 'Старт',
    purpose: 'Первичная оценка гормонального баланса, метаболизма, энергии и нутриентов.',
    recommendedFor: ['Первый вход', 'Энергия', 'Гормональный баланс', 'Эмоциональное состояние'],
    markers: femaleFoundationMarkers
  },
  {
    code: 'female-complete',
    gender: 'female',
    tier: 'complete',
    name: 'Предельный',
    badge: 'Максимум',
    purpose: 'Комплексная оценка гормонального, нутритивного, воспалительного и метаболического статуса.',
    recommendedFor: ['Глубокая оптимизация', 'Устойчивая усталость', 'Гормональные вопросы', 'Долгосрочное отслеживание'],
    markers: [
      ...femaleFoundationMarkers,
      'Гомоцистеин',
      'ДГЭА-S',
      'Витамин B12',
      'Ферритин',
      'Железо / ОЖСС / трансферрин',
      'Билирубин',
      'АЛТ',
      'АСТ',
      'Мочевина',
      'Мочевая кислота',
      'ЛПНП',
      'ЛПВП',
      'Фибриноген',
      'Тиреоглобулин',
      'Т3 общий',
      'Т4 общий',
      'Витамины группы B',
      'Аминокислотный профиль',
      'Ацилкарнитины',
      'ECP',
      'LDH'
    ]
  }
];

const preparationItems = [
  'Не делайте интенсивные тренировки накануне',
  'Избегайте эмоциональной перегрузки',
  'Не переедайте вечером перед анализами',
  'Постарайтесь хорошо выспаться',
  'Для динамики сдавайте анализы примерно в одно и то же время суток',
  'Следуйте инструкциям лаборатории и врача'
];

export default function TakeAnalysesScreen() {
  const [selectedGender, setSelectedGender] = useState<AnalysisPackageGender>('male');
  const [expandedPackages, setExpandedPackages] = useState<Record<string, boolean>>({});
  const visiblePackages = ANALYSIS_PACKAGES.filter((analysisPackage) => analysisPackage.gender === selectedGender);

  const togglePackageMarkers = (packageCode: string) => {
    setExpandedPackages((currentState) => ({
      ...currentState,
      [packageCode]: !currentState[packageCode]
    }));
  };

  return (
    <SafeAreaView style={styles.screenRoot}>
      <TakeAnalysesHeader />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <IntroCard />
        <GenderSelector selectedGender={selectedGender} onSelect={setSelectedGender} />

        <View style={styles.packageList}>
          {visiblePackages.map((analysisPackage) => (
            <AnalysisPackageCard
              key={analysisPackage.code}
              analysisPackage={analysisPackage}
              expanded={Boolean(expandedPackages[analysisPackage.code])}
              onToggleMarkers={() => togglePackageMarkers(analysisPackage.code)}
            />
          ))}
        </View>

        <PreparationGuide />
        <SafetyNote />
      </ScrollView>
    </SafeAreaView>
  );
}

function TakeAnalysesHeader() {
  return (
    <View style={styles.headerCard}>
      <View pointerEvents="none" style={styles.headerWave} />
      <View pointerEvents="none" style={styles.headerWaveSoft} />
      <View pointerEvents="none" style={styles.headerIllustrationWrapper}>
        <Image
          source={takeAnalysesHeaderIllustration}
          resizeMode="contain"
          style={styles.headerIllustration}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Назад"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.headerAction, pressed && styles.pressed]}
      >
        <Ionicons name="chevron-back" size={25} color={colors.textOnPrimary} />
      </Pressable>

      <View style={styles.headerText}>
        <AppText numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78} style={styles.headerTitle}>
          Сдать анализы
        </AppText>
        <AppText numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.84} style={styles.headerSubtitle}>
          Узнайте больше о своём здоровье на основе точных данных
        </AppText>
      </View>

      <View style={styles.headerActionSpacer} />
    </View>
  );
}

function IntroCard() {
  return (
    <View style={styles.introCardFrame}>
      <Image source={takeAnalysesIntroCard} resizeMode="contain" style={styles.introCardImage} />
    </View>
  );
}

function GenderSelector({
  selectedGender,
  onSelect
}: {
  selectedGender: AnalysisPackageGender;
  onSelect: (gender: AnalysisPackageGender) => void;
}) {
  return (
    <View style={styles.genderSelector}>
      <GenderOption
        label="Мужчины"
        icon="male-outline"
        selected={selectedGender === 'male'}
        onPress={() => onSelect('male')}
      />
      <GenderOption
        label="Женщины"
        icon="female-outline"
        selected={selectedGender === 'female'}
        onPress={() => onSelect('female')}
      />
    </View>
  );
}

function GenderOption({
  label,
  icon,
  selected,
  onPress
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.genderOption, selected && styles.genderOptionSelected, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={18} color={selected ? colors.textOnPrimary : colors.primary} />
      <AppText style={[styles.genderOptionText, selected && styles.genderOptionTextSelected]}>{label}</AppText>
    </Pressable>
  );
}

function AnalysisPackageCard({
  analysisPackage,
  expanded,
  onToggleMarkers
}: {
  analysisPackage: AnalysisPackage;
  expanded: boolean;
  onToggleMarkers: () => void;
}) {
  const visibleMarkers = expanded ? analysisPackage.markers : analysisPackage.markers.slice(0, 6);

  return (
    <View style={styles.packageCard}>
      <View style={styles.packageHeader}>
        <View style={styles.packageTitleBlock}>
          <View style={styles.packageBadge}>
            <AppText style={styles.packageBadgeText}>{analysisPackage.badge}</AppText>
          </View>
          <AppText style={styles.packageName}>{analysisPackage.name}</AppText>
        </View>
        <View style={styles.markerCountBadge}>
          <Ionicons name="list-outline" size={14} color={colors.primary} />
          <AppText style={styles.markerCountText}>{analysisPackage.markers.length} показателей</AppText>
        </View>
      </View>

      <AppText style={styles.packagePurpose}>{analysisPackage.purpose}</AppText>

      <View style={styles.recommendedBlock}>
        <AppText style={styles.blockLabel}>Кому подходит</AppText>
        <View style={styles.chipWrap}>
          {analysisPackage.recommendedFor.map((item) => (
            <View key={`${analysisPackage.code}-${item}`} style={styles.recommendedChip}>
              <AppText style={styles.recommendedChipText}>{item}</AppText>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.markersBlock}>
        <AppText style={styles.blockLabel}>Маркеры</AppText>
        <View style={styles.markerList}>
          {visibleMarkers.map((marker) => (
            <View key={`${analysisPackage.code}-${marker}`} style={styles.markerRow}>
              <View style={styles.markerDot} />
              <AppText style={styles.markerText}>{marker}</AppText>
            </View>
          ))}
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onToggleMarkers}
        style={({ pressed }) => [styles.markerToggle, pressed && styles.pressed]}
      >
        <AppText style={styles.markerToggleText}>{expanded ? 'Скрыть маркеры' : 'Показать все маркеры'}</AppText>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={17} color={colors.primary} />
      </Pressable>

      <View style={styles.packageActions}>
        <Pressable
          accessibilityRole="button"
          onPress={showPreparationHint}
          style={({ pressed }) => [styles.prepareButton, pressed && styles.pressed]}
        >
          <AppText style={styles.prepareButtonText}>Как подготовиться</AppText>
        </Pressable>
      </View>
    </View>
  );
}

function PreparationGuide() {
  return (
    <View style={styles.guideCard}>
      <View style={styles.guideHeader}>
        <Ionicons name="leaf-outline" size={20} color={colors.accent} />
        <AppText style={styles.guideTitle}>Как подготовиться к сдаче</AppText>
      </View>
      <View style={styles.guideList}>
        {preparationItems.map((item) => (
          <View key={item} style={styles.guideItem}>
            <Ionicons name="checkmark-circle-outline" size={17} color={colors.success} />
            <AppText style={styles.guideText}>{item}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

function SafetyNote() {
  return (
    <View style={styles.safetyCard}>
      <Ionicons name="information-circle-outline" size={18} color={colors.accent} />
      <AppText style={styles.safetyText}>
        Пакеты носят информационный характер и не заменяют рекомендации врача. Условия подготовки и состав анализов могут
        отличаться в зависимости от лаборатории и состояния здоровья.
      </AppText>
    </View>
  );
}

function showPreparationHint() {
  Alert.alert('Как подготовиться', 'Памятка по подготовке находится ниже на этой странице.');
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: colors.background
  },
  headerCard: {
    minHeight: 82,
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingLeft: 22,
    paddingRight: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowOpacity: 0,
    elevation: 0
  },
  headerWave: {
    position: 'absolute',
    width: 150,
    height: 52,
    borderRadius: 75,
    right: -30,
    bottom: -18,
    backgroundColor: '#E5ECD8',
    opacity: 0.68,
    transform: [{ rotate: '-6deg' }],
    zIndex: 0
  },
  headerWaveSoft: {
    position: 'absolute',
    width: 98,
    height: 36,
    borderRadius: 49,
    right: 26,
    bottom: -12,
    backgroundColor: '#D5E2C5',
    opacity: 0.28,
    transform: [{ rotate: '10deg' }],
    zIndex: 0
  },
  headerIllustrationWrapper: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 124,
    height: 76,
    opacity: 0.86,
    zIndex: 0
  },
  headerIllustration: {
    width: '100%',
    height: '100%'
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1
  },
  pressed: {
    opacity: 0.78
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    marginLeft: 14,
    marginRight: 78,
    zIndex: 1
  },
  headerTitle: {
    color: colors.primary,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900'
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  headerActionSpacer: {
    width: 40,
    height: 40,
    zIndex: 1
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120
  },
  introCardFrame: {
    width: '94%',
    height: 140,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  introCardImage: {
    width: '100%',
    height: '100%',
    maxWidth: '100%'
  },
  genderSelector: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: 5,
    marginTop: 14,
    flexDirection: 'row',
    gap: 6
  },
  genderOption: {
    flex: 1,
    borderRadius: 15,
    paddingVertical: 11,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7
  },
  genderOptionSelected: {
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.primary
  },
  genderOptionText: {
    color: colors.primary,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900'
  },
  genderOptionTextSelected: {
    color: colors.textOnPrimary
  },
  packageList: {
    gap: 14,
    marginTop: 14
  },
  packageCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    padding: 16,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12
  },
  packageTitleBlock: {
    flex: 1,
    minWidth: 0
  },
  packageBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginBottom: 7
  },
  packageBadgeText: {
    color: colors.primary,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '900'
  },
  packageName: {
    color: colors.primary,
    fontSize: 21,
    lineHeight: 26,
    fontWeight: '900'
  },
  markerCountBadge: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.background,
    paddingHorizontal: 9,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  markerCountText: {
    color: colors.primary,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '900'
  },
  packagePurpose: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10
  },
  recommendedBlock: {
    marginTop: 14
  },
  blockLabel: {
    color: colors.primary,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900'
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8
  },
  recommendedChip: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 132,
    borderRadius: 999,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center'
  },
  recommendedChipText: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '800',
    textAlign: 'center'
  },
  markersBlock: {
    marginTop: 14
  },
  markerList: {
    gap: 8,
    marginTop: 9
  },
  markerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8
  },
  markerDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginTop: 7
  },
  markerText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19
  },
  markerToggle: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },
  markerToggleText: {
    color: colors.primary,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900'
  },
  packageActions: {
    marginTop: 14
  },
  prepareButton: {
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingVertical: 11,
    alignItems: 'center'
  },
  prepareButtonText: {
    color: colors.primary,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900'
  },
  guideCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: 16,
    marginTop: 14
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  guideTitle: {
    color: colors.primary,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900'
  },
  guideList: {
    gap: 9,
    marginTop: 12
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8
  },
  guideText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19
  },
  safetyCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
    padding: 14,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9
  },
  safetyText: {
    flex: 1,
    color: colors.text,
    fontSize: 12,
    lineHeight: 18
  }
});
