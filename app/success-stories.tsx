import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { demoSuccessStories } from '@/data/mock/healthProfile';

export default function SuccessStoriesScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Success Stories</AppText>
      <AppText variant="body">Preview stories use fictional demo data for trust-building only.</AppText>

      {demoSuccessStories.map((story) => (
        <SectionCard key={story.id}>
          <AppText variant="subtitle">{story.title}</AppText>
          <AppText variant="caption">{story.person}</AppText>
          <AppText variant="body">{story.result}</AppText>
        </SectionCard>
      ))}

      <PrimaryButton label="Start Your Health Journey" onPress={() => router.push('/subscription')} />
      <PrimaryButton label="Back to Preview" variant="secondary" onPress={() => router.push('/preview')} />
    </ScreenContainer>
  );
}
