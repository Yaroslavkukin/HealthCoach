import { useState } from 'react';
import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { demoUser } from '@/data/mock/healthProfile';

export default function BravermanScreen() {
  const [showResult, setShowResult] = useState(false);

  return (
    <ScreenContainer>
      <AppText variant="title">Braverman Assessment</AppText>
      <AppText variant="body">Identify neurotransmitter tendencies and your Motivation Archetype.</AppText>

      <SectionCard>
        <AppText variant="subtitle">Sample Questions</AppText>
        <AppText variant="body">- I am motivated by clear progress and measurable goals.</AppText>
        <AppText variant="body">- I lose energy when routines become chaotic.</AppText>
        <AppText variant="body">- I prefer direct, practical coaching.</AppText>
      </SectionCard>

      {showResult ? (
        <SectionCard>
          <AppText variant="subtitle">Your Demo Archetype: {demoUser.archetype}</AppText>
          <AppText variant="body">Driven by progress, achievement, and clear goals.</AppText>
          <AppText variant="caption">Raw technical scores stay behind the scenes in this UX.</AppText>
        </SectionCard>
      ) : (
        <StateNotice title="Assessment not completed" message="Tap the mock action to reveal the demo archetype result." variant="empty" />
      )}

      <PrimaryButton label="Complete Mock Assessment" onPress={() => setShowResult(true)} />
      <PrimaryButton label="Continue to Lifestyle" variant="secondary" onPress={() => router.push('/onboarding/lifestyle')} />
    </ScreenContainer>
  );
}
