import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';

export default function NutritionScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Nutrition</AppText>
      <AppText variant="body">Food close to nature, minimal processing, no refined sugar.</AppText>
      {['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Water'].map((meal) => (
        <SectionCard key={meal}>
          <AppText variant="subtitle">{meal}</AppText>
          <AppText variant="body">AI-generated recommendation placeholder.</AppText>
        </SectionCard>
      ))}
      <PrimaryButton label="Ask Nutrition AI" />
    </ScreenContainer>
  );
}
