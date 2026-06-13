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
import { getCurrentAuthSession, signInWithEmailPassword, signUpWithEmailPassword } from '@/services/authService';
import { colors } from '@/theme/colors';

type AuthAction = 'sign-up' | 'sign-in';

export default function CreateAccountScreen() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [persistenceMessage, setPersistenceMessage] = useState<string | null>(null);
  const [noticeVariant, setNoticeVariant] = useState<'info' | 'error'>('info');
  const [loadingAction, setLoadingAction] = useState<AuthAction | null>(null);

  async function runAuthAction(action: AuthAction) {
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setNoticeVariant('error');
      setPersistenceMessage(t('account.missingCredentials'));
      return;
    }

    setLoadingAction(action);
    setNoticeVariant('info');

    const result =
      action === 'sign-up'
        ? await signUpWithEmailPassword(cleanEmail, password)
        : await signInWithEmailPassword(cleanEmail, password);

    setLoadingAction(null);

    if (!result.ok) {
      setNoticeVariant('error');
      setPersistenceMessage(t('account.authError'));
      return;
    }

    if (result.mode === 'supabase') {
      const sessionResult = await getCurrentAuthSession();

      if (!sessionResult.session) {
        setNoticeVariant('error');
        setPersistenceMessage(action === 'sign-up' ? t('account.confirmEmail') : t('account.noActiveSession'));
        return;
      }
    }

    const successMessage =
      result.mode === 'mock'
        ? t('account.mockAuth', { email: cleanEmail })
        : action === 'sign-up'
          ? t('account.createdSupabase')
          : t('account.signedInSupabase');

    setPersistenceMessage(successMessage);
    router.push(accessRoutes.profile);
  }

  return (
    <ScreenContainer>
      <AppText variant="title">{t('account.title')}</AppText>
      <AppText variant="body">{t('account.subtitle')}</AppText>

      <StateNotice
        title={t('account.noticeTitle')}
        message={`${t('account.noticeMessage')} ${persistenceMessage ?? t('account.initialPersistence')}`}
        variant={noticeVariant}
      />

      <SectionCard>
        <TextInput
          placeholder={t('account.emailPlaceholder')}
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder={t('account.passwordPlaceholder')}
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          autoComplete="password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <PrimaryButton
          label={loadingAction === 'sign-up' ? t('account.creating') : t('account.createButton')}
          onPress={loadingAction ? undefined : () => void runAuthAction('sign-up')}
        />
        <PrimaryButton
          label={loadingAction === 'sign-in' ? t('account.signingIn') : t('account.signInButton')}
          variant="secondary"
          onPress={loadingAction ? undefined : () => void runAuthAction('sign-in')}
        />
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
