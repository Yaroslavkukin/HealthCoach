import { useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { bravermanQuestions } from '@/data/bravermanQuestions';
import { BRAVERMAN_RESULT_STORAGE_KEY, calculateBravermanResult } from '@/lib/bravermanScoring';
import { colors } from '@/theme/colors';

const orderedQuestions = [...bravermanQuestions].sort((first, second) => first.order - second.order);
const bravermanHeaderIllustration = require('../assets/images/braverman-test-header-illustration.png');
const bravermanBottomDecoration = require('../assets/images/braverman-test-bottom-decoration.png');

export default function BravermanTestRunScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const currentQuestion = orderedQuestions[currentIndex];
  const currentAnswer = answers[currentQuestion.id];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === orderedQuestions.length - 1;
  const isComplete = answeredCount === orderedQuestions.length;
  const progress = ((currentIndex + 1) / orderedQuestions.length) * 100;

  const selectAnswer = (answer: boolean) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentQuestion.id]: answer
    }));
  };

  const goNext = () => {
    if (currentAnswer === undefined || isLastQuestion) {
      return;
    }

    setCurrentIndex((index) => index + 1);
  };

  const goPrevious = () => {
    if (isFirstQuestion) {
      return;
    }

    setCurrentIndex((index) => index - 1);
  };

  const finishTest = async () => {
    if (!isComplete || isSaving) {
      return;
    }

    setIsSaving(true);
    const result = calculateBravermanResult(answers);
    await AsyncStorage.setItem(BRAVERMAN_RESULT_STORAGE_KEY, JSON.stringify(result));
    router.replace('/braverman-test');
  };

  return (
    <SafeAreaView style={styles.screenRoot}>
      <BravermanTestHeader />

      <View style={styles.content}>
        <AppText style={styles.progressLabel}>
          Вопрос {currentIndex + 1} из {orderedQuestions.length}
        </AppText>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <View style={styles.questionCard}>
          <AppText style={styles.questionMeta}>
            {currentQuestion.type === 'dominant' ? 'Обычные паттерны' : 'Текущее состояние'}
          </AppText>
          <ScrollView
            nestedScrollEnabled
            style={styles.questionTextScroll}
            contentContainerStyle={styles.questionTextContent}
            showsVerticalScrollIndicator={false}
          >
            <AppText style={styles.questionText}>{currentQuestion.text}</AppText>
          </ScrollView>

          <View style={styles.answerRow}>
            <AnswerButton label="Да" selected={currentAnswer === true} onPress={() => selectAnswer(true)} />
            <AnswerButton label="Нет" selected={currentAnswer === false} onPress={() => selectAnswer(false)} />
          </View>
        </View>

        <View style={styles.navigationRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isFirstQuestion }}
            disabled={isFirstQuestion}
            onPress={goPrevious}
            style={({ pressed }) => [
              styles.secondaryButton,
              isFirstQuestion && styles.disabledButton,
              pressed && !isFirstQuestion && styles.pressedAction
            ]}
          >
            <AppText style={[styles.secondaryButtonText, isFirstQuestion && styles.disabledButtonText]}>Назад</AppText>
          </Pressable>

          {isLastQuestion ? (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !isComplete || isSaving }}
              disabled={!isComplete || isSaving}
              onPress={finishTest}
              style={({ pressed }) => [
                styles.primaryButton,
                (!isComplete || isSaving) && styles.disabledButton,
                pressed && isComplete && !isSaving && styles.pressedAction
              ]}
            >
              <AppText style={[styles.primaryButtonText, (!isComplete || isSaving) && styles.disabledButtonText]}>
                Завершить тест
              </AppText>
            </Pressable>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: currentAnswer === undefined }}
              disabled={currentAnswer === undefined}
              onPress={goNext}
              style={({ pressed }) => [
                styles.primaryButton,
                currentAnswer === undefined && styles.disabledButton,
                pressed && currentAnswer !== undefined && styles.pressedAction
              ]}
            >
              <AppText style={[styles.primaryButtonText, currentAnswer === undefined && styles.disabledButtonText]}>
                Далее
              </AppText>
            </Pressable>
          )}
        </View>

        <AppText style={styles.completionText}>
          Отвечено: {answeredCount} из {orderedQuestions.length}
        </AppText>
        <View
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={styles.bottomDecorationFrame}
        >
          <Image source={bravermanBottomDecoration} resizeMode="cover" style={styles.bottomDecoration} />
        </View>
      </View>
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
        accessibilityLabel="Назад"
        onPress={() => router.replace('/braverman-test')}
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

function AnswerButton({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.answerButton, selected && styles.answerButtonSelected, pressed && styles.pressedAction]}
    >
      <AppText style={[styles.answerButtonText, selected && styles.answerButtonTextSelected]}>{label}</AppText>
    </Pressable>
  );
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8
  },
  progressLabel: {
    color: colors.primary,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '900',
    marginBottom: 8
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.accent
  },
  questionCard: {
    height: 300,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    padding: 20,
    marginTop: 16,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 3
  },
  questionMeta: {
    color: colors.accent,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900'
  },
  questionText: {
    color: colors.primary,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '800'
  },
  questionTextScroll: {
    flex: 1,
    marginTop: 12
  },
  questionTextContent: {
    paddingBottom: 4
  },
  answerRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22
  },
  answerButton: {
    flex: 1,
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  answerButtonSelected: {
    backgroundColor: colors.primary
  },
  answerButtonText: {
    color: colors.primary,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900'
  },
  answerButtonTextSelected: {
    color: colors.textOnPrimary
  },
  navigationRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16
  },
  secondaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12
  },
  primaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900'
  },
  primaryButtonText: {
    color: colors.textOnPrimary,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900',
    textAlign: 'center'
  },
  disabledButton: {
    opacity: 0.46
  },
  disabledButtonText: {
    color: colors.textSoft
  },
  completionText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 14,
    textAlign: 'center'
  },
  bottomDecorationFrame: {
    flex: 1,
    minHeight: 130,
    marginHorizontal: -20,
    marginTop: 30,
    overflow: 'hidden'
  },
  bottomDecoration: {
    width: '100%',
    height: '100%'
  }
});
