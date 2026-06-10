import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';

export default function ClinicScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Clinic</AppText>
      <AppText variant="body">Clinic coordination is informational in this prototype. For medical decisions, contact a qualified clinician.</AppText>
      <SectionCard>
        <AppText variant="subtitle">Clinic Services</AppText>
        <AppText variant="body">Choose clinic, book appointment, sync blood test orders, doctor chat.</AppText>
      </SectionCard>
    </ScreenContainer>
  );
}
