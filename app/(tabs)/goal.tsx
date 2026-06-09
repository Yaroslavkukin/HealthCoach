import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';

export default function GoalScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Goal Journey</AppText>
      <SectionCard>
        <AppText variant="caption">90-Day Goal</AppText>
        <AppText variant="subtitle">Increase Energy</AppText>
        <AppText variant="body">Progress: 56%</AppText>
      </SectionCard>
      <SectionCard>
        <AppText variant="subtitle">Milestones</AppText>
        <AppText variant="body">✓ Blood analysis uploaded</AppText>
        <AppText variant="body">✓ Braverman completed</AppText>
        <AppText variant="body">• Execute 7-day plan</AppText>
        <AppText variant="body">• 14-day review</AppText>
      </SectionCard>
      <PrimaryButton label="Ask AI about Goal" />
    </ScreenContainer>
  );
}
