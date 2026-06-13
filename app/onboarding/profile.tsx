import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, TextInput, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { accessRoutes } from '@/features/access/accessModel';
import { useI18n } from '@/i18n';
import { translatePersistenceMessage } from '@/i18n/mockContent';
import type { TranslationKey } from '@/i18n/translations/en';
import { upsertProfileDraft } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

type ProfileForm = {
  name: string;
  age: string;
  gender: ProfileGender;
  height: string;
  weight: string;
};

type ProfileGender = 'male' | 'female' | '';
type ProfileTextFieldKey = Exclude<keyof ProfileForm, 'gender'>;

const initialProfileForm: ProfileForm = {
  name: '',
  age: '',
  gender: '',
  height: '',
  weight: ''
};

type ProfileField = {
  key: ProfileTextFieldKey;
  placeholder: TranslationKey;
  keyboardType?: 'numeric';
};

const profileFieldsBeforeGender: readonly ProfileField[] = [
  { key: 'name', placeholder: 'onboarding.profile.name' },
  { key: 'age', placeholder: 'onboarding.profile.age', keyboardType: 'numeric' }
];

const profileFieldsAfterGender: readonly ProfileField[] = [
  { key: 'height', placeholder: 'onboarding.profile.height', keyboardType: 'numeric' },
  { key: 'weight', placeholder: 'onboarding.profile.weight', keyboardType: 'numeric' }
];

const genderOptions = [
  { value: 'male', label: 'onboarding.profile.male' },
  { value: 'female', label: 'onboarding.profile.female' }
] as const satisfies readonly { value: Exclude<ProfileGender, ''>; label: TranslationKey }[];

export default function ProfileSetupScreen() {
  const { t } = useI18n();
  const [form, setForm] = useState<ProfileForm>(initialProfileForm);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [noticeVariant, setNoticeVariant] = useState<'info' | 'error'>('info');

  function updateField<Key extends keyof ProfileForm>(key: Key, value: ProfileForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveProfile() {
    const nameParts = splitName(form.name);
    const result = await upsertProfileDraft({
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
      age: parseOptionalNumber(form.age),
      gender: form.gender || 'not_specified',
      heightCm: parseOptionalNumber(form.height),
      weightKg: parseOptionalNumber(form.weight)
    });

    setSaveMessage(translatePersistenceMessage(result.message, t));
    setNoticeVariant(result.ok ? 'info' : 'error');

    if (result.ok) {
      router.push(accessRoutes.delivery);
    }
  }

  return (
    <ScreenContainer>
      <ScreenHeader>
        <AppText variant="title">{t('onboarding.profile.title')}</AppText>
        <AppText variant="body">{t('onboarding.profile.subtitle')}</AppText>
      </ScreenHeader>
      <StateNotice title={t('onboarding.profile.title')} message={saveMessage ?? t('onboarding.profile.initialSave')} variant={noticeVariant} />
      <SectionCard>
        {profileFieldsBeforeGender.map((field) => (
          <TextInput
            key={field.key}
            placeholder={t(field.placeholder)}
            placeholderTextColor={colors.textSoft}
            keyboardType={field.keyboardType}
            value={form[field.key]}
            onChangeText={(value) => updateField(field.key, value)}
            style={styles.input}
          />
        ))}
        <AppText style={styles.fieldLabel}>{t('onboarding.profile.gender')}</AppText>
        <View style={styles.genderRow}>
          {genderOptions.map((option) => {
            const selected = form.gender === option.value;

            return (
              <Pressable key={option.value} onPress={() => updateField('gender', option.value)} style={[styles.genderButton, selected && styles.genderButtonActive]}>
                <AppText style={[styles.genderText, selected && styles.genderTextActive]}>{t(option.label)}</AppText>
              </Pressable>
            );
          })}
        </View>
        {profileFieldsAfterGender.map((field) => (
          <TextInput
            key={field.key}
            placeholder={t(field.placeholder)}
            placeholderTextColor={colors.textSoft}
            keyboardType={field.keyboardType}
            value={form[field.key]}
            onChangeText={(value) => updateField(field.key, value)}
            style={styles.input}
          />
        ))}
        <PrimaryButton label={t('onboarding.profile.continue')} onPress={saveProfile} />
      </SectionCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surfaceMuted,
    color: colors.text,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderSoft
  },
  fieldLabel: {
    color: colors.textMuted,
    fontWeight: '800',
    marginBottom: 8
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4
  },
  genderButton: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSoft
  },
  genderButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.accent
  },
  genderText: {
    color: colors.textMuted,
    fontWeight: '800'
  },
  genderTextActive: {
    color: colors.textOnPrimary
  }
});

function parseOptionalNumber(value: string) {
  const numericValue = Number(value.replace(',', '.').trim());
  return Number.isFinite(numericValue) ? numericValue : undefined;
}

function splitName(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ') || undefined
  };
}
