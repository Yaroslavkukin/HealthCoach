import { useLocalSearchParams } from 'expo-router';
import { AppText } from '@/components/AppText';
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
        <AppText variant="caption">Status: {marker.status}</AppText>
      </SectionCard>
      <SectionCard>
        <AppText variant="subtitle">Why it matters</AppText>
        <AppText variant="body">{marker.explanation}</AppText>
      </SectionCard>
      <SectionCard>
        <AppText variant="subtitle">How to improve</AppText>
        <AppText variant="body">AI-generated recommendations will appear here after integration.</AppText>
      </SectionCard>
    </ScreenContainer>
  );
}
