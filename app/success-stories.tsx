import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';

export default function SuccessStoriesScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Success Stories</AppText>
      {['Energy improved', 'Sleep stabilized', 'Motivation returned'].map((title) => (
        <SectionCard key={title}>
          <AppText variant="subtitle">{title}</AppText>
          <AppText variant="body">Preview story placeholder for trust and motivation.</AppText>
        </SectionCard>
      ))}
    </ScreenContainer>
  );
}
