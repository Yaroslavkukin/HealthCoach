import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScorePill } from '@/components/ScorePill';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { demoAISummary, demoCoreScores, demoNutritionMeals, demoSupplements, demoUser } from '@/data/mock/healthProfile';
import { accessRoutes } from '@/features/access/accessModel';
import { useI18n } from '@/i18n';
import { translateAISummary, translateHealthStatus, translateNutritionMeal, translateSupplement, translateArchetype } from '@/i18n/mockContent';
import { colors } from '@/theme/colors';

export default function PreviewScreen() {
  const { t } = useI18n();
  const summary = translateAISummary(demoAISummary, t);
  const previewMeal = translateNutritionMeal(demoNutritionMeals[0], t);
  const previewSupplements = demoSupplements.slice(0, 2).map((item) => translateSupplement(item, t));

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <View>
          <AppText variant="title">{t('app.name')}</AppText>
          <AppText variant="body">{t('preview.subtitle')}</AppText>
        </View>
        <View style={styles.demoBadge}>
          <AppText style={styles.demoBadgeText}>{t('preview.demoMode')}</AppText>
        </View>
      </View>

      <StateNotice
        title={t('preview.noticeTitle')}
        message={t('preview.noticeMessage')}
        variant="info"
      />

      <SectionCard style={styles.heroCard}>
        <AppText variant="caption">{t('preview.demoHealthScore')}</AppText>
        <AppText variant="metric">{demoUser.healthScore}</AppText>
        <AppText variant="body">{translateHealthStatus(demoUser.healthStatus, t)}</AppText>
        <AppText variant="caption">{t('preview.archetype', { archetype: translateArchetype(demoUser.archetype, t) })}</AppText>
      </SectionCard>

      <View style={styles.row}>
        {demoCoreScores.map((score) => (
          <ScorePill key={score.label} score={score} />
        ))}
      </View>

      <SectionCard>
        <AppText variant="subtitle">{t('preview.exampleSummary')}</AppText>
        <AppText variant="body">{summary.expectedEffect}</AppText>
        <PrimaryButton label={t('preview.openSummary')} variant="secondary" onPress={() => router.push('/onboarding/ai-summary')} />
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">{t('preview.demoStack')}</AppText>
        {previewSupplements.map((item) => (
          <AppText key={item.id} variant="body">{item.name}: {item.dosage}</AppText>
        ))}
        <PrimaryButton label={t('preview.viewSupplements')} variant="secondary" onPress={() => router.push('/supplements')} />
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">{t('preview.demoNutrition')}</AppText>
        <AppText variant="body">{previewMeal.title}</AppText>
        <AppText variant="caption">{previewMeal.description}</AppText>
        <PrimaryButton label={t('preview.viewNutrition')} variant="secondary" onPress={() => router.push('/nutrition')} />
      </SectionCard>

      <View style={styles.linkGrid}>
        <PrimaryButton label={t('preview.demoToday')} variant="secondary" onPress={() => router.push('/(tabs)/today')} />
        <PrimaryButton label={t('preview.demoBody')} variant="secondary" onPress={() => router.push('/(tabs)/body')} />
        <PrimaryButton label={t('preview.successStories')} variant="secondary" onPress={() => router.push('/success-stories')} />
      </View>

      <PrimaryButton label={t('preview.startJourney')} onPress={() => router.push(accessRoutes.subscription)} />
      <PrimaryButton label={t('preview.viewSubscription')} variant="secondary" onPress={() => router.push(accessRoutes.subscription)} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'flex-start',
    marginBottom: 16
  },
  demoBadge: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  demoBadgeText: {
    color: colors.background,
    fontWeight: '900'
  },
  heroCard: {
    alignItems: 'center',
    backgroundColor: colors.cardElevated
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16
  },
  linkGrid: {
    marginBottom: 4
  }
});
