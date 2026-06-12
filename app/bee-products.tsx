import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { demoBeeProducts } from '@/data/mock/healthProfile';
import { useI18n } from '@/i18n';
import { translateBeeProduct, translateSimpleLabel } from '@/i18n/mockContent';
import { router } from 'expo-router';

export default function BeeProductsScreen() {
  const { t } = useI18n();

  return (
    <ScreenContainer>
      <AppText variant="title">{t('bee.title')}</AppText>
      <AppText variant="body">{t('bee.subtitle')}</AppText>

      {demoBeeProducts.map((item, index) => {
        const product = translateBeeProduct(item, t);

        return (
        <SectionCard key={product.id}>
          <AppText variant="caption">{t('bee.priority', { priority: index + 1, status: translateSimpleLabel(product.priority, t) })}</AppText>
          <AppText variant="subtitle">{product.name}</AppText>
          <AppText variant="body">{product.reason}</AppText>
          <AppText variant="caption">{t('bee.howToUse', { value: product.howToUse })}</AppText>
          <AppText variant="caption">{t('bee.expectedBenefit', { value: product.expectedBenefit })}</AppText>
          <AppText variant="caption">{t('bee.allergyWarning', { value: product.allergyWarning ?? '' })}</AppText>
        </SectionCard>
        );
      })}

      <SectionCard>
        <AppText variant="caption">{t('bee.safety')}</AppText>
      </SectionCard>

      <PrimaryButton label={t('bee.openNutrition')} onPress={() => router.push('/nutrition')} />
      <PrimaryButton label={t('bee.backSupplements')} variant="secondary" onPress={() => router.push('/supplements')} />
    </ScreenContainer>
  );
}
