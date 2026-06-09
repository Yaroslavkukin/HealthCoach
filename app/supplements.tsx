import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { SupplementCard } from '@/components/SupplementCard';
import { demoSupplements } from '@/data/mock/healthProfile';

export default function SupplementsScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Supplements</AppText>
      <AppText variant="body">Essential stack first. Complete stack is optional.</AppText>
      {demoSupplements.map((supplement) => <SupplementCard key={supplement.id} supplement={supplement} />)}
      <SectionCard>
        <AppText variant="caption">Before starting any supplement protocol, consult a qualified healthcare professional, especially if you have medical conditions, take medication, are pregnant, breastfeeding, or have allergies.</AppText>
      </SectionCard>
      <PrimaryButton label="Bee Product Optimization" onPress={() => router.push('/bee-products')} />
    </ScreenContainer>
  );
}
