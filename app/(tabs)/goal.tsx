import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionCard } from '@/components/SectionCard';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import type { TranslationKey } from '@/i18n/translations/en';

const milestones = [
  { labelKey: 'goal.milestone.blood', statusKey: 'goal.status.completed' },
  { labelKey: 'goal.milestone.braverman', statusKey: 'goal.status.completed' },
  { labelKey: 'goal.milestone.plan', statusKey: 'goal.status.inProgress' },
  { labelKey: 'goal.milestone.review', statusKey: 'goal.status.pending' },
  { labelKey: 'goal.milestone.controlBlood', statusKey: 'goal.status.future' }
] as const satisfies readonly { labelKey: TranslationKey; statusKey: TranslationKey }[];

export default function GoalScreen() {
  const { t } = useI18n();

  return (
    <ScreenContainer>
      <ScreenHeader>
        <AppText variant="title">{t('goal.title')}</AppText>
      </ScreenHeader>
      <SectionCard>
        <AppText variant="caption">{t('goal.ninetyDay')}</AppText>
        <AppText variant="subtitle">{t('goal.energyRecovery')}</AppText>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
        <AppText variant="body">{t('goal.progress', { percent: 56 })}</AppText>
        <AppText variant="caption">{t('goal.supportingActions')}</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">{t('goal.timeline')}</AppText>
        {milestones.map((milestone, index) => (
          <View key={milestone.labelKey} style={styles.milestone}>
            <View style={styles.dot}><AppText style={styles.dotText}>{index + 1}</AppText></View>
            <View style={styles.milestoneText}>
              <AppText style={styles.milestoneTitle}>{t(milestone.labelKey)}</AppText>
              <AppText variant="caption">{t(milestone.statusKey)}</AppText>
            </View>
          </View>
        ))}
      </SectionCard>

      <PrimaryButton label={t('goal.viewPlan')} onPress={() => router.push('/weekly-plan')} />
      <PrimaryButton label={t('goal.askAi')} variant="secondary" onPress={() => router.push('/(tabs)/ai')} />
      <PrimaryButton label={t('goal.openReview')} variant="secondary" onPress={() => router.push('/review')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  progressTrack: {
    height: 10,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 999,
    overflow: 'hidden',
    marginVertical: 12
  },
  progressFill: {
    width: '56%',
    height: '100%',
    backgroundColor: colors.primary
  },
  milestone: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dotText: {
    color: colors.accent,
    fontWeight: '900'
  },
  milestoneText: {
    flex: 1
  },
  milestoneTitle: {
    color: colors.text,
    fontWeight: '800'
  }
});
