import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { demoUser } from '@/data/mock/healthProfile';
import { notificationPlaceholders, privacySafetyNotices } from '@/data/mock/testingReadiness';
import { useI18n } from '@/i18n';
import { translateArchetype, translateNotificationTiming, translateUserGoal } from '@/i18n/mockContent';
import type { TranslationKey } from '@/i18n/translations/en';

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

  return (
    <ScreenContainer>
      <AppText variant="title">{t('common.profile')}</AppText>

      <SectionCard>
        <AppText variant="subtitle">{t('profile.demoUser')}</AppText>
        <AppText variant="body">{t('profile.age', { age: demoUser.age })}</AppText>
        <AppText variant="body">{t('profile.goal', { goal: translateUserGoal(demoUser.goal, t) })}</AppText>
        <AppText variant="body">{t('profile.archetype', { archetype: translateArchetype(demoUser.archetype, t) })}</AppText>
        <AppText variant="body">{t('profile.completion', { percent: demoUser.profileCompletion })}</AppText>
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
    </ScreenContainer>
  );
}
