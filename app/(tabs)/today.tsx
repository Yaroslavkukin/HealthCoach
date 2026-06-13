import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScorePill } from '@/components/ScorePill';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { TaskItem } from '@/components/TaskItem';
import { demoCoreScores, demoTasks, demoUser } from '@/data/mock/healthProfile';
import { useI18n } from '@/i18n';
import { translateHealthStatus, translatePersistenceMessage } from '@/i18n/mockContent';
import { saveDailyTaskStatus } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

export default function TodayScreen() {
  const { t } = useI18n();
  const [tasks, setTasks] = useState(demoTasks);
  const [taskSaveMessage, setTaskSaveMessage] = useState<string | null>(null);
  const completed = tasks.filter((task) => task.completed).length;
  const progress = Math.round((completed / tasks.length) * 100);

  function toggleTask(id: string) {
    const currentTask = tasks.find((task) => task.id === id);

    setTasks((current) =>
      current.map((task) => {
        if (task.id !== id) {
          return task;
        }

        return { ...task, completed: !task.completed };
      })
    );

    if (currentTask) {
      void saveDailyTaskStatus({ ...currentTask, completed: !currentTask.completed }).then((result) => {
        setTaskSaveMessage(translatePersistenceMessage(result.message, t));
      });
    }
  }

  return (
    <ScreenContainer>
      <AppText variant="title">{t('common.today')}</AppText>
      <AppText variant="body">{t('today.greeting', { name: demoUser.firstName })}</AppText>

      <SectionCard style={styles.heroCard}>
        <AppText variant="caption">{t('today.overallScore')}</AppText>
        <AppText variant="metric">{demoUser.healthScore}</AppText>
        <AppText variant="body">{translateHealthStatus(demoUser.healthStatus, t)}</AppText>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <AppText variant="caption">{t('today.completedCount', { completed, total: tasks.length })}</AppText>
      </SectionCard>

      <View style={styles.scoreRow}>
        {demoCoreScores.map((score) => <ScorePill key={score.label} score={score} />)}
      </View>

      <SectionCard>
        <AppText variant="subtitle">{t('today.plan')}</AppText>
        <StateNotice title={t('today.taskStorage')} message={taskSaveMessage ?? t('today.mockTaskStorage')} variant="info" />
        {tasks.map((task) => <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id)} />)}
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">{t('today.aiInsight')}</AppText>
        <AppText variant="body">{t('today.aiInsightBody')}</AppText>
      </SectionCard>

      <PrimaryButton label={t('today.openWeeklyPlan')} onPress={() => router.push('/weekly-plan')} />
      <PrimaryButton label={t('common.askAi')} variant="secondary" onPress={() => router.push('/(tabs)/ai')} />
      <PrimaryButton label={t('today.openSupplements')} variant="secondary" onPress={() => router.push('/supplements')} />
      <PrimaryButton label={t('today.openNutrition')} variant="secondary" onPress={() => router.push('/nutrition')} />
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
