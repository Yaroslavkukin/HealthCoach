import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { useI18n } from '@/i18n';

export default function ClinicScreen() {
  const { t } = useI18n();

  return (
    <ScreenContainer>
      <AppText variant="title">{t('common.clinic')}</AppText>
      <AppText variant="body">{t('clinic.subtitle')}</AppText>
      <SectionCard>
        <AppText variant="subtitle">{t('clinic.services')}</AppText>
        <AppText variant="body">{t('clinic.servicesBody')}</AppText>
      </SectionCard>
    </ScreenContainer>
  );
}
