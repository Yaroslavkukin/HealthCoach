import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { accessRoutes } from '@/features/access/accessModel';
import { useI18n } from '@/i18n';

const benefitKeys = [
  'subscription.benefit.personalizedAi',
  'subscription.benefit.blood',
  'subscription.benefit.braverman',
  'subscription.benefit.supplements',
  'subscription.benefit.nutrition',
  'subscription.benefit.progress'
] as const;

export default function SubscriptionScreen() {
  const { t } = useI18n();

  function continueWithMockSubscription() {
    router.push(accessRoutes.createAccount);
  }

  return (
    <ScreenContainer>
      <AppText variant="title">{t('app.name')}</AppText>
      <AppText variant="body">{t('subscription.subtitle')}</AppText>

      <StateNotice
        title={t('subscription.noticeTitle')}
        message={t('subscription.noticeMessage')}
        variant="info"
      />

      <SectionCard>
        <AppText variant="subtitle">{t('subscription.includes')}</AppText>
        {benefitKeys.map((benefitKey) => (
          <AppText key={benefitKey} variant="body">- {t(benefitKey)}</AppText>
        ))}
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">{t('subscription.monthly')}</AppText>
        <AppText variant="metric">3000 ₽</AppText>
        <AppText variant="caption">{t('common.month')}</AppText>
        <PrimaryButton label={t('subscription.monthlyButton')} onPress={continueWithMockSubscription} />
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">{t('subscription.sixMonth')}</AppText>
        <AppText variant="metric">15000 ₽</AppText>
        <AppText variant="caption">{t('subscription.sixMonthCaption')}</AppText>
        <PrimaryButton label={t('subscription.sixMonthButton')} onPress={continueWithMockSubscription} />
      </SectionCard>

      <PrimaryButton label={t('subscription.backToPreview')} variant="secondary" onPress={() => router.push(accessRoutes.preview)} />
    </ScreenContainer>
  );
}
