import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';

export default function BloodUploadScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Blood Analysis</AppText>
      <AppText variant="body">Upload PDF, image, or enter biomarkers manually.</AppText>

      <SectionCard>
        <AppText variant="subtitle">Preparation Guide</AppText>
        <AppText variant="body">Avoid intense training, emotional overload, overeating, and poor sleep before testing. Repeat tests at the same time of day when tracking progress.</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">Supported Packages</AppText>
        <AppText variant="body">Male: Foundation, Advanced, Complete</AppText>
        <AppText variant="body">Female: Foundation, Complete</AppText>
      </SectionCard>

      <PrimaryButton label="Upload File" />
      <PrimaryButton label="Continue to Braverman" variant="secondary" onPress={() => router.push('/onboarding/braverman')} />
    </ScreenContainer>
  );
}
