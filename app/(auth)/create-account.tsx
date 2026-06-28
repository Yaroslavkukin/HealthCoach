import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { accessRoutes } from '@/features/access/accessModel';
import { useI18n } from '@/i18n';
import { getCurrentAuthSession, signInWithEmailPassword } from '@/services/authService';
import { getSubscriptionStatus, isSubscriptionStatusCheckFailure } from '@/services/subscription';
import { colors } from '@/theme/colors';

const loginHeaderIllustration = require('../../assets/images/login-header-illustration.png');

export default function CreateAccountScreen() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  async function signIn() {
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setAuthMessage(t('account.missingCredentials'));
      return;
    }

    setIsSigningIn(true);
    setAuthMessage(null);

    const result = await signInWithEmailPassword(cleanEmail, password);

    if (!result.ok) {
      setIsSigningIn(false);
      setAuthMessage(t('account.authError'));
      return;
    }

    let session = result.session;

    if (result.mode === 'supabase') {
      const sessionResult = await getCurrentAuthSession();

      if (!sessionResult.session) {
        setIsSigningIn(false);
        setAuthMessage(t('account.noActiveSession'));
        return;
      }

      session = sessionResult.session;
    }

    const subscriptionStatus = await getSubscriptionStatus(session);
    setIsSigningIn(false);

    if (!subscriptionStatus.active) {
      setAuthMessage(
        t(
          isSubscriptionStatusCheckFailure(subscriptionStatus)
            ? 'account.subscriptionCheckFailed'
            : 'account.subscriptionAccessMissing'
        )
      );
      return;
    }

    router.push(accessRoutes.profile);
  }

  return (
    <SafeAreaView style={styles.screenRoot}>
      <LoginHeader />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          <TextInput
            placeholder={t('account.emailPlaceholder')}
            placeholderTextColor={colors.textSoft}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder={t('account.passwordPlaceholder')}
            placeholderTextColor={colors.textSoft}
            secureTextEntry
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          {authMessage ? <AppText style={styles.authMessage}>{authMessage}</AppText> : null}

          <PrimaryButton
            label="Войти"
            disabled={isSigningIn}
            onPress={isSigningIn ? undefined : () => void signIn()}
            style={[styles.signInButton, isSigningIn && styles.signInButtonDisabled]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LoginHeader() {
  return (
    <View style={styles.headerCard}>
      <View pointerEvents="none" style={styles.headerWave} />
      <View pointerEvents="none" style={styles.headerWaveSoft} />
      <View pointerEvents="none" style={styles.headerIllustrationWrapper}>
        <Image source={loginHeaderIllustration} resizeMode="contain" style={styles.headerIllustration} />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Назад"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.headerAction, pressed && styles.pressedAction]}
      >
        <Ionicons name="chevron-back" size={22} color={colors.textOnPrimary} />
      </Pressable>

      <View style={styles.headerText}>
        <AppText style={styles.headerTitle}>Войти в аккаунт</AppText>
        <AppText style={styles.headerSubtitle}>Введите email и пароль</AppText>
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
  headerCard: {
    height: 82,
    minHeight: 82,
    maxHeight: 82,
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
    marginRight: 0,
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
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 120
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: 18
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    color: colors.text,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderSoft
  },
  authMessage: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 2
  },
  signInButton: {
    marginTop: 12
  },
  signInButtonDisabled: {
    opacity: 0.72
  }
});
