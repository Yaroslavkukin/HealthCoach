import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionCard } from '@/components/SectionCard';
import { demoSuccessStories } from '@/data/mock/healthProfile';
import { useI18n } from '@/i18n';
import { translateSuccessStory } from '@/i18n/mockContent';

export default function SuccessStoriesScreen() {
  const { t } = useI18n();

  return (
    <ScreenContainer>
      <ScreenHeader>
        <AppText variant="title">{t('success.title')}</AppText>
        <AppText variant="body">{t('success.subtitle')}</AppText>
      </ScreenHeader>

      {demoSuccessStories.map((item) => {
        const story = translateSuccessStory(item, t);

        return (
        <SectionCard key={story.id}>
          <AppText variant="subtitle">{story.title}</AppText>
          <AppText variant="caption">{story.person}</AppText>
          <AppText variant="body">{story.result}</AppText>
        </SectionCard>
        );
      })}

      <PrimaryButton label={t('preview.startJourney')} onPress={() => router.push('/subscription')} />
      <PrimaryButton label={t('subscription.backToPreview')} variant="secondary" onPress={() => router.push('/preview')} />
    </ScreenContainer>
  );
}
