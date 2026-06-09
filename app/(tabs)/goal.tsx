import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { colors } from '@/theme/colors';

const milestones = [
  { label: 'Blood analysis uploaded', status: 'Completed' },
  { label: 'Braverman assessment', status: 'Completed' },
  { label: '7-day plan execution', status: 'In progress' },
  { label: '14-day review', status: 'Pending' },
  { label: 'Control blood analysis', status: 'Future' }
];

export default function GoalScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Goal Journey</AppText>
      <SectionCard>
        <AppText variant="caption">90-Day Goal</AppText>
        <AppText variant="subtitle">Increase Energy and Recovery</AppText>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
        <AppText variant="body">Progress: 56%</AppText>
        <AppText variant="caption">Magnesium, walking, protein breakfast, and sleep timing all support this goal.</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">Milestone Timeline</AppText>
        {milestones.map((milestone, index) => (
          <View key={milestone.label} style={styles.milestone}>
            <View style={styles.dot}><AppText style={styles.dotText}>{index + 1}</AppText></View>
            <View style={styles.milestoneText}>
              <AppText style={styles.milestoneTitle}>{milestone.label}</AppText>
              <AppText variant="caption">{milestone.status}</AppText>
            </View>
          </View>
        ))}
      </SectionCard>

      <PrimaryButton label="View Related Plan" onPress={() => router.push('/weekly-plan')} />
      <PrimaryButton label="Ask AI about Goal" variant="secondary" onPress={() => router.push('/(tabs)/ai')} />
      <PrimaryButton label="Open 14-Day Review" variant="secondary" onPress={() => router.push('/review')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  progressTrack: {
    height: 10,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 999,
    overflow: 'hidden',
    marginVertical: 12
  },
  progressFill: {
    width: '56%',
    height: '100%',
    backgroundColor: colors.accent
  },
  milestone: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dotText: {
    color: colors.accent,
    fontWeight: '900'
  },
  milestoneText: {
    flex: 1
  },
  milestoneTitle: {
    color: colors.textPrimary,
    fontWeight: '800'
  }
});
