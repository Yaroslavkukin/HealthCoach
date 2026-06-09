import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScorePill } from '@/components/ScorePill';
import { SectionCard } from '@/components/SectionCard';
import { TaskItem } from '@/components/TaskItem';
import { demoCoreScores, demoTasks } from '@/data/mock/healthProfile';
import { colors } from '@/theme/colors';

export default function TodayScreen() {
  const completed = demoTasks.filter((task) => task.completed).length;

  return (
    <ScreenContainer>
      <AppText variant="title">Today</AppText>
      <AppText variant="body">Good morning. Here is what matters today.</AppText>

      <SectionCard style={styles.heroCard}>
        <AppText variant="caption">Health Score</AppText>
        <AppText variant="metric">82</AppText>
        <AppText variant="body">Good condition</AppText>
      </SectionCard>

      <View style={styles.scoreRow}>
        {demoCoreScores.map((score) => <ScorePill key={score.label} score={score} />)}
      </View>

      <SectionCard>
        <AppText variant="subtitle">Today’s Plan</AppText>
        <AppText variant="caption">Completed: {completed} of {demoTasks.length}</AppText>
        {demoTasks.map((task) => <TaskItem key={task.id} task={task} />)}
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">AI Insight</AppText>
        <AppText variant="body">Your main focus today is recovery. Follow the supplement schedule and avoid late stimulation.</AppText>
      </SectionCard>

      <PrimaryButton label="Open Weekly Plan" onPress={() => router.push('/weekly-plan')} />
      <PrimaryButton label="Supplements" variant="secondary" onPress={() => router.push('/supplements')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: { alignItems: 'center', backgroundColor: colors.cardElevated },
  scoreRow: { flexDirection: 'row', gap: 10, marginBottom: 16 }
});
