import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';

export default function BravermanScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Braverman Assessment</AppText>
      <AppText variant="body">Identify neurotransmitter tendencies and your Motivation Archetype.</AppText>
      <SectionCard>
        <AppText variant="subtitle">Output</AppText>
        <AppText variant="body">Dominant profile, possible deficiencies, and archetype: Strategist, Creator, Guardian, or Explorer.</AppText>
      </SectionCard>
      <PrimaryButton label="Start Assessment" />
      <PrimaryButton label="Continue" variant="secondary" onPress={() => router.push('/onboarding/lifestyle')} />
    </ScreenContainer>
  );
}
