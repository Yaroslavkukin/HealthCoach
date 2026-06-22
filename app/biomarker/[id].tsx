import { router, useLocalSearchParams } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionCard } from '@/components/SectionCard';
import { demoBiomarkers } from '@/data/mock/healthProfile';
import { useI18n } from '@/i18n';
import { translateBiomarker, translateSimpleLabel } from '@/i18n/mockContent';

export default function BiomarkerDetailScreen() {
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const marker = translateBiomarker(demoBiomarkers.find((item) => item.id === id) ?? demoBiomarkers[0], t);

  return (
    <ScreenContainer>
      <ScreenHeader>
        <AppText variant="title">{marker.name}</AppText>
      </ScreenHeader>
      <SectionCard>
        <AppText variant="metric">{marker.value}</AppText>
        <AppText variant="body">{marker.unit}</AppText>
        <AppText variant="caption">{t('biomarker.reference', { range: marker.referenceRange ?? '' })}</AppText>
        <AppText variant="caption">{t('component.status', { status: translateSimpleLabel(marker.status, t) })}</AppText>
        <AppText variant="caption">{t('biomarker.trend', { trend: marker.trend ?? '' })}</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">{t('biomarker.whatIsThis')}</AppText>
        <AppText variant="body">{marker.explanation}</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">{t('biomarker.affects')}</AppText>
        {marker.affects?.map((item) => <AppText key={item} variant="body">- {item}</AppText>)}
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">{t('biomarker.improve')}</AppText>
        {marker.improvementActions?.map((item) => <AppText key={item} variant="body">- {item}</AppText>)}
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">{t('biomarker.related')}</AppText>
        {marker.relatedRecommendations?.map((item) => <AppText key={item} variant="body">- {item}</AppText>)}
      </SectionCard>

      <PrimaryButton label={t('common.askAi')} onPress={() => router.push('/(tabs)/ai')} />
      <PrimaryButton label={t('biomarker.viewSupplements')} variant="secondary" onPress={() => router.push('/(tabs)/supplements')} />
    </ScreenContainer>
  );
}
