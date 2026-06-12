import { useState } from 'react';
import { router } from 'expo-router';
import { TextInput, StyleSheet } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { accessRoutes } from '@/features/access/accessModel';
import { useI18n } from '@/i18n';
import { translatePersistenceMessage } from '@/i18n/mockContent';
import type { TranslationKey } from '@/i18n/translations/en';
import { upsertProfileDraft } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

const profilePlaceholders = [
  'onboarding.profile.firstName',
  'onboarding.profile.lastName',
  'onboarding.profile.age',
  'onboarding.profile.gender',
  'onboarding.profile.height',
  'onboarding.profile.weight',
  'onboarding.profile.mainGoal',
  'onboarding.profile.workType',
  'onboarding.profile.activity',
  'onboarding.profile.sleep',
  'onboarding.profile.stress',
  'onboarding.profile.symptoms'
] as const satisfies readonly TranslationKey[];

export default function ProfileSetupScreen() {
  const { t } = useI18n();
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  async function saveProfile() {
    const result = await upsertProfileDraft({
      email: 'demo@healthcoach.local',
      firstName: 'Yaroslav',
      lastName: 'Demo',
      age: 30,
      gender: 'not_specified',
      heightCm: 180,
      weightKg: 78,
      country: 'Russia',
      city: 'Moscow'
    });

    setSaveMessage(translatePersistenceMessage(result.message, t));
    router.push(accessRoutes.delivery);
  }

  return (
    <ScreenContainer>
      <AppText variant="title">{t('onboarding.profile.title')}</AppText>
      <AppText variant="body">{t('onboarding.profile.subtitle')}</AppText>
      <StateNotice title={t('onboarding.profile.title')} message={saveMessage ?? t('onboarding.profile.initialSave')} variant="info" />
      <SectionCard>
        {profilePlaceholders.map((placeholder) => (
          <TextInput key={placeholder} placeholder={t(placeholder)} placeholderTextColor={colors.textMuted} style={styles.input} />
        ))}
        <PrimaryButton label={t('onboarding.profile.continue')} onPress={saveProfile} />
      </SectionCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.cardElevated,
    color: colors.textPrimary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border
  }
});
