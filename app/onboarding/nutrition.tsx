import { router } from 'expo-router';
import { StyleSheet, TextInput } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { useI18n } from '@/i18n';
import type { TranslationKey } from '@/i18n/translations/en';
import { saveOnboardingChecklist } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

const nutritionPlaceholders = [
  'onboarding.nutrition.breakfast',
  'onboarding.nutrition.pattern',
  'onboarding.nutrition.sugar',
  'onboarding.nutrition.water',
  'onboarding.nutrition.fastFood'
] as const satisfies readonly TranslationKey[];

export default function NutritionAssessmentScreen() {
  const { t } = useI18n();

  async function saveNutritionAndContinue() {
    await saveOnboardingChecklist({ nutritionCompleted: true });
    router.push('/onboarding/ai-processing');
  }

  return (
    <ScreenContainer>
      <AppText variant="title">{t('onboarding.nutrition.title')}</AppText>
      <AppText variant="body">{t('onboarding.nutrition.subtitle')}</AppText>
      <SectionCard>
        {nutritionPlaceholders.map((placeholder) => (
          <TextInput key={placeholder} placeholder={t(placeholder)} placeholderTextColor={colors.textMuted} multiline style={styles.input} />
        ))}
        <PrimaryButton label={t('onboarding.nutrition.generate')} onPress={saveNutritionAndContinue} />
      </SectionCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 72,
    backgroundColor: colors.cardElevated,
    color: colors.textPrimary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border
  }
});
