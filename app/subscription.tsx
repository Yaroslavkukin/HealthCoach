import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { accessRoutes, getAccessProgressLabel, getAccessStageDescription } from '@/features/access/accessModel';

const benefits = [
  'Personalized AI recommendations',
  'Blood analysis interpretation',
  'Braverman assessment analysis',
  'Supplement and bee product plans',
  'Nutrition plans and AI assistant',
  'Progress tracking and 14-day reviews'
];

export default function SubscriptionScreen() {
  function continueWithMockSubscription() {
    router.push(accessRoutes.createAccount);
  }

  return (
    <ScreenContainer>
      <AppText variant="title">Health Coach</AppText>
      <AppText variant="body">Your personal AI health coach based on blood analysis, nutrition, lifestyle, and progress.</AppText>

      <StateNotice
        title={getAccessProgressLabel('subscription')}
        message={`${getAccessStageDescription('subscription')} This is a mock subscription flow. No payment will be charged.`}
        variant="info"
      />

      <SectionCard>
        <AppText variant="subtitle">What full access includes</AppText>
        {benefits.map((benefit) => (
          <AppText key={benefit} variant="body">- {benefit}</AppText>
        ))}
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">Monthly Membership</AppText>
        <AppText variant="metric">3000 ₽</AppText>
        <AppText variant="caption">per month</AppText>
        <PrimaryButton label="Subscribe for 3000 RUB / month" onPress={continueWithMockSubscription} />
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">6-Month Membership</AppText>
        <AppText variant="metric">15000 ₽</AppText>
        <AppText variant="caption">2500 ₽ per month equivalent</AppText>
        <PrimaryButton label="Subscribe for 15000 RUB / 6 months" onPress={continueWithMockSubscription} />
      </SectionCard>

      <PrimaryButton label="Back to Preview" variant="secondary" onPress={() => router.push(accessRoutes.preview)} />
    </ScreenContainer>
  );
}
