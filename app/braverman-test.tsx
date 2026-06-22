import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { BRAVERMAN_RESULT_STORAGE_KEY } from '@/lib/bravermanScoring';
import { colors } from '@/theme/colors';
import type { BravermanArchetype, BravermanNeurotransmitter, BravermanResult } from '@/types/braverman';

const bravermanHeaderIllustration = require('../assets/images/braverman-test-header-illustration.png');

const profileLabels: Record<BravermanNeurotransmitter, string> = {
  dopamine: 'Дофаминовый профиль',
  acetylcholine: 'Ацетилхолиновый профиль',
  gaba: 'GABA / ГАМК профиль',
  serotonin: 'Серотониновый профиль'
};

const attentionLabels: Record<BravermanNeurotransmitter, string> = {
  dopamine: 'мотивация, энергия и фокус',
  acetylcholine: 'гибкость мышления, память и идеи',
  gaba: 'спокойствие, устойчивость и восстановление',
  serotonin: 'настроение, удовольствие и эмоциональный баланс'
};

const archetypeExplanations: Record<BravermanArchetype, string> = {
  Стратег:
    'Вам обычно помогает ясная цель, видимый прогресс и конкретные действия. Рекомендации лучше работают, когда они измеримы и привязаны к результату.',
  Создатель:
    'Вам может подходить формат экспериментов, новых идей и гибких способов действия. Рекомендации лучше работают, когда есть новизна и пространство для выбора.',
  Хранитель:
    'Вам может помогать стабильная структура, понятный ритм и повторяемые привычки. Рекомендации лучше работают, когда они встроены в спокойную систему.',
  Исследователь:
    'Вам может подходить мягкий, гибкий подход с акцентом на удовольствие, восстановление и ощущение жизни. Рекомендации лучше работают, когда не выглядят как давление.'
};

function parseStoredResult(storedResult: string | null): BravermanResult | null {
  if (!storedResult) {
    return null;
  }

  try {
    return JSON.parse(storedResult) as BravermanResult;
  } catch {
    return null;
  }
}

export default function BravermanTestScreen() {
  const [result, setResult] = useState<BravermanResult | null>(null);

  const loadResult = useCallback(() => {
    let isActive = true;

    AsyncStorage.getItem(BRAVERMAN_RESULT_STORAGE_KEY)
      .then((storedResult) => {
        if (!isActive) {
          return;
        }

        setResult(parseStoredResult(storedResult));
      })
      .catch(() => {
        if (isActive) {
          setResult(null);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  useFocusEffect(loadResult);

  return (
    <SafeAreaView style={styles.screenRoot}>
      <BravermanTestHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Пройти тест"
          onPress={() => router.push('/braverman-test-run')}
          style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed]}
        >
          <AppText style={styles.startButtonText}>Пройти тест</AppText>
        </Pressable>

        {result ? <BravermanResultCard result={result} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function BravermanTestHeader() {
  return (
    <View style={styles.headerCard}>
      <View pointerEvents="none" style={styles.headerWave} />
      <View pointerEvents="none" style={styles.headerWaveSoft} />
      <View pointerEvents="none" style={styles.headerIllustrationWrapper}>
        <Image source={bravermanHeaderIllustration} resizeMode="contain" style={styles.headerIllustration} />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.headerAction, pressed && styles.pressedAction]}
      >
        <Ionicons name="chevron-back" size={22} color={colors.textOnPrimary} />
      </Pressable>

      <View style={styles.headerText}>
        <AppText numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} style={styles.headerTitle}>
          Тест Бравермана
        </AppText>
        <AppText numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.84} style={styles.headerSubtitle}>
          Личностный профиль, энергия{'\n'}и особенности поведения
        </AppText>
      </View>

      <View style={styles.headerActionSpacer} />
    </View>
  );
}

function BravermanResultCard({ result }: { result: BravermanResult }) {
  return (
    <View style={styles.resultCard}>
      <AppText style={styles.resultTitle}>Результат теста</AppText>
      <View style={styles.resultRows}>
        <ResultRow label="Ваш мотивационный архетип" value={result.motivationArchetype} />
        <ResultRow
          label="Доминирующий профиль"
          value={`${profileLabels[result.dominantProfile]}${result.isMixedProfile ? ' · близкий смешанный профиль' : ''}`}
        />
        <ResultRow label="Вторичный профиль" value={profileLabels[result.secondaryProfile]} />
        <ResultRow label="Зона внимания" value={attentionLabels[result.mainAttentionArea]} />
      </View>
      <AppText style={styles.resultExplanation}>{archetypeExplanations[result.motivationArchetype]}</AppText>
      <AppText style={styles.resultSafety}>
        Тест используется для персонализации рекомендаций и не заменяет профессиональную оценку состояния.
      </AppText>
    </View>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.resultRow}>
      <AppText style={styles.resultRowLabel}>{label}</AppText>
      <AppText style={styles.resultRowValue}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120
  },
  startButton: {
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 3
  },
  startButtonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }]
  },
  startButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
    textAlign: 'center'
  },
  resultCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    padding: 18,
    marginTop: 16,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 3
  },
  resultTitle: {
    color: colors.primary,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900'
  },
  resultRows: {
    gap: 10,
    marginTop: 14
  },
  resultRow: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.background,
    padding: 12
  },
  resultRowLabel: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800'
  },
  resultRowValue: {
    color: colors.primary,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
    marginTop: 3
  },
  resultExplanation: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 14
  },
  resultSafety: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 12
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
    backgroundColor: '#DDE8CF',
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
    backgroundColor: '#CAD8B8',
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
    opacity: 0.82,
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent,
    zIndex: 1
  },
  pressedAction: {
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
  }
});
