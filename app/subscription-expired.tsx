import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';

export default function SubscriptionExpiredScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Subscription Expired</AppText>
      <AppText variant="body">Demo limited-access state for users whose coach access needs renewal.</AppText>

      <StateNotice
        title="Limited access"
        message="Today preview remains visible, while personalized updates and AI generation are locked in this mock state."
        variant="error"
      />

      <SectionCard>
        <AppText variant="subtitle">Available</AppText>
        <AppText variant="body">- Preview demo screens</AppText>
        <AppText variant="body">- Success stories</AppText>
        <AppText variant="body">- Subscription options</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">Locked Until Renewal</AppText>
        <AppText variant="body">- New generated plans</AppText>
        <AppText variant="body">- Personalized assistant updates</AppText>
        <AppText variant="body">- Review-based plan changes</AppText>
      </SectionCard>

      <PrimaryButton label="Renew Access" onPress={() => router.push('/subscription')} />
      <PrimaryButton label="Open Preview" variant="secondary" onPress={() => router.push('/preview')} />
    </ScreenContainer>
  );
}
