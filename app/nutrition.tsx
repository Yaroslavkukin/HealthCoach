import { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SectionCard } from '@/components/SectionCard';
import { demoNutritionMeals } from '@/data/mock/healthProfile';
import { useI18n } from '@/i18n';
import { translateNutritionMeal } from '@/i18n/mockContent';
import { getLatestNutritionPlan, subscribeToLatestNutritionPlan } from '@/lib/aiClient';
import { colors } from '@/theme/colors';

const nutritionHeaderIllustration = require('../assets/images/nutrition-header-illustration.png');

export default function NutritionScreen() {
  const { t } = useI18n();
  const [nutritionPlan, setNutritionPlan] = useState(getLatestNutritionPlan);
  const isAiGeneratedNutritionPlan = nutritionPlan.source === 'edge';
  const meals = useMemo(() => {
    if (isAiGeneratedNutritionPlan) {
      return nutritionPlan.meals;
    }

    return demoNutritionMeals.map((meal) => translateNutritionMeal(meal, t));
  }, [isAiGeneratedNutritionPlan, nutritionPlan.meals, t]);

  useEffect(() => subscribeToLatestNutritionPlan(setNutritionPlan), []);

  return (
    <SafeAreaView style={styles.screenRoot}>
      <NutritionHeader title={t('nutrition.title')} subtitle={t('nutrition.subtitle')} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {meals.map((meal) => (
          <SectionCard key={meal.id} style={styles.goldOutline}>
            <AppText variant="caption">
              {meal.meal} / {meal.time}
            </AppText>
            <AppText variant="subtitle">{meal.title}</AppText>
            <AppText variant="body">{meal.description}</AppText>
            <AppText variant="caption">{t('nutrition.modify', { modification: meal.modification })}</AppText>
          </SectionCard>
        ))}

        <PrimaryButton
          label={t('nutrition.weeklyRation')}
          variant="secondary"
          onPress={() => router.push('/weekly-ration')}
          backgroundColor={colors.primary}
          textColor={colors.textOnPrimary}
          style={styles.goldOutline}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function NutritionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.headerCard}>
      <View pointerEvents="none" style={styles.headerWave} />
      <View pointerEvents="none" style={styles.headerWaveSoft} />
      <View pointerEvents="none" style={styles.headerIllustrationWrapper}>
        <Image
          source={nutritionHeaderIllustration}
          resizeMode="contain"
          style={styles.headerIllustration}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.headerAction, pressed && styles.pressedAction]}
      >
        <Ionicons name="chevron-back" size={22} color={colors.textOnPrimary} />
      </Pressable>

      <View style={styles.headerText}>
        <AppText numberOfLines={1} style={styles.headerTitle}>{title}</AppText>
        <AppText numberOfLines={2} style={styles.headerSubtitle}>{subtitle}</AppText>
      </View>

      <View style={styles.headerActionSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120
  },
  goldOutline: {
    borderWidth: 1,
    borderColor: colors.accent
  },
  headerCard: {
    minHeight: 82,
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingLeft: 22,
    paddingRight: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowOpacity: 0,
    elevation: 0
  },
  headerWave: {
    position: 'absolute',
    width: 150,
    height: 52,
    borderRadius: 75,
    right: -30,
    bottom: -18,
    backgroundColor: '#DDE8CF',
    opacity: 0.68,
    transform: [{ rotate: '-6deg' }],
    zIndex: 0
  },
  headerWaveSoft: {
    position: 'absolute',
    width: 98,
    height: 36,
    borderRadius: 49,
    right: 26,
    bottom: -12,
    backgroundColor: '#CAD8B8',
    opacity: 0.28,
    transform: [{ rotate: '10deg' }],
    zIndex: 0
  },
  headerIllustrationWrapper: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 124,
    height: 76,
    opacity: 0.82,
    zIndex: 0
  },
  headerIllustration: {
    width: '100%',
    height: '100%'
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent,
    zIndex: 1
  },
  pressedAction: {
    opacity: 0.78
  },
  headerText: {
    flex: 1,
    marginLeft: 14,
    marginRight: 78,
    zIndex: 1
  },
  headerTitle: {
    color: colors.primary,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900'
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  headerActionSpacer: {
    width: 40,
    height: 40,
    zIndex: 1
  }
});
