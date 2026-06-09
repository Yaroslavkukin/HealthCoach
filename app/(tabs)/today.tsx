import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScorePill } from '@/components/ScorePill';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { TaskItem } from '@/components/TaskItem';
import { demoCoreScores, demoTasks, demoUser } from '@/data/mock/healthProfile';
import { colors } from '@/theme/colors';

export default function TodayScreen() {
  const [tasks, setTasks] = useState(demoTasks);
  const completed = tasks.filter((task) => task.completed).length;
  const progress = Math.round((completed / tasks.length) * 100);

  function toggleTask(id: string) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  }

  return (
    <ScreenContainer>
      <AppText variant="title">Today</AppText>
      <AppText variant="body">Good morning, {demoUser.firstName}. Here is what matters today.</AppText>

      <SectionCard style={styles.heroCard}>
        <AppText variant="caption">Overall Health Score</AppText>
        <AppText variant="metric">{demoUser.healthScore}</AppText>
        <AppText variant="body">{demoUser.healthStatus}</AppText>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <AppText variant="caption">Completed: {completed} of {tasks.length}</AppText>
      </SectionCard>

      <View style={styles.scoreRow}>
        {demoCoreScores.map((score) => <ScorePill key={score.label} score={score} />)}
      </View>

      <SectionCard>
        <AppText variant="subtitle">Today’s Plan</AppText>
        {tasks.map((task) => <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id)} />)}
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">AI Insight</AppText>
        <AppText variant="body">Today, your main focus is recovery. Magnesium and walking may help reduce stress and improve tomorrow’s energy.</AppText>
      </SectionCard>

      <PrimaryButton label="Open Weekly Plan" onPress={() => router.push('/weekly-plan')} />
      <PrimaryButton label="Ask AI" variant="secondary" onPress={() => router.push('/(tabs)/ai')} />
      <PrimaryButton label="Open Supplement Schedule" variant="secondary" onPress={() => router.push('/supplements')} />
      <PrimaryButton label="Open Nutrition" variant="secondary" onPress={() => router.push('/nutrition')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    alignItems: 'center',
    backgroundColor: colors.cardElevated
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16
  },
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 12,
    marginBottom: 8
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent
  }
});
