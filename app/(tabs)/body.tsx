import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { HealthSystemCard } from '@/components/HealthSystemCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { demoBiomarkers, demoSystemScores } from '@/data/mock/healthProfile';

export default function BodyScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">My Body</AppText>
      <AppText variant="body">Health systems, not isolated numbers.</AppText>
      {demoSystemScores.map((score) => <HealthSystemCard key={score.label} score={score} />)}
      <SectionCard>
        <AppText variant="subtitle">Key Biomarkers</AppText>
        {demoBiomarkers.map((marker) => (
          <AppText key={marker.id} variant="body" onPress={() => router.push(`/biomarker/${marker.id}`)}>{marker.name}: {marker.value} {marker.unit}</AppText>
        ))}
      </SectionCard>
      <PrimaryButton label="Ask AI about my body" />
    </ScreenContainer>
  );
}
