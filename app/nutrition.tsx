import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { demoNutritionMeals } from '@/data/mock/healthProfile';
import { colors } from '@/theme/colors';

export default function NutritionScreen() {
  const [selectedMeal, setSelectedMeal] = useState(demoNutritionMeals[0].id);
  const meal = demoNutritionMeals.find((item) => item.id === selectedMeal) ?? demoNutritionMeals[0];

  return (
    <ScreenContainer>
      <AppText variant="title">Nutrition</AppText>
      <AppText variant="body">Food close to nature, minimal processing, no refined sugar.</AppText>

      <StateNotice
        title="Mock nutrition plan"
        message="Meal changes are visual only in this prototype. Personalized nutrition runs through the secure profile flow when available."
        variant="info"
      />

      <View style={styles.mealRow}>
        {demoNutritionMeals.map((item) => (
          <Pressable key={item.id} onPress={() => setSelectedMeal(item.id)} style={[styles.mealChip, selectedMeal === item.id && styles.mealChipActive]}>
            <AppText style={[styles.mealChipText, selectedMeal === item.id && styles.mealChipTextActive]}>{item.meal}</AppText>
          </Pressable>
        ))}
      </View>

      <SectionCard>
        <AppText variant="caption">{meal.time}</AppText>
        <AppText variant="subtitle">{meal.title}</AppText>
        <AppText variant="body">{meal.description}</AppText>
        <AppText variant="caption">Modify: {meal.modification}</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">Nutrition Principles</AppText>
        {['Natural foods', 'Minimally processed foods', 'Nutrient density', 'Avoid refined sugar', 'Bee products only when tolerated'].map((principle) => (
          <AppText key={principle} variant="body">- {principle}</AppText>
        ))}
      </SectionCard>

      <PrimaryButton label="Ask Nutrition AI" onPress={() => router.push('/(tabs)/ai')} />
      <PrimaryButton label="Open Weekly Plan" variant="secondary" onPress={() => router.push('/weekly-plan')} />
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
