import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';

export default function AISummaryScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">AI Summary</AppText>
      <SectionCard>
        <AppText variant="subtitle">Why you may feel this way</AppText>
        <AppText variant="body">1. Stress & recovery load</AppText>
        <AppText variant="body">2. Nutrient status needs attention</AppText>
        <AppText variant="body">3. Sleep consistency should improve</AppText>
      </SectionCard>
      <SectionCard>
        <AppText variant="subtitle">What will create the biggest result</AppText>
        <AppText variant="body">Sleep stabilization, magnesium protocol, perga support, and daily walking.</AppText>
      </SectionCard>
      <SectionCard>
        <AppText variant="caption">Recommendations are informational and do not replace consultation with a qualified healthcare professional.</AppText>
      </SectionCard>
      <PrimaryButton label="View Today’s Plan" onPress={() => router.replace('/(tabs)/today')} />
    </ScreenContainer>
  );
}
