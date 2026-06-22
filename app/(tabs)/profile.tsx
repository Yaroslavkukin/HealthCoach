import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { demoUser } from '@/data/mock/healthProfile';
import { notificationPlaceholders, privacySafetyNotices } from '@/data/mock/testingReadiness';
import { useI18n } from '@/i18n';
import { translateArchetype, translateNotificationTiming, translateUserGoal } from '@/i18n/mockContent';
import type { TranslationKey } from '@/i18n/translations/en';
import { signOutCurrentUser } from '@/services/authService';
import { fetchProfile } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

const profileHeaderIllustration = require('../../assets/images/profile-header-illustration.png');

type StoredProfile = {
  first_name?: unknown;
  last_name?: unknown;
  age?: unknown;
  gender?: unknown;
  main_goal?: unknown;
  profile_completed?: unknown;
};

const notificationTitleKeys: Record<string, TranslationKey> = {
  'morning-plan': 'readiness.notification.morningPlan',
  'supplement-window': 'readiness.notification.supplementWindow',
  'fourteen-day-review': 'readiness.notification.review'
};

const privacyNoticeKeys: Record<string, { title: TranslationKey; message: TranslationKey }> = {
  educational: { title: 'privacy.educationalTitle', message: 'privacy.educationalMessage' },
  'urgent-care': { title: 'privacy.urgentTitle', message: 'privacy.urgentMessage' },
  'data-use': { title: 'privacy.dataTitle', message: 'privacy.dataMessage' }
};

export default function ProfileScreen() {
  const { t } = useI18n();
  const [storedProfile, setStoredProfile] = useState<StoredProfile | null>(null);
  const [signOutMessage, setSignOutMessage] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const result = await fetchProfile();

      if (active && result.ok && result.data) {
        setStoredProfile(result.data);
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

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

  const storedName = [toDisplayText(storedProfile?.first_name), toDisplayText(storedProfile?.last_name)].filter(Boolean).join(' ');
  const usingDemoProfile = !storedName;
  const displayName = storedName || demoUser.firstName;
  const displayAge = toDisplayNumber(storedProfile?.age) ?? demoUser.age;
  const displayGoal = toDisplayText(storedProfile?.main_goal) || translateUserGoal(demoUser.goal, t);
  const displayCompletion = storedProfile?.profile_completed === true ? 100 : demoUser.profileCompletion;

  return (
    <SafeAreaView style={styles.screenRoot}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ProfileHeader title={t('common.profile')} subtitle={t('profile.headerSubtitle')} />

        <View style={styles.contentBody}>
          {signOutMessage ? <StateNotice title={t('profile.signOut')} message={signOutMessage} variant="error" /> : null}
          {usingDemoProfile ? <StateNotice title={t('profile.demoProfileTitle')} message={t('profile.demoProfileMessage')} variant="info" /> : null}

          <SectionCard>
            <AppText variant="subtitle">{displayName}</AppText>
            <AppText variant="body">{t('profile.age', { age: displayAge })}</AppText>
            <AppText variant="body">{t('profile.goal', { goal: displayGoal })}</AppText>
            {toDisplayText(storedProfile?.gender) ? <AppText variant="body">{t('profile.gender', { gender: toDisplayText(storedProfile?.gender) })}</AppText> : null}
            <AppText variant="body">{t('profile.archetype', { archetype: translateArchetype(demoUser.archetype, t) })}</AppText>
            <AppText variant="body">{t('profile.completion', { percent: displayCompletion })}</AppText>
          </SectionCard>

          <SectionCard>
            <AppText variant="subtitle">{t('profile.subscription')}</AppText>
            <AppText variant="body">{t('profile.subscriptionBody')}</AppText>
          </SectionCard>

          <SectionCard>
            <AppText variant="subtitle">{t('profile.notifications')}</AppText>
            {notificationPlaceholders.map((item) => (
              <AppText key={item.id} variant="body">- {t(notificationTitleKeys[item.id])}: {translateNotificationTiming(item.timing, t)}</AppText>
            ))}
          </SectionCard>

          <SectionCard>
            <AppText variant="subtitle">{t('profile.privacySafety')}</AppText>
            {privacySafetyNotices.map((item) => (
              <AppText key={item.id} variant="body">- {t(privacyNoticeKeys[item.id].title)}: {t(privacyNoticeKeys[item.id].message)}</AppText>
            ))}
          </SectionCard>

          <PrimaryButton label={t('profile.settings')} onPress={() => router.push('/settings')} />
          <PrimaryButton label={t('profile.edit')} variant="secondary" onPress={() => router.push('/onboarding/profile')} />
          <PrimaryButton label={t('profile.delivery')} variant="secondary" onPress={() => router.push('/onboarding/delivery')} />
          <PrimaryButton label={t('profile.review')} variant="secondary" onPress={() => router.push('/review')} />
          <PrimaryButton label={t('profile.expired')} variant="secondary" onPress={() => router.push('/subscription-expired')} />
          <PrimaryButton label={t('common.clinic')} variant="secondary" onPress={() => router.push('/clinic')} />
          <PrimaryButton label={t('profile.successStories')} variant="secondary" onPress={() => router.push('/success-stories')} />
          <PrimaryButton label={signingOut ? t('profile.signingOut') : t('profile.signOut')} variant="secondary" onPress={signingOut ? undefined : () => void signOut()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.headerPlaque}>
      <View style={styles.headerText}>
        <View style={styles.headerAccentLine} />
        <AppText adjustsFontSizeToFit minimumFontScale={0.88} numberOfLines={1} style={styles.headerTitle}>
          {title}
        </AppText>
        <AppText numberOfLines={2} style={styles.headerSubtitle}>
          {subtitle}
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

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: colors.background
  },
  scrollContent: {
    paddingTop: 0,
    paddingHorizontal: 0,
    paddingBottom: 120
  },
  contentBody: {
    paddingHorizontal: 20,
    paddingTop: 16
  },
  headerPlaque: {
    width: '100%',
    minHeight: 108,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    overflow: 'hidden'
  },
  headerIllustration: {
    width: 138,
    height: 94,
    marginLeft: 6
  },
  headerText: {
    flex: 1,
    justifyContent: 'center'
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
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '900'
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 20,
    marginTop: 4
  }
});

function toDisplayText(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function toDisplayNumber(value: unknown) {
  return typeof value === 'number' ? value : undefined;
}
