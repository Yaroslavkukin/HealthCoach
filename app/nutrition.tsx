import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { demoNutritionMeals } from '@/data/mock/healthProfile';
import { useI18n } from '@/i18n';
import { translateNutritionMeal } from '@/i18n/mockContent';
import { colors } from '@/theme/colors';
import type { TranslationKey } from '@/i18n/translations/en';

const nutritionPrincipleKeys = [
  'nutrition.principle.natural',
  'nutrition.principle.minimal',
  'nutrition.principle.density',
  'nutrition.principle.sugar',
  'nutrition.principle.bee'
] as const satisfies readonly TranslationKey[];

export default function NutritionScreen() {
  const { t } = useI18n();
  const [selectedMeal, setSelectedMeal] = useState(demoNutritionMeals[0].id);
  const meal = translateNutritionMeal(demoNutritionMeals.find((item) => item.id === selectedMeal) ?? demoNutritionMeals[0], t);

  return (
    <ScreenContainer>
      <AppText variant="title">{t('nutrition.title')}</AppText>
      <AppText variant="body">{t('nutrition.subtitle')}</AppText>

      <StateNotice
        title={t('nutrition.mockTitle')}
        message={t('nutrition.mockMessage')}
        variant="info"
      />

      <View style={styles.mealRow}>
        {demoNutritionMeals.map((item) => (
          <Pressable key={item.id} onPress={() => setSelectedMeal(item.id)} style={[styles.mealChip, selectedMeal === item.id && styles.mealChipActive]}>
            <AppText style={[styles.mealChipText, selectedMeal === item.id && styles.mealChipTextActive]}>{translateNutritionMeal(item, t).meal}</AppText>
          </Pressable>
        ))}
      </View>

      <SectionCard>
        <AppText variant="caption">{meal.time}</AppText>
        <AppText variant="subtitle">{meal.title}</AppText>
        <AppText variant="body">{meal.description}</AppText>
        <AppText variant="caption">{t('nutrition.modify', { modification: meal.modification })}</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">{t('nutrition.principles')}</AppText>
        {nutritionPrincipleKeys.map((principleKey) => (
          <AppText key={principleKey} variant="body">- {t(principleKey)}</AppText>
        ))}
      </SectionCard>

      <PrimaryButton label={t('nutrition.askAi')} onPress={() => router.push('/(tabs)/ai')} />
      <PrimaryButton label={t('today.openWeeklyPlan')} variant="secondary" onPress={() => router.push('/weekly-plan')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  mealRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 16
  },
  mealChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border
  },
  mealChipActive: {
    backgroundColor: colors.accent
  },
  mealChipText: {
    color: colors.textSecondary,
    fontWeight: '800'
  },
  mealChipTextActive: {
    color: colors.background
  }
});
