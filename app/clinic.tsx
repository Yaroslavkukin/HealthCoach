import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionCard } from '@/components/SectionCard';
import { useI18n } from '@/i18n';

export default function ClinicScreen() {
  const { t } = useI18n();

  return (
    <ScreenContainer>
      <ScreenHeader>
        <AppText variant="title">{t('common.clinic')}</AppText>
        <AppText variant="body">{t('clinic.subtitle')}</AppText>
      </ScreenHeader>
      <SectionCard>
        <AppText variant="subtitle">{t('clinic.services')}</AppText>
        <AppText variant="body">{t('clinic.servicesBody')}</AppText>
      </SectionCard>
    </ScreenContainer>
  );
}
