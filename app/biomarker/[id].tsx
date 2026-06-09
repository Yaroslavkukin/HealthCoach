import { router, useLocalSearchParams } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { demoBiomarkers } from '@/data/mock/healthProfile';

export default function BiomarkerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const marker = demoBiomarkers.find((item) => item.id === id) ?? demoBiomarkers[0];

  return (
    <ScreenContainer>
      <AppText variant="title">{marker.name}</AppText>
      <SectionCard>
        <AppText variant="metric">{marker.value}</AppText>
        <AppText variant="body">{marker.unit}</AppText>
        <AppText variant="caption">Reference range: {marker.referenceRange}</AppText>
        <AppText variant="caption">Status: {marker.status}</AppText>
        <AppText variant="caption">Trend: {marker.trend}</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">What is this?</AppText>
        <AppText variant="body">{marker.explanation}</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">What affects it?</AppText>
        {marker.affects?.map((item) => <AppText key={item} variant="body">- {item}</AppText>)}
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">How to improve it</AppText>
        {marker.improvementActions?.map((item) => <AppText key={item} variant="body">- {item}</AppText>)}
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">Related Recommendations</AppText>
        {marker.relatedRecommendations?.map((item) => <AppText key={item} variant="body">- {item}</AppText>)}
      </SectionCard>

      <PrimaryButton label="Ask AI" onPress={() => router.push('/(tabs)/ai')} />
      <PrimaryButton label="View Supplements" variant="secondary" onPress={() => router.push('/supplements')} />
    </ScreenContainer>
  );
}
