import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScorePill } from '@/components/ScorePill';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { demoAISummary, demoCoreScores, demoNutritionMeals, demoSupplements, demoUser } from '@/data/mock/healthProfile';
import { accessRoutes, founderAccessRule, getAccessProgressLabel, getAccessStageDescription } from '@/features/access/accessModel';
import { colors } from '@/theme/colors';

export default function PreviewScreen() {
  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <View>
          <AppText variant="title">Health Coach</AppText>
          <AppText variant="body">Explore the product before registration.</AppText>
        </View>
        <View style={styles.demoBadge}>
          <AppText style={styles.demoBadgeText}>Demo Mode</AppText>
        </View>
      </View>

      <StateNotice
        title={getAccessProgressLabel('preview')}
        message={`${getAccessStageDescription('preview')} ${founderAccessRule} No personal health data is stored in this mock prototype.`}
        variant="info"
      />

      <SectionCard style={styles.heroCard}>
        <AppText variant="caption">Demo Health Score</AppText>
        <AppText variant="metric">{demoUser.healthScore}</AppText>
        <AppText variant="body">{demoUser.healthStatus}</AppText>
        <AppText variant="caption">Archetype: {demoUser.archetype}</AppText>
      </SectionCard>

      <View style={styles.row}>
        {demoCoreScores.map((score) => (
          <ScorePill key={score.label} score={score} />
        ))}
      </View>

      <SectionCard>
        <AppText variant="subtitle">Example AI Summary</AppText>
        <AppText variant="body">{demoAISummary.expectedEffect}</AppText>
        <PrimaryButton label="Open Demo AI Summary" variant="secondary" onPress={() => router.push('/onboarding/ai-summary')} />
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">Demo Stack</AppText>
        {demoSupplements.slice(0, 2).map((item) => (
          <AppText key={item.id} variant="body">{item.name}: {item.dosage}</AppText>
        ))}
        <PrimaryButton label="View Demo Supplements" variant="secondary" onPress={() => router.push('/supplements')} />
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">Demo Nutrition</AppText>
        <AppText variant="body">{demoNutritionMeals[0].title}</AppText>
        <AppText variant="caption">{demoNutritionMeals[0].description}</AppText>
        <PrimaryButton label="View Demo Nutrition" variant="secondary" onPress={() => router.push('/nutrition')} />
      </SectionCard>

      <View style={styles.linkGrid}>
        <PrimaryButton label="Demo Today" variant="secondary" onPress={() => router.push('/(tabs)/today')} />
        <PrimaryButton label="Demo My Body" variant="secondary" onPress={() => router.push('/(tabs)/body')} />
        <PrimaryButton label="Success Stories" variant="secondary" onPress={() => router.push('/success-stories')} />
      </View>

      <PrimaryButton label="Start Your Health Journey" onPress={() => router.push(accessRoutes.subscription)} />
      <PrimaryButton label="View Subscription" variant="secondary" onPress={() => router.push(accessRoutes.subscription)} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'flex-start',
    marginBottom: 16
  },
  demoBadge: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  demoBadgeText: {
    color: colors.background,
    fontWeight: '900'
  },
  heroCard: {
    alignItems: 'center',
    backgroundColor: colors.cardElevated
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16
  },
  linkGrid: {
    marginBottom: 4
  }
});
