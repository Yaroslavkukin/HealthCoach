import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { accessRoutes } from '@/features/access/accessModel';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';

const benefitKeys = [
  'subscription.benefit.personalizedAi',
  'subscription.benefit.today',
  'subscription.benefit.body',
  'subscription.benefit.supplements',
  'subscription.benefit.nutrition',
  'subscription.benefit.blood',
  'subscription.benefit.braverman',
  'subscription.benefit.progress'
] as const;

type SubscriptionPlan = 'monthly' | 'sixMonth';

export default function SubscriptionScreen() {
  const { t } = useI18n();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  function selectDemoPlan(plan: SubscriptionPlan) {
    setSelectedPlan(plan);
  }

  function continueToDemoProfile() {
    router.replace('/(tabs)/profile');
  }

  return (
    <ScreenContainer>
      <ScreenHeader style={styles.greenElement}>
        <AppText variant="title">{t('app.name')}</AppText>
        <AppText variant="body">{t('subscription.subtitle')}</AppText>
      </ScreenHeader>

      <StateNotice
        title={t('nav.subscription')}
        message={t('subscription.noticeMessage')}
        variant="info"
        iconColor={colors.accent}
        backgroundColor={colors.primary}
        titleColor={colors.textOnPrimary}
        messageColor={colors.textOnPrimaryMuted}
        style={styles.greenElement}
      />

      {selectedPlan ? (
        <SectionCard tone="primary" style={styles.greenElement}>
          <AppText variant="subtitle">{t('subscription.planSelectedTitle')}</AppText>
          <AppText variant="body">{t('subscription.planSelectedMessage')}</AppText>
          <AppText variant="caption" style={styles.accentText}>
            {selectedPlan === 'monthly' ? t('subscription.monthly') : t('subscription.sixMonth')}
          </AppText>
          <PrimaryButton
            label={t('subscription.continueToApp')}
            onPress={continueToDemoProfile}
            backgroundColor={colors.primary}
            textColor={colors.textOnPrimary}
            style={styles.greenButton}
          />
          <PrimaryButton
            label={t('subscription.changePlan')}
            variant="secondary"
            onPress={() => setSelectedPlan(null)}
            backgroundColor={colors.primary}
            textColor={colors.textOnPrimary}
            style={styles.greenButton}
          />
        </SectionCard>
      ) : (
        <>
          <SectionCard tone="primary" style={styles.greenElement}>
            <AppText variant="subtitle">{t('subscription.includes')}</AppText>
            {benefitKeys.map((benefitKey) => (
              <AppText key={benefitKey} variant="body">- {t(benefitKey)}</AppText>
            ))}
          </SectionCard>

          <SectionCard tone="primary" style={styles.greenElement}>
            <AppText variant="subtitle">{t('subscription.monthly')}</AppText>
            <AppText variant="metric" style={styles.priceText}>3,000 RUB/month</AppText>
            <AppText variant="caption">{t('subscription.monthlyCaption')}</AppText>
            <PrimaryButton
              label={t('subscription.monthlyButton')}
              onPress={() => selectDemoPlan('monthly')}
              backgroundColor={colors.primary}
              textColor={colors.textOnPrimary}
              style={styles.greenButton}
            />
          </SectionCard>

          <SectionCard tone="primary" style={styles.greenElement}>
            <AppText variant="subtitle">{t('subscription.sixMonth')}</AppText>
            <AppText variant="metric" style={styles.priceText}>15,000 RUB/6 months</AppText>
            <AppText variant="caption">{t('subscription.sixMonthCaption')}</AppText>
            <PrimaryButton
              label={t('subscription.sixMonthButton')}
              onPress={() => selectDemoPlan('sixMonth')}
              backgroundColor={colors.primary}
              textColor={colors.textOnPrimary}
              style={styles.greenButton}
            />
          </SectionCard>
        </>
      )}

      <PrimaryButton
        label={t('subscription.backToPreview')}
        variant="secondary"
        onPress={() => router.push(accessRoutes.preview)}
        backgroundColor={colors.primary}
        textColor={colors.textOnPrimary}
        style={styles.greenButton}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  greenElement: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent
  },
  greenButton: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent
  },
  priceText: {
    color: colors.accent
  },
  accentText: {
    color: colors.accent,
    fontWeight: '800'
  }
});
