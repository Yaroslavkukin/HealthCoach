import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { demoUser } from '@/data/mock/healthProfile';
import { notificationPlaceholders, privacySafetyNotices } from '@/data/mock/testingReadiness';
import { useI18n } from '@/i18n';
import { translateArchetype, translateNotificationTiming, translateUserGoal } from '@/i18n/mockContent';
import type { TranslationKey } from '@/i18n/translations/en';
import { signOutCurrentUser } from '@/services/authService';
import { fetchProfile } from '@/services/phase3Persistence';

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
  const displayName = storedName || t('profile.demoUser');
  const displayAge = toDisplayNumber(storedProfile?.age) ?? demoUser.age;
  const displayGoal = toDisplayText(storedProfile?.main_goal) || translateUserGoal(demoUser.goal, t);
  const displayCompletion = storedProfile?.profile_completed === true ? 100 : demoUser.profileCompletion;

  return (
    <ScreenContainer>
      <ScreenHeader>
        <AppText variant="title">{t('common.profile')}</AppText>
      </ScreenHeader>

      {signOutMessage ? <StateNotice title={t('profile.signOut')} message={signOutMessage} variant="error" /> : null}

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
    </ScreenContainer>
  );
}

function toDisplayText(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function toDisplayNumber(value: unknown) {
  return typeof value === 'number' ? value : undefined;
}
