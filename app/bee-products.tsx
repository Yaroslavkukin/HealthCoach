import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { demoBeeProducts } from '@/data/mock/healthProfile';
import { router } from 'expo-router';

export default function BeeProductsScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Bee Products</AppText>
      <AppText variant="body">Natural optimization tools. Supportive, not medical interventions.</AppText>

      {demoBeeProducts.map((product, index) => (
        <SectionCard key={product.id}>
          <AppText variant="caption">Priority {index + 1} - {product.priority}</AppText>
          <AppText variant="subtitle">{product.name}</AppText>
          <AppText variant="body">{product.reason}</AppText>
          <AppText variant="caption">How to use: {product.howToUse}</AppText>
          <AppText variant="caption">Expected benefit: {product.expectedBenefit}</AppText>
          <AppText variant="caption">Allergy warning: {product.allergyWarning}</AppText>
        </SectionCard>
      ))}

      <SectionCard>
        <AppText variant="caption">Bee products may cause allergic reactions. Users with allergies should avoid them.</AppText>
      </SectionCard>

      <PrimaryButton label="Open Nutrition" onPress={() => router.push('/nutrition')} />
      <PrimaryButton label="Back to Supplements" variant="secondary" onPress={() => router.push('/supplements')} />
    </ScreenContainer>
  );
}
