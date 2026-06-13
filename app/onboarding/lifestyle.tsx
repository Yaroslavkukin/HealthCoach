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
import { saveLifestyleAssessment, saveOnboardingChecklist } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

type LifestyleForm = {
  typicalDay: string;
  sleepHabits: string;
  work: string;
  activity: string;
  stress: string;
};

const initialLifestyleForm: LifestyleForm = {
  typicalDay: '',
  sleepHabits: '',
  work: '',
  activity: '',
  stress: ''
};

const lifestyleFields = [
  { key: 'typicalDay', placeholder: 'onboarding.lifestyle.typicalDay' },
  { key: 'sleepHabits', placeholder: 'onboarding.lifestyle.sleepHabits' },
  { key: 'work', placeholder: 'onboarding.lifestyle.work' },
  { key: 'activity', placeholder: 'onboarding.lifestyle.activity' },
  { key: 'stress', placeholder: 'onboarding.lifestyle.stress' }
] as const satisfies readonly { key: keyof LifestyleForm; placeholder: TranslationKey }[];

export default function LifestyleScreen() {
  const { t } = useI18n();
  const [form, setForm] = useState<LifestyleForm>(initialLifestyleForm);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [noticeVariant, setNoticeVariant] = useState<'info' | 'error'>('info');

  function updateField(key: keyof LifestyleForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveLifestyle() {
    const assessmentResult = await saveLifestyleAssessment({
      typicalDay: textOrUndefined(form.typicalDay),
      sleepHabits: textOrUndefined(form.sleepHabits),
      workSchedule: textOrUndefined(form.work),
      activity: textOrUndefined(form.activity),
      stress: textOrUndefined(form.stress)
    });
    const checklistResult = assessmentResult.ok
      ? await saveOnboardingChecklist({ lifestyleCompleted: true })
      : assessmentResult;

    setSaveMessage(translatePersistenceMessage(checklistResult.message, t));
    setNoticeVariant(checklistResult.ok ? 'info' : 'error');

    if (checklistResult.ok) {
      router.push('/onboarding/nutrition');
    }
  }

  return (
    <ScreenContainer>
      <ScreenHeader>
        <AppText variant="title">{t('onboarding.lifestyle.title')}</AppText>
        <AppText variant="body">{t('onboarding.lifestyle.subtitle')}</AppText>
      </ScreenHeader>
      <StateNotice title={t('onboarding.lifestyle.title')} message={saveMessage ?? t('onboarding.lifestyle.initialSave')} variant={noticeVariant} />
      <SectionCard>
        {lifestyleFields.map((field) => (
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
        <PrimaryButton label={t('onboarding.lifestyle.save')} onPress={saveLifestyle} />
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
