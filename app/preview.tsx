import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { ScorePill } from '@/components/ScorePill';
import { demoCoreScores } from '@/data/mock/healthProfile';
import { colors } from '@/theme/colors';

export default function PreviewScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Health Coach</AppText>
      <AppText variant="body">Explore the product before registration. This preview uses demo data.</AppText>

      <SectionCard style={styles.heroCard}>
        <AppText variant="caption">Demo Health Score</AppText>
        <AppText variant="metric">82</AppText>
        <AppText variant="body">Good condition</AppText>
      </SectionCard>

      <View style={styles.row}>
        {demoCoreScores.map((score) => (
          <ScorePill key={score.label} score={score} />
        ))}
      </View>

      <SectionCard>
        <AppText variant="subtitle">Demo Archetype</AppText>
        <AppText variant="body">The Strategist</AppText>
        <AppText variant="caption">Driven by progress, clear goals, and measurable improvement.</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">Example AI Insight</AppText>
        <AppText variant="body">
          Today your main focus is recovery. Magnesium, walking, and earlier sleep may support better energy tomorrow.
        </AppText>
      </SectionCard>

      <PrimaryButton label="Start Your Health Journey" onPress={() => router.push('/subscription')} />
      <PrimaryButton label="View Success Stories" variant="secondary" onPress={() => router.push('/success-stories')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    alignItems: 'center',
    backgroundColor: colors.cardElevated
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16
  }
});
