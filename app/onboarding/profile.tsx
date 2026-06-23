import { useState } from 'react';
import { Pressable, TextInput, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { useI18n } from '@/i18n';
import type { TranslationKey } from '@/i18n/translations/en';
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

  function updateField<Key extends keyof ProfileForm>(key: Key, value: ProfileForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <ScreenContainer>
      <ScreenHeader>
        <AppText variant="title">{t('onboarding.profile.title')}</AppText>
        <AppText variant="body">{t('onboarding.profile.subtitle')}</AppText>
      </ScreenHeader>
      <StateNotice title={t('onboarding.profile.title')} message={t('onboarding.profile.initialSave')} variant="info" />
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
