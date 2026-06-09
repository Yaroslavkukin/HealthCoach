import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';

export default function ClinicScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Clinic</AppText>
      <AppText variant="body">MVP placeholder. Full booking integration is a future feature.</AppText>
      <SectionCard>
        <AppText variant="subtitle">Future Features</AppText>
        <AppText variant="body">Choose clinic, book appointment, sync blood test orders, doctor chat.</AppText>
      </SectionCard>
    </ScreenContainer>
  );
}
