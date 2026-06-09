import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { getLatestGeneratedHealthProfile } from '@/lib/aiClient';

export default function AISummaryScreen() {
  const profile = getLatestGeneratedHealthProfile();
  const summary = profile.summary;

  return (
    <ScreenContainer>
      <AppText variant="title">AI Summary</AppText>
      <AppText variant="body">Why do I feel this way right now?</AppText>

      <SectionCard>
        <AppText variant="subtitle">Generated Health Profile</AppText>
        <AppText variant="body">Health Score: {profile.healthScore} - {profile.healthStatus}</AppText>
        <AppText variant="caption">Confidence: {profile.confidence}</AppText>
        <AppText variant="caption">Outputs ready: health scores, supplement stack, bee products, nutrition plan, and 7-day plan.</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">Current Limiting Factors</AppText>
        {summary.limitingFactors.map((item, index) => (
          <AppText key={item} variant="body">{index + 1}. {item}</AppText>
        ))}
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">What Will Create the Biggest Result</AppText>
        {summary.biggestResult.map((item, index) => (
          <AppText key={item} variant="body">{index + 1}. {item}</AppText>
        ))}
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">Expected Effect</AppText>
        <AppText variant="body">{summary.expectedEffect}</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">Recommended Next Step</AppText>
        <AppText variant="body">{summary.nextStep}</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="caption">{summary.safetyNote}</AppText>
      </SectionCard>

      <PrimaryButton label="View Today’s Plan" onPress={() => router.replace('/(tabs)/today')} />
      <PrimaryButton label="View Supplement Stack" variant="secondary" onPress={() => router.push('/supplements')} />
      <PrimaryButton label="Ask AI" variant="secondary" onPress={() => router.push('/(tabs)/ai')} />
    </ScreenContainer>
  );
}
