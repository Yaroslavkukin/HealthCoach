import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';

export default function SubscriptionScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Unlock Full Access</AppText>
      <AppText variant="body">You pay for your personal AI Health Coach, not just access to an app.</AppText>

      <SectionCard>
        <AppText variant="subtitle">Monthly Membership</AppText>
        <AppText variant="metric">3000 ₽</AppText>
        <AppText variant="caption">per month</AppText>
        <PrimaryButton label="Subscribe Monthly" onPress={() => router.push('/(auth)/create-account')} />
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">6-Month Membership</AppText>
        <AppText variant="metric">15000 ₽</AppText>
        <AppText variant="caption">2500 ₽ per month equivalent</AppText>
        <PrimaryButton label="Subscribe for 6 Months" onPress={() => router.push('/(auth)/create-account')} />
      </SectionCard>
    </ScreenContainer>
  );
}
