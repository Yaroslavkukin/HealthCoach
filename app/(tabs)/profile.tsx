import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';

export default function ProfileScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Profile</AppText>
      <SectionCard>
        <AppText variant="subtitle">Demo User</AppText>
        <AppText variant="body">Age: 30</AppText>
        <AppText variant="body">Archetype: The Strategist</AppText>
        <AppText variant="body">Profile completion: 72%</AppText>
      </SectionCard>
      <PrimaryButton label="Delivery Information" />
      <PrimaryButton label="Clinic" variant="secondary" onPress={() => router.push('/clinic')} />
      <PrimaryButton label="Success Stories" variant="secondary" onPress={() => router.push('/success-stories')} />
    </ScreenContainer>
  );
}
