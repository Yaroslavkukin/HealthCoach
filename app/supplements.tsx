import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { SupplementCard } from '@/components/SupplementCard';
import { demoSupplements } from '@/data/mock/healthProfile';
import { useI18n } from '@/i18n';
import { translateSupplement } from '@/i18n/mockContent';

const supplementStack = Array.from(
  new Map(demoSupplements.map((supplement) => [supplement.name.toLowerCase(), supplement])).values()
);

export default function SupplementsScreen() {
  const { t } = useI18n();
  const displaySupplements = supplementStack.map((supplement) => translateSupplement(supplement, t));

  return (
    <ScreenContainer>
      <AppText variant="title">{t('supplements.title')}</AppText>
      <AppText variant="body">{t('supplements.subtitle')}</AppText>

      <AppText variant="subtitle">{t('supplements.stackTitle')}</AppText>
      {supplementStack.map((supplement) => (
        <SupplementCard key={supplement.id} supplement={supplement} />
      ))}

      <SectionCard>
        <AppText variant="subtitle">{t('supplements.scheduleNotes')}</AppText>
        {displaySupplements.map((supplement) => (
          <AppText key={`${supplement.id}-schedule`} variant="caption">
            {supplement.name}: {supplement.foodInstruction}. {supplement.compatibilityNotes}
          </AppText>
        ))}
      </SectionCard>

      <SectionCard>
        <AppText variant="caption">{t('mock.supplement.safety')}</AppText>
      </SectionCard>

      <PrimaryButton label={t('supplements.beeProducts')} onPress={() => router.push('/bee-products')} />
      <PrimaryButton label={t('supplements.backToday')} variant="secondary" onPress={() => router.push('/(tabs)/today')} />
    </ScreenContainer>
  );
}
