import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { demoBeeProducts } from '@/data/mock/healthProfile';

export default function BeeProductsScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Bee Products</AppText>
      <AppText variant="body">Natural optimization tools. Supportive, not medical interventions.</AppText>
      {demoBeeProducts.map((product) => (
        <SectionCard key={product.id}>
          <AppText variant="subtitle">{product.name}</AppText>
          <AppText variant="body">{product.reason}</AppText>
          <AppText variant="caption">How to use: {product.howToUse}</AppText>
          <AppText variant="caption">Expected benefit: {product.expectedBenefit}</AppText>
        </SectionCard>
      ))}
      <SectionCard>
        <AppText variant="caption">Bee products may cause allergic reactions. Avoid them if you have known allergies to bee products or pollen.</AppText>
      </SectionCard>
    </ScreenContainer>
  );
}
