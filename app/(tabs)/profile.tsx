import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { demoUser } from '@/data/mock/healthProfile';
import { notificationPlaceholders, privacySafetyNotices } from '@/data/mock/testingReadiness';

export default function ProfileScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Profile</AppText>

      <SectionCard>
        <AppText variant="subtitle">Demo User</AppText>
        <AppText variant="body">Age: {demoUser.age}</AppText>
        <AppText variant="body">Goal: {demoUser.goal}</AppText>
        <AppText variant="body">Archetype: {demoUser.archetype}</AppText>
        <AppText variant="body">Profile completion: {demoUser.profileCompletion}%</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">Subscription</AppText>
        <AppText variant="body">Mock active membership. Renewal and expired states are clickable for prototype review.</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">Notification Preferences</AppText>
        {notificationPlaceholders.map((item) => (
          <AppText key={item.id} variant="body">- {item.title}: {item.timing}</AppText>
        ))}
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">Privacy and Safety</AppText>
        {privacySafetyNotices.map((item) => (
          <AppText key={item.id} variant="body">- {item.title}: {item.message}</AppText>
        ))}
      </SectionCard>

      <PrimaryButton label="Edit Personal Profile" onPress={() => router.push('/onboarding/profile')} />
      <PrimaryButton label="Delivery Information" variant="secondary" onPress={() => router.push('/onboarding/delivery')} />
      <PrimaryButton label="14-Day Review" variant="secondary" onPress={() => router.push('/review')} />
      <PrimaryButton label="Subscription Expired State" variant="secondary" onPress={() => router.push('/subscription-expired')} />
      <PrimaryButton label="Clinic" variant="secondary" onPress={() => router.push('/clinic')} />
      <PrimaryButton label="Success Stories" variant="secondary" onPress={() => router.push('/success-stories')} />
    </ScreenContainer>
  );
}
