import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { accessRoutes } from '@/features/access/accessModel';
import { useI18n } from '@/i18n';
import { signOutCurrentUser } from '@/services/authService';
import { colors } from '@/theme/colors';

const profileHeaderIllustration = require('../../assets/images/profile-header-illustration.png');
const profileAlexeyCard = require('../../assets/images/profile-alexey-card.png');

const referenceMutedText = '#6F7E70';
const referenceCream = '#FFF9EF';

export default function ProfileScreen() {
  const { t } = useI18n();
  const [signOutMessage, setSignOutMessage] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

  async function signOut() {
    setSigningOut(true);
    const result = await signOutCurrentUser();
    setSigningOut(false);

    if (!result.ok) {
      setSignOutMessage(t('profile.signOutError'));
      return;
    }

    router.replace('/preview');
  }

  return (
    <SafeAreaView style={styles.screenRoot}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ProfileHeader />
        <DemoNotice />

        <View style={styles.contentBody}>
          <ProfileCard />
          <ProfileQuickActions />
          <SettingsSection
            expanded={isSettingsExpanded}
            onDelivery={() => router.push('/onboarding/delivery')}
            onEditProfile={() => router.push('/onboarding/profile')}
            onSafety={() => router.push('/security')}
            onSignIn={() => router.push(accessRoutes.createAccount)}
            onSignOut={() => void signOut()}
            onToggle={() => setIsSettingsExpanded((current) => !current)}
            signOutMessage={signOutMessage}
            signingOut={signingOut}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileHeader() {
  return (
    <View style={styles.headerPlaque}>
      <View style={styles.headerText}>
        <View style={styles.headerAccentLine} />
        <AppText style={styles.headerTitle}>Профиль</AppText>
        <AppText style={styles.headerSubtitle}>
          Ваши данные, настройки и{'\n'}
          прогресс в одном месте.
        </AppText>
      </View>

      <Image
        source={profileHeaderIllustration}
        resizeMode="contain"
        style={styles.headerIllustration}
      />
    </View>
  );
}

function DemoNotice() {
  return (
    <View style={styles.demoNotice}>
      <View style={styles.demoInfoIcon}>
        <Ionicons name="information" size={18} color={colors.accent} />
      </View>

      <View style={styles.demoNoticeText}>
        <AppText style={styles.demoNoticeTitle}>Демо-профиль</AppText>
        <AppText style={styles.demoNoticeBody}>
          Показан пример заполнения для Алексея.{'\n'}
          После подключения аккаунта рекомендации{'\n'}
          будут строиться на ваших данных.
        </AppText>
      </View>
    </View>
  );
}

function ProfileCard() {
  return (
    <View style={styles.alexeyCardFrame}>
      <Image
        accessible
        accessibilityLabel="Демо-профиль Алексей: возраст 30, цель повысить энергию и восстановление, архетип Исследователь."
        resizeMode="contain"
        source={profileAlexeyCard}
        style={styles.alexeyCardImage}
      />
    </View>
  );
}

function ProfileQuickActions() {
  return (
    <View style={styles.profileQuickActions}>
      <ProfileQuickActionButton
        icon="medkit-outline"
        label="Клиника"
        onPress={() => router.push('/clinic')}
      />
      <ProfileQuickActionButton
        icon="checkbox-outline"
        label="Стартовый чеклист"
        onPress={() => router.push('/onboarding/start-checklist')}
      />
    </View>
  );
}

function ProfileQuickActionButton({
  icon,
  label,
  onPress
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.profileQuickActionButton,
        pressed && styles.profileQuickActionButtonPressed
      ]}
    >
      <Ionicons name={icon} size={18} color={colors.textOnPrimary} />
      <AppText style={styles.profileQuickActionText}>{label}</AppText>
    </Pressable>
  );
}

function SettingsSection({
  expanded,
  onDelivery,
  onEditProfile,
  onSafety,
  onSignIn,
  onSignOut,
  onToggle,
  signOutMessage,
  signingOut
}: {
  expanded: boolean;
  onDelivery: () => void;
  onEditProfile: () => void;
  onSafety: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
  onToggle: () => void;
  signOutMessage: string | null;
  signingOut: boolean;
}) {
  return (
    <View style={styles.settingsSection}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Настройки"
        accessibilityState={{ expanded }}
        onPress={onToggle}
        style={({ pressed }) => [styles.settingsButton, pressed && styles.settingsButtonPressed]}
      >
        <Ionicons name="settings-outline" size={20} color={colors.textOnPrimary} />
        <AppText style={styles.settingsButtonText}>Настройки</AppText>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textOnPrimary} />
      </Pressable>

      {expanded ? (
        <View style={styles.settingsPanel}>
          {signOutMessage ? <AppText style={styles.signOutError}>{signOutMessage}</AppText> : null}
          <SettingsActionRow icon="person-circle-outline" label="Войти в аккаунт" onPress={onSignIn} />
          <SettingsActionRow icon="create-outline" label="Редактировать профиль" onPress={onEditProfile} />
          <SettingsActionRow icon="cube-outline" label="Доставка" onPress={onDelivery} />
          <SettingsActionRow icon="shield-checkmark-outline" label="Документы" onPress={onSafety} />
          <SettingsActionRow
            icon="log-out-outline"
            label={signingOut ? 'Выходим...' : 'Выйти'}
            onPress={signingOut ? undefined : onSignOut}
          />
        </View>
      ) : null}
    </View>
  );
}

function SettingsActionRow({
  icon,
  label,
  onPress
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.settingsActionRow, pressed && onPress && styles.settingsActionRowPressed]}
    >
      <Ionicons name={icon} size={18} color={colors.primary} />
      <AppText style={styles.settingsActionText}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: colors.background
  },
  scrollContent: {
    paddingTop: 0,
    paddingHorizontal: 0,
    paddingBottom: 150
  },
  headerPlaque: {
    width: '100%',
    height: 112,
    minHeight: 108,
    backgroundColor: referenceCream,
    borderWidth: 1,
    borderColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 0,
    overflow: 'hidden'
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    paddingRight: 8
  },
  headerAccentLine: {
    width: 52,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginBottom: 8
  },
  headerTitle: {
    color: colors.primary,
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 30,
    lineHeight: 36,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0.35, height: 0 },
    textShadowRadius: 0.2
  },
  headerSubtitle: {
    color: referenceMutedText,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '500',
    marginTop: 5
  },
  headerIllustration: {
    width: 138,
    height: 100,
    marginLeft: 4
  },
  demoNotice: {
    width: '100%',
    marginTop: 8,
    height: 108,
    minHeight: 108,
    maxHeight: 108,
    backgroundColor: referenceCream,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    shadowColor: '#6D5930',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 3
  },
  demoInfoIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18
  },
  demoNoticeText: {
    flex: 1,
    minWidth: 0
  },
  demoNoticeTitle: {
    color: colors.primary,
    fontSize: 19,
    lineHeight: 23,
    fontWeight: '900',
    marginBottom: 3
  },
  demoNoticeBody: {
    color: referenceMutedText,
    fontSize: 14,
    lineHeight: 18
  },
  contentBody: {
    alignItems: 'center',
    paddingHorizontal: 23,
    paddingTop: 6
  },
  alexeyCardFrame: {
    width: '100%',
    maxWidth: 370,
    alignSelf: 'center',
    aspectRatio: 770 / 1304
  },
  alexeyCardImage: {
    width: '100%',
    height: '100%'
  },
  profileQuickActions: {
    width: '100%',
    maxWidth: 370,
    gap: 6,
    marginTop: 6
  },
  profileQuickActionButton: {
    width: '100%',
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 2
  },
  profileQuickActionButtonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }]
  },
  profileQuickActionText: {
    color: colors.textOnPrimary,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900'
  },
  settingsSection: {
    width: '100%',
    maxWidth: 370,
    marginTop: 6
  },
  settingsButton: {
    width: '100%',
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 18,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 3
  },
  settingsButtonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }]
  },
  settingsButtonText: {
    flex: 1,
    color: colors.textOnPrimary,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
    textAlign: 'center'
  },
  settingsPanel: {
    width: '100%',
    gap: 6,
    marginTop: 6
  },
  settingsActionRow: {
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: referenceCream,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14
  },
  settingsActionRowPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }]
  },
  settingsActionText: {
    color: colors.primary,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800'
  },
  signOutError: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10
  }
});
