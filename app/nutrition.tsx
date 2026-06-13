import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { demoNutritionMeals } from '@/data/mock/healthProfile';
import { useI18n } from '@/i18n';
import { translateNutritionMeal } from '@/i18n/mockContent';

export default function NutritionScreen() {
  const { t } = useI18n();
  const meals = demoNutritionMeals.map((meal) => translateNutritionMeal(meal, t));

  return (
    <ScreenContainer>
      <AppText variant="title">{t('nutrition.title')}</AppText>
      <AppText variant="body">{t('nutrition.subtitle')}</AppText>

      {meals.map((meal) => (
        <SectionCard key={meal.id}>
          <AppText variant="caption">
            {meal.meal} / {meal.time}
          </AppText>
          <AppText variant="subtitle">{meal.title}</AppText>
          <AppText variant="body">{meal.description}</AppText>
          <AppText variant="caption">{t('nutrition.modify', { modification: meal.modification })}</AppText>
        </SectionCard>
      ))}

      <PrimaryButton label={t('nutrition.askAi')} onPress={() => router.push('/(tabs)/ai')} />
      <PrimaryButton label={t('today.openWeeklyPlan')} variant="secondary" onPress={() => router.push('/weekly-plan')} />
    </ScreenContainer>
  );
}
