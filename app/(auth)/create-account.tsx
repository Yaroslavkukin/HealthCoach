import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, TextInput } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { accessRoutes } from '@/features/access/accessModel';
import { useI18n } from '@/i18n';
import { registerPlaceholderAccount } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

export default function CreateAccountScreen() {
  const { t } = useI18n();
  const [persistenceMessage, setPersistenceMessage] = useState<string | null>(null);

  async function continueWithPlaceholderAccount() {
    const email = 'demo@healthcoach.local';
    const result = await registerPlaceholderAccount(email);
    setPersistenceMessage(result.mode === 'supabase' ? t('account.supabaseSession') : t('account.mockAuth', { email }));
    router.push(accessRoutes.profile);
  }

  return (
    <ScreenContainer>
      <AppText variant="title">{t('account.title')}</AppText>
      <AppText variant="body">{t('account.subtitle')}</AppText>

      <StateNotice
        title={t('account.noticeTitle')}
        message={`${t('account.noticeMessage')} ${persistenceMessage ?? t('account.initialPersistence')}`}
        variant="info"
      />

      <SectionCard>
        <TextInput placeholder={t('account.emailPlaceholder')} placeholderTextColor={colors.textMuted} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
        <TextInput placeholder={t('account.passwordPlaceholder')} placeholderTextColor={colors.textMuted} secureTextEntry style={styles.input} />
        <PrimaryButton label={t('account.createButton')} onPress={continueWithPlaceholderAccount} />
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">{t('account.futureOptions')}</AppText>
        <AppText variant="body">{t('account.futureOptionsBody')}</AppText>
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
