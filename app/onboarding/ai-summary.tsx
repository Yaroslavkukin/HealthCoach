import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionCard } from '@/components/SectionCard';
import { useI18n } from '@/i18n';
import { translateAISummary, translateHealthStatus, translateSimpleLabel } from '@/i18n/mockContent';
import { getLatestGeneratedHealthProfile } from '@/lib/aiClient';

export default function AISummaryScreen() {
  const { t } = useI18n();
  const profile = getLatestGeneratedHealthProfile();
  const summary = profile.source === 'mock' ? translateAISummary(profile.summary, t) : profile.summary;
  const healthStatus = profile.source === 'mock' ? translateHealthStatus(profile.healthStatus, t) : profile.healthStatus;

  return (
    <ScreenContainer>
      <ScreenHeader>
        <AppText variant="title">{t('onboarding.summary.title')}</AppText>
        <AppText variant="body">{t('onboarding.summary.question')}</AppText>
      </ScreenHeader>

      <SectionCard>
        <AppText variant="subtitle">{t('onboarding.summary.generated')}</AppText>
        <AppText variant="body">{t('onboarding.summary.healthScore', { score: profile.healthScore, status: healthStatus })}</AppText>
        <AppText variant="caption">{t('component.confidence', { confidence: translateSimpleLabel(profile.confidence, t) })}</AppText>
        <AppText variant="caption">{t('onboarding.summary.outputs')}</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">{t('onboarding.summary.limiting')}</AppText>
        {summary.limitingFactors.map((item, index) => (
          <AppText key={item} variant="body">{index + 1}. {item}</AppText>
        ))}
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">{t('onboarding.summary.biggest')}</AppText>
        {summary.biggestResult.map((item, index) => (
          <AppText key={item} variant="body">{index + 1}. {item}</AppText>
        ))}
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">{t('onboarding.summary.expected')}</AppText>
        <AppText variant="body">{summary.expectedEffect}</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">{t('onboarding.summary.next')}</AppText>
        <AppText variant="body">{summary.nextStep}</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="caption">{summary.safetyNote}</AppText>
      </SectionCard>

      <PrimaryButton label={t('onboarding.summary.today')} onPress={() => router.replace('/(tabs)/today')} />
      <PrimaryButton label={t('onboarding.summary.supplements')} variant="secondary" onPress={() => router.push('/(tabs)/supplements')} />
      <PrimaryButton label={t('common.askAi')} variant="secondary" onPress={() => router.push('/(tabs)/ai')} />
    </ScreenContainer>
  );
}
