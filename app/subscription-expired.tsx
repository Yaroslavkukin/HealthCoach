import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { useI18n } from '@/i18n';

export default function SubscriptionExpiredScreen() {
  const { t } = useI18n();

  return (
    <ScreenContainer>
      <AppText variant="title">{t('expired.title')}</AppText>
      <AppText variant="body">{t('expired.subtitle')}</AppText>

      <StateNotice
        title={t('expired.noticeTitle')}
        message={t('expired.noticeMessage')}
        variant="error"
      />

      <SectionCard>
        <AppText variant="subtitle">{t('expired.available')}</AppText>
        <AppText variant="body">- {t('expired.availablePreview')}</AppText>
        <AppText variant="body">- {t('expired.availableStories')}</AppText>
        <AppText variant="body">- {t('expired.availableSubscription')}</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">{t('expired.locked')}</AppText>
        <AppText variant="body">- {t('expired.lockedPlans')}</AppText>
        <AppText variant="body">- {t('expired.lockedAssistant')}</AppText>
        <AppText variant="body">- {t('expired.lockedReview')}</AppText>
      </SectionCard>

      <PrimaryButton label={t('expired.renew')} onPress={() => router.push('/subscription')} />
      <PrimaryButton label={t('expired.openPreview')} variant="secondary" onPress={() => router.push('/preview')} />
    </ScreenContainer>
  );
}
