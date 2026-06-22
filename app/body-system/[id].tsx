import { router, useLocalSearchParams } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { demoBodySafetyNote, getDemoBodySystemByRouteId, type DemoBodySystem } from '@/data/demoBodyData';
import { colors } from '@/theme/colors';

type SystemDetail = {
  title: string;
  description: string;
};

const systemDetails: Record<string, SystemDetail> = {
  hormones: {
    title: 'Гормональная система',
    description: 'Баланс гормонов, энергия, мотивация и восстановление.'
  },
  thyroid: {
    title: 'Щитовидная система',
    description: 'Обмен веществ, температура, энергия и общий темп организма.'
  },
  metabolism: {
    title: 'Метаболическая система',
    description: 'Глюкоза, инсулин, энергетические провалы и тяга к сладкому.'
  },
  nutrition: {
    title: 'Питательная система',
    description: 'Витамины, минералы, железо и признаки недостаточной поддержки.'
  },
  stress: {
    title: 'Стресс и восстановление',
    description: 'Кортизол, сон, перегрузка, тревожность и восстановление.'
  },
  inflammation: {
    title: 'Воспаление',
    description: 'Системная нагрузка, воспалительные маркеры и восстановление тканей.'
  },
  sleep: {
    title: 'Сон и циркадные ритмы',
    description: 'Качество сна, режим, утренняя свежесть и восстановление.'
  },
  digestion: {
    title: 'Пищеварение',
    description: 'Аппетит, переносимость еды, вздутие и усвоение питательных веществ.'
  }
};

const fallbackDetail: SystemDetail = {
  title: 'Система тела',
  description: 'Связанные показатели, привычки и наблюдения организма.'
};

const placeholderCopy =
  'Здесь Health Coach покажет, какие показатели и привычки влияют на эту систему после загрузки анализов и заполнения профиля.';

type SystemScreenProps = {
  system?: DemoBodySystem;
};

const sleepCircadianHeader = require('../../assets/images/sleep-circadian-header-final.png');
const stressRecoveryHeader = require('../../assets/images/stress-recovery-header.png');
const metabolicSystemHeader = require('../../assets/images/metabolic-system-header.png');
const hormonalSystemHeader = require('../../assets/images/hormonal-system-header.png');
const inflammationSystemHeader = require('../../assets/images/inflammation-system-header.png');
const digestiveSystemHeader = require('../../assets/images/digestive-system-header.png');
const nutritionSystemHeader = require('../../assets/images/nutrition-system-header.png');
const thyroidSystemHeader = require('../../assets/images/thyroid-system-header.png');
const SLEEP_HEADER_HEIGHT = 82;

export default function BodySystemDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const systemId = Array.isArray(id) ? id[0] : id;
  const demoSystem = getDemoBodySystemByRouteId(systemId);
  const headerSystemId = demoSystem?.headerSystemId ?? systemId;
  const detail = demoSystem ?? (systemId ? systemDetails[systemId] ?? fallbackDetail : fallbackDetail);
  const isSleepSystem = headerSystemId === 'sleep';
  const isStressSystem = headerSystemId === 'stress';
  const isMetabolicSystem = headerSystemId === 'metabolism';
  const isHormonalSystem = headerSystemId === 'hormones';
  const isInflammationSystem = headerSystemId === 'inflammation';
  const isDigestiveSystem = headerSystemId === 'digestion';
  const isNutritionSystem = headerSystemId === 'nutrition';
  const isThyroidSystem = headerSystemId === 'thyroid';

  if (isSleepSystem) {
    return <SleepSystemScreen system={demoSystem} />;
  }

  if (isHormonalSystem) {
    return <HormonalSystemScreen system={demoSystem} />;
  }

  if (isStressSystem) {
    return <StressSystemScreen system={demoSystem} />;
  }

  if (isMetabolicSystem) {
    return <MetabolicSystemScreen system={demoSystem} />;
  }

  if (isInflammationSystem) {
    return <InflammationSystemScreen system={demoSystem} />;
  }

  if (isDigestiveSystem) {
    return <DigestiveSystemScreen system={demoSystem} />;
  }

  if (isNutritionSystem) {
    return <NutritionSystemScreen system={demoSystem} />;
  }

  if (isThyroidSystem) {
    return <ThyroidSystemScreen system={demoSystem} />;
  }

  return (
    <ScreenContainer contentStyle={styles.content}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Назад"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textOnPrimary} />
        </Pressable>

        <View style={styles.headerText}>
          <AppText numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.82} style={styles.title}>
            {detail.title}
          </AppText>
          <AppText style={styles.description}>{detail.description}</AppText>
        </View>
      </View>

      <SystemDetailContent system={demoSystem} />
    </ScreenContainer>
  );
}

function ThyroidSystemScreen({ system }: SystemScreenProps) {
  return (
    <SafeAreaView style={styles.screenRoot}>
      <ThyroidSystemHeader />

      <ScrollView style={styles.sleepScrollView} contentContainerStyle={styles.sleepScrollContent} showsVerticalScrollIndicator={false}>
        <SystemDetailContent system={system} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ThyroidSystemHeader() {
  return (
    <View style={styles.sleepHeaderCard}>
      <Image source={thyroidSystemHeader} resizeMode="cover" style={styles.sleepHeaderImage} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Назад"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.thyroidHeaderAction, pressed && styles.sleepHeaderActionPressed]}
      >
        <Ionicons name="chevron-back" size={22} color={colors.textOnPrimary} />
      </Pressable>
      <AppText numberOfLines={1} style={styles.thyroidHeaderTitle}>
        Щитовидная система
      </AppText>
    </View>
  );
}

function NutritionSystemScreen({ system }: SystemScreenProps) {
  return (
    <SafeAreaView style={styles.sleepScreenRoot}>
      <NutritionSystemHeader />

      <ScrollView style={styles.sleepScrollView} contentContainerStyle={styles.sleepScrollContent} showsVerticalScrollIndicator={false}>
        <SystemDetailContent system={system} />
      </ScrollView>
    </SafeAreaView>
  );
}

function NutritionSystemHeader() {
  return (
    <View style={styles.sleepHeaderCard}>
      <Image source={nutritionSystemHeader} resizeMode="cover" style={styles.sleepHeaderImage} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Назад"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.nutritionHeaderAction, pressed && styles.sleepHeaderActionPressed]}
      >
        <Ionicons name="chevron-back" size={22} color={colors.textOnPrimary} />
      </Pressable>
    </View>
  );
}

function SleepSystemScreen({ system }: SystemScreenProps) {
  return (
    <SafeAreaView style={styles.sleepScreenRoot}>
      <SleepCircadianHeader />

      <ScrollView style={styles.sleepScrollView} contentContainerStyle={styles.sleepScrollContent} showsVerticalScrollIndicator={false}>
        <SystemDetailContent system={system} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SleepCircadianHeader() {
  return (
    <View style={styles.sleepHeaderCard}>
      <Image source={sleepCircadianHeader} resizeMode="stretch" style={styles.sleepHeaderImage} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Назад"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.sleepHeaderAction, pressed && styles.sleepHeaderActionPressed]}
      >
        <Ionicons name="chevron-back" size={22} color={colors.textOnPrimary} />
      </Pressable>
    </View>
  );
}

function HormonalSystemScreen({ system }: SystemScreenProps) {
  return (
    <SafeAreaView style={styles.sleepScreenRoot}>
      <HormonalSystemHeader />

      <ScrollView style={styles.sleepScrollView} contentContainerStyle={styles.sleepScrollContent} showsVerticalScrollIndicator={false}>
        <SystemDetailContent system={system} />
      </ScrollView>
    </SafeAreaView>
  );
}

function HormonalSystemHeader() {
  return (
    <View style={styles.hormonalHeaderCard}>
      <Image source={hormonalSystemHeader} resizeMode="cover" style={styles.sleepHeaderImage} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Назад"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.hormonalHeaderAction, pressed && styles.sleepHeaderActionPressed]}
      >
        <Ionicons name="chevron-back" size={22} color={colors.textOnPrimary} />
      </Pressable>
    </View>
  );
}

function StressSystemScreen({ system }: SystemScreenProps) {
  return (
    <SafeAreaView style={styles.sleepScreenRoot}>
      <StressRecoveryHeader />

      <ScrollView style={styles.sleepScrollView} contentContainerStyle={styles.sleepScrollContent} showsVerticalScrollIndicator={false}>
        <SystemDetailContent system={system} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StressRecoveryHeader() {
  return (
    <View style={styles.sleepHeaderCard}>
      <Image source={stressRecoveryHeader} resizeMode="cover" style={styles.sleepHeaderImage} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Назад"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.sleepHeaderAction, pressed && styles.sleepHeaderActionPressed]}
      >
        <Ionicons name="chevron-back" size={22} color={colors.textOnPrimary} />
      </Pressable>
    </View>
  );
}

function InflammationSystemScreen({ system }: SystemScreenProps) {
  return (
    <SafeAreaView style={styles.sleepScreenRoot}>
      <InflammationSystemHeader />

      <ScrollView style={styles.sleepScrollView} contentContainerStyle={styles.sleepScrollContent} showsVerticalScrollIndicator={false}>
        <SystemDetailContent system={system} />
      </ScrollView>
    </SafeAreaView>
  );
}

function InflammationSystemHeader() {
  return (
    <View style={styles.sleepHeaderCard}>
      <Image source={inflammationSystemHeader} resizeMode="cover" style={styles.sleepHeaderImage} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Назад"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.inflammationHeaderAction, pressed && styles.sleepHeaderActionPressed]}
      >
        <Ionicons name="chevron-back" size={22} color={colors.textOnPrimary} />
      </Pressable>
    </View>
  );
}

function DigestiveSystemScreen({ system }: SystemScreenProps) {
  return (
    <SafeAreaView style={styles.sleepScreenRoot}>
      <DigestiveSystemHeader />

      <ScrollView style={styles.sleepScrollView} contentContainerStyle={styles.sleepScrollContent} showsVerticalScrollIndicator={false}>
        <SystemDetailContent system={system} />
      </ScrollView>
    </SafeAreaView>
  );
}

function DigestiveSystemHeader() {
  return (
    <View style={styles.sleepHeaderCard}>
      <Image source={digestiveSystemHeader} resizeMode="cover" style={styles.sleepHeaderImage} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Назад"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.digestiveHeaderAction, pressed && styles.sleepHeaderActionPressed]}
      >
        <Ionicons name="chevron-back" size={22} color={colors.textOnPrimary} />
      </Pressable>
    </View>
  );
}

function MetabolicSystemScreen({ system }: SystemScreenProps) {
  return (
    <SafeAreaView style={styles.sleepScreenRoot}>
      <MetabolicSystemHeader />

      <ScrollView style={styles.sleepScrollView} contentContainerStyle={styles.sleepScrollContent} showsVerticalScrollIndicator={false}>
        <SystemDetailContent system={system} />
      </ScrollView>
    </SafeAreaView>
  );
}

function MetabolicSystemHeader() {
  return (
    <View style={styles.sleepHeaderCard}>
      <Image source={metabolicSystemHeader} resizeMode="cover" style={styles.sleepHeaderImage} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Назад"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.metabolicHeaderAction, pressed && styles.sleepHeaderActionPressed]}
      >
        <Ionicons name="chevron-back" size={22} color={colors.textOnPrimary} />
      </Pressable>
    </View>
  );
}

function SystemDetailContent({ system }: { system?: DemoBodySystem }) {
  if (system) {
    const relatedIndicators = [...system.relatedSignals, ...system.relatedBiomarkers].filter(
      (item, index, items) => items.indexOf(item) === index
    );
    const influenceFactors = [system.limitingFactor, ...system.supportingFactors];
    const recommendations = [system.recommendedAction, ...system.relatedActions].filter(
      (item, index, items) => items.indexOf(item) === index
    );
    const supportActions = [...system.relatedSupplements, ...system.relatedActions.slice(0, 2)];

    return (
      <>
        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <AppText style={styles.statusScore}>{system.score}</AppText>
          </View>
          <View style={styles.statusText}>
            <AppText style={styles.statusLabel}>{system.title}</AppText>
            <AppText style={styles.statusMeta}>
              {system.statusLabel} · {system.trendLabel} · {system.confidenceLabel}
            </AppText>
            <AppText style={styles.statusDescription}>{system.description}</AppText>
          </View>
        </View>

        <DetailListBlock title="Связанные показатели" items={relatedIndicators} />
        <DetailListBlock title="Что влияет на систему" items={influenceFactors} />
        <DetailListBlock title="Рекомендации" items={recommendations} />
        <DetailListBlock title="Добавки, питание и привычки" items={supportActions} />

        <View style={styles.safetyCard}>
          <Ionicons name="information-circle-outline" size={20} color={colors.accent} />
          <AppText style={styles.safetyText}>{demoBodySafetyNote}</AppText>
        </View>
      </>
    );
  }

  return (
    <>
      <View style={styles.statusCard}>
        <View style={styles.statusIcon}>
          <Ionicons name="pulse-outline" size={28} color={colors.accent} />
        </View>
        <View style={styles.statusText}>
          <AppText style={styles.statusLabel}>Статус системы</AppText>
          <AppText style={styles.statusDescription}>{placeholderCopy}</AppText>
        </View>
      </View>

      <PlaceholderBlock title="Связанные показатели" />
      <PlaceholderBlock title="Что влияет на систему" />
      <PlaceholderBlock title="Рекомендации" />
    </>
  );
}

function DetailListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <View style={styles.block}>
      <AppText style={styles.blockTitle}>{title}</AppText>
      <View style={styles.detailList}>
        {items.map((item) => (
          <View key={item} style={styles.detailListItem}>
            <View style={styles.detailListDot} />
            <AppText style={styles.blockCopy}>{item}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

function PlaceholderBlock({ title }: { title: string }) {
  return (
    <View style={styles.block}>
      <AppText style={styles.blockTitle}>{title}</AppText>
      <AppText style={styles.blockCopy}>{placeholderCopy}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: colors.background
  },
  sleepScreenRoot: {
    flex: 1,
    backgroundColor: colors.background
  },
  sleepScrollView: {
    flex: 1,
    backgroundColor: colors.background
  },
  sleepScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120
  },
  content: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 120
  },
  sleepHeaderCard: {
    width: '100%',
    alignSelf: 'stretch',
    height: SLEEP_HEADER_HEIGHT,
    minHeight: SLEEP_HEADER_HEIGHT,
    maxHeight: SLEEP_HEADER_HEIGHT,
    marginTop: 0,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    borderRadius: 0,
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
    overflow: 'hidden',
    backgroundColor: colors.background
  },
  sleepHeaderImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    backgroundColor: colors.background
  },
  hormonalHeaderCard: {
    width: '100%',
    alignSelf: 'stretch',
    height: SLEEP_HEADER_HEIGHT,
    minHeight: SLEEP_HEADER_HEIGHT,
    maxHeight: SLEEP_HEADER_HEIGHT,
    marginTop: 0,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    borderRadius: 0,
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
    overflow: 'hidden',
    backgroundColor: colors.background
  },
  hormonalHeaderAction: {
    position: 'absolute',
    left: 10,
    top: '50%',
    width: 40,
    height: 40,
    marginTop: -20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent,
    zIndex: 1
  },
  sleepHeaderAction: {
    position: 'absolute',
    left: 10,
    top: '50%',
    width: 40,
    height: 40,
    marginTop: -20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent,
    zIndex: 1
  },
  sleepHeaderActionPressed: {
    opacity: 0.78
  },
  nutritionHeaderAction: {
    position: 'absolute',
    left: 10,
    top: '50%',
    width: 40,
    height: 40,
    marginTop: -20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent,
    zIndex: 1
  },
  thyroidHeaderAction: {
    position: 'absolute',
    left: 10,
    top: '50%',
    width: 40,
    height: 40,
    marginTop: -20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent,
    zIndex: 1
  },
  thyroidHeaderTitle: {
    position: 'absolute',
    left: 64,
    top: 25,
    color: colors.primary,
    fontSize: 26,
    lineHeight: 31,
    fontWeight: '900',
    zIndex: 1
  },
  metabolicHeaderAction: {
    position: 'absolute',
    left: 10,
    top: '50%',
    width: 40,
    height: 40,
    marginTop: -20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent,
    zIndex: 1
  },
  inflammationHeaderAction: {
    position: 'absolute',
    left: 10,
    top: '50%',
    width: 40,
    height: 40,
    marginTop: -20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent,
    zIndex: 1
  },
  digestiveHeaderAction: {
    position: 'absolute',
    left: 10,
    top: '50%',
    width: 40,
    height: 40,
    marginTop: -20,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent,
    zIndex: 1
  },
  header: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.primary,
    padding: 18,
    marginBottom: 16,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 5
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
    marginBottom: 18
  },
  pressed: {
    opacity: 0.76
  },
  headerText: {
    gap: 8
  },
  title: {
    color: colors.textOnPrimary,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900'
  },
  description: {
    color: colors.textOnPrimaryMuted,
    fontSize: 16,
    lineHeight: 23
  },
  statusCard: {
    flexDirection: 'row',
    gap: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    padding: 18,
    marginBottom: 14
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary
  },
  statusScore: {
    color: colors.accent,
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '900'
  },
  statusText: {
    flex: 1,
    minWidth: 0
  },
  statusLabel: {
    color: colors.primary,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '800'
  },
  statusMeta: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
    fontWeight: '700'
  },
  statusDescription: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5
  },
  block: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: 18,
    marginBottom: 14
  },
  blockTitle: {
    color: colors.primary,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '800'
  },
  blockCopy: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8
  },
  detailList: {
    gap: 8,
    marginTop: 10
  },
  detailListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8
  },
  detailListDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginTop: 7
  },
  safetyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.background,
    padding: 14,
    marginBottom: 14
  },
  safetyText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18
  }
});
