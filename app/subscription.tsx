import { useState } from 'react';
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

type SubscriptionPlan = 'monthly' | 'sixMonth';

export default function SubscriptionScreen() {
  const { t } = useI18n();
  const [successfulPlan, setSuccessfulPlan] = useState<SubscriptionPlan | null>(null);

  function showMockPaymentSuccess(plan: SubscriptionPlan) {
    setSuccessfulPlan(plan);
  }

  function continueAfterPaymentSuccess() {
    router.replace(accessRoutes.mainApp);
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

      {successfulPlan ? (
        <SectionCard>
          <AppText variant="subtitle">{t('subscription.paymentSuccessTitle')}</AppText>
          <AppText variant="body">{t('subscription.paymentSuccessMessage')}</AppText>
          <AppText variant="caption">
            {successfulPlan === 'monthly' ? t('subscription.monthly') : t('subscription.sixMonth')}
          </AppText>
          <PrimaryButton label={t('subscription.continueToApp')} onPress={continueAfterPaymentSuccess} />
          <PrimaryButton
            label={t('subscription.changePlan')}
            variant="secondary"
            onPress={() => setSuccessfulPlan(null)}
          />
        </SectionCard>
      ) : (
        <>
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
            <PrimaryButton label={t('subscription.monthlyButton')} onPress={() => showMockPaymentSuccess('monthly')} />
          </SectionCard>

          <SectionCard>
            <AppText variant="subtitle">{t('subscription.sixMonth')}</AppText>
            <AppText variant="metric">15000 ₽</AppText>
            <AppText variant="caption">{t('subscription.sixMonthCaption')}</AppText>
            <PrimaryButton label={t('subscription.sixMonthButton')} onPress={() => showMockPaymentSuccess('sixMonth')} />
          </SectionCard>
        </>
      )}

      <PrimaryButton label={t('subscription.backToPreview')} variant="secondary" onPress={() => router.push(accessRoutes.preview)} />
    </ScreenContainer>
  );
}
