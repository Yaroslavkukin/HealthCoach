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

const lifestylePlaceholders = [
  'onboarding.lifestyle.typicalDay',
  'onboarding.lifestyle.sleepHabits',
  'onboarding.lifestyle.work',
  'onboarding.lifestyle.activity',
  'onboarding.lifestyle.stress'
] as const satisfies readonly TranslationKey[];

export default function LifestyleScreen() {
  const { t } = useI18n();

  async function saveLifestyle() {
    await saveOnboardingChecklist({ lifestyleCompleted: true });
    router.push('/onboarding/nutrition');
  }

  return (
    <ScreenContainer>
      <AppText variant="title">{t('onboarding.lifestyle.title')}</AppText>
      <AppText variant="body">{t('onboarding.lifestyle.subtitle')}</AppText>
      <SectionCard>
        {lifestylePlaceholders.map((placeholder) => (
          <TextInput key={placeholder} placeholder={t(placeholder)} placeholderTextColor={colors.textMuted} multiline style={styles.input} />
        ))}
        <PrimaryButton label={t('onboarding.lifestyle.save')} onPress={saveLifestyle} />
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
