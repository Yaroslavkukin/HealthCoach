import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { reviewFollowUps } from '@/data/mock/testingReadiness';
import { useI18n } from '@/i18n';
import { translateReviewFollowUp } from '@/i18n/mockContent';
import { colors } from '@/theme/colors';
import type { TranslationKey } from '@/i18n/translations/en';

const reviewQuestions = ['review.energy', 'review.mood', 'review.motivation', 'review.productivity', 'review.sleep', 'review.followThrough'] as const satisfies readonly TranslationKey[];
const answers = ['review.better', 'review.same', 'review.worse'] as const satisfies readonly TranslationKey[];

export default function FourteenDayReviewScreen() {
  const { t } = useI18n();
  const [selected, setSelected] = useState<Record<string, string>>({});
  const answered = Object.keys(selected).length;
  const isEmpty = answered === 0;
  const isComplete = answered === reviewQuestions.length;
  const reviewState = isEmpty ? 'empty' : 'info';
  const reviewMessage = isEmpty
    ? t('review.emptyMessage')
    : isComplete
      ? t('review.completeMessage')
      : t('review.partialMessage', { answered, total: reviewQuestions.length });

  return (
    <ScreenContainer>
      <AppText variant="title">{t('review.title')}</AppText>
      <AppText variant="body">{t('review.subtitle')}</AppText>

      <StateNotice title={isComplete ? t('review.ready') : t('review.inProgress')} message={reviewMessage} variant={reviewState} />

      {reviewQuestions.map((question) => (
        <SectionCard key={question}>
          <AppText variant="subtitle">{t('review.question', { area: t(question) })}</AppText>
          <View style={styles.answerRow}>
            {answers.map((answer) => (
              <Pressable key={answer} onPress={() => setSelected((current) => ({ ...current, [question]: answer }))} style={[styles.answer, selected[question] === answer && styles.answerActive]}>
                <AppText style={[styles.answerText, selected[question] === answer && styles.answerTextActive]}>{t(answer)}</AppText>
              </Pressable>
            ))}
          </View>
        </SectionCard>
      ))}

      <SectionCard>
        <AppText variant="subtitle">{t('review.progressTitle')}</AppText>
        <AppText variant="body">{t('review.progressBody', { answered, total: reviewQuestions.length })}</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">{t('review.after')}</AppText>
        {reviewFollowUps.map((item) => {
          const displayItem = translateReviewFollowUp(item, t);

          return <AppText key={item.id} variant="body">- {displayItem.title}: {displayItem.detail}</AppText>;
        })}
      </SectionCard>

      <PrimaryButton label={t('review.save')} onPress={() => router.push('/(tabs)/today')} />
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
