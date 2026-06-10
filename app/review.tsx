import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { reviewFollowUps } from '@/data/mock/testingReadiness';
import { colors } from '@/theme/colors';

const reviewQuestions = ['Energy', 'Mood', 'Motivation', 'Productivity', 'Sleep', 'Plan follow-through'];
const answers = ['Better', 'Same', 'Worse'];

export default function FourteenDayReviewScreen() {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const answered = Object.keys(selected).length;
  const isEmpty = answered === 0;
  const isComplete = answered === reviewQuestions.length;
  const reviewState = isEmpty ? 'empty' : 'info';
  const reviewMessage = isEmpty
    ? 'Start with one area to preview the check-in flow.'
    : isComplete
      ? 'All review areas are answered. Saving returns testers to Today.'
      : `${answered} of ${reviewQuestions.length} areas are answered. Continue when ready.`;

  return (
    <ScreenContainer>
      <AppText variant="title">14-Day Review</AppText>
      <AppText variant="body">A coaching check-in, not a medical form.</AppText>

      <StateNotice title={isComplete ? 'Review ready' : 'Review in progress'} message={reviewMessage} variant={reviewState} />

      {reviewQuestions.map((question) => (
        <SectionCard key={question}>
          <AppText variant="subtitle">How is your {question.toLowerCase()}?</AppText>
          <View style={styles.answerRow}>
            {answers.map((answer) => (
              <Pressable key={answer} onPress={() => setSelected((current) => ({ ...current, [question]: answer }))} style={[styles.answer, selected[question] === answer && styles.answerActive]}>
                <AppText style={[styles.answerText, selected[question] === answer && styles.answerTextActive]}>{answer}</AppText>
              </Pressable>
            ))}
          </View>
        </SectionCard>
      ))}

      <SectionCard>
        <AppText variant="subtitle">Review Progress</AppText>
        <AppText variant="body">{answered} of {reviewQuestions.length} answered</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">After This Check-In</AppText>
        {reviewFollowUps.map((item) => (
          <AppText key={item.id} variant="body">- {item.title}: {item.detail}</AppText>
        ))}
      </SectionCard>

      <PrimaryButton label="Save Mock Review" onPress={() => router.push('/(tabs)/today')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  answerRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12
  },
  answer: {
    flex: 1,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    backgroundColor: colors.cardElevated,
    borderWidth: 1,
    borderColor: colors.border
  },
  answerActive: {
    backgroundColor: colors.accent
  },
  answerText: {
    color: colors.textSecondary,
    fontWeight: '800'
  },
  answerTextActive: {
    color: colors.background
  }
});
