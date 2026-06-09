import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { demoAISummary } from '@/data/mock/healthProfile';

export default function AISummaryScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">AI Summary</AppText>
      <AppText variant="body">Why do I feel this way right now?</AppText>

      <SectionCard>
        <AppText variant="subtitle">Current Limiting Factors</AppText>
        {demoAISummary.limitingFactors.map((item, index) => (
          <AppText key={item} variant="body">{index + 1}. {item}</AppText>
        ))}
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">What Will Create the Biggest Result</AppText>
        {demoAISummary.biggestResult.map((item, index) => (
          <AppText key={item} variant="body">{index + 1}. {item}</AppText>
        ))}
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">Expected Effect</AppText>
        <AppText variant="body">{demoAISummary.expectedEffect}</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">Recommended Next Step</AppText>
        <AppText variant="body">{demoAISummary.nextStep}</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="caption">Recommendations are informational and do not replace consultation with a qualified healthcare professional.</AppText>
      </SectionCard>

      <PrimaryButton label="View Today’s Plan" onPress={() => router.replace('/(tabs)/today')} />
      <PrimaryButton label="View Supplement Stack" variant="secondary" onPress={() => router.push('/supplements')} />
      <PrimaryButton label="Ask AI" variant="secondary" onPress={() => router.push('/(tabs)/ai')} />
    </ScreenContainer>
  );
}
