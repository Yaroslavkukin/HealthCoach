import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, TextInput } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { useI18n } from '@/i18n';
import { translatePersistenceMessage } from '@/i18n/mockContent';
import type { TranslationKey } from '@/i18n/translations/en';
import { saveNutritionAssessment, saveOnboardingChecklist } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

type NutritionForm = {
  breakfast: string;
  pattern: string;
  sugar: string;
  water: string;
  fastFood: string;
};

const initialNutritionForm: NutritionForm = {
  breakfast: '',
  pattern: '',
  sugar: '',
  water: '',
  fastFood: ''
};

const nutritionFields = [
  { key: 'breakfast', placeholder: 'onboarding.nutrition.breakfast' },
  { key: 'pattern', placeholder: 'onboarding.nutrition.pattern' },
  { key: 'sugar', placeholder: 'onboarding.nutrition.sugar' },
  { key: 'water', placeholder: 'onboarding.nutrition.water' },
  { key: 'fastFood', placeholder: 'onboarding.nutrition.fastFood' }
] as const satisfies readonly { key: keyof NutritionForm; placeholder: TranslationKey }[];

export default function NutritionAssessmentScreen() {
  const { t } = useI18n();
  const [form, setForm] = useState<NutritionForm>(initialNutritionForm);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [noticeVariant, setNoticeVariant] = useState<'info' | 'error'>('info');

  function updateField(key: keyof NutritionForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveNutritionAndContinue() {
    const assessmentResult = await saveNutritionAssessment({
      breakfast: textOrUndefined(form.breakfast),
      lunchDinnerPattern: textOrUndefined(form.pattern),
      sugarProcessedFood: textOrUndefined(form.sugar),
      waterIntake: textOrUndefined(form.water),
      restaurantFastFood: textOrUndefined(form.fastFood)
    });
    const checklistResult = assessmentResult.ok
      ? await saveOnboardingChecklist({ nutritionCompleted: true })
      : assessmentResult;

    setSaveMessage(translatePersistenceMessage(checklistResult.message, t));
    setNoticeVariant(checklistResult.ok ? 'info' : 'error');

    if (checklistResult.ok) {
      router.push('/onboarding/ai-processing');
    }
  }

  return (
    <ScreenContainer>
      <ScreenHeader>
        <AppText variant="title">{t('onboarding.nutrition.title')}</AppText>
        <AppText variant="body">{t('onboarding.nutrition.subtitle')}</AppText>
      </ScreenHeader>
      <StateNotice title={t('onboarding.nutrition.title')} message={saveMessage ?? t('onboarding.nutrition.initialSave')} variant={noticeVariant} />
      <SectionCard>
        {nutritionFields.map((field) => (
          <TextInput
            key={field.key}
            placeholder={t(field.placeholder)}
            placeholderTextColor={colors.textSoft}
            value={form[field.key]}
            onChangeText={(value) => updateField(field.key, value)}
            multiline
            style={styles.input}
          />
        ))}
        <PrimaryButton label={t('onboarding.nutrition.generate')} onPress={saveNutritionAndContinue} />
      </SectionCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 72,
    backgroundColor: colors.surfaceMuted,
    color: colors.text,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.borderSoft
  }
});

function textOrUndefined(value: string) {
  const text = value.trim();
  return text || undefined;
}
