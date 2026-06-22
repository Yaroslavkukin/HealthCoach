import { useState } from 'react';
import { router } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScorePill } from '@/components/ScorePill';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { TaskItem } from '@/components/TaskItem';
import { demoCoreScores, demoTasks, demoUser } from '@/data/mock/healthProfile';
import { useI18n } from '@/i18n';
import { translateHealthStatus } from '@/i18n/mockContent';
import { saveDailyTaskStatus } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

const todayHeaderIllustration = require('../../assets/images/today-header-illustration.png');

export default function TodayScreen() {
  const { t } = useI18n();
  const [tasks, setTasks] = useState(demoTasks);
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
      void saveDailyTaskStatus({ ...currentTask, completed: !currentTask.completed });
    }
  }

  return (
    <ScreenContainer contentStyle={styles.scrollContent}>
      <TodayPlaque title={t('common.today')} greeting={t('today.greeting', { name: demoUser.firstName })} />

      <View style={styles.contentBody}>
        <SectionCard tone="primary" style={styles.heroCard}>
          <AppText variant="caption">{t('today.overallScore')}</AppText>
          <AppText variant="metric" style={styles.heroScore}>{demoUser.healthScore}</AppText>
          <AppText variant="body">{translateHealthStatus(demoUser.healthStatus, t)}</AppText>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <AppText variant="caption">{t('today.completedCount', { completed, total: tasks.length })}</AppText>
        </SectionCard>

        <View style={styles.scoreRow}>
          {demoCoreScores.map((score) => <ScorePill key={score.label} score={score} variant="primary" />)}
        </View>

        <SectionCard style={styles.goldOutlineCard}>
          <AppText variant="subtitle">{t('today.plan')}</AppText>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              dividerColor={colors.accent}
              onToggle={() => toggleTask(task.id)}
            />
          ))}
        </SectionCard>

        <SectionCard style={styles.goldOutlineCard}>
          <AppText variant="body">{t('today.aiInsightBody')}</AppText>
        </SectionCard>

        <PrimaryButton
          label={t('today.openWeeklyPlan')}
          onPress={() => router.push('/weekly-plan')}
          backgroundColor={colors.primary}
          textColor={colors.textOnPrimary}
          style={styles.goldButton}
        />
        <PrimaryButton
          label={t('today.openNutrition')}
          variant="secondary"
          onPress={() => router.push('/nutrition')}
          backgroundColor={colors.primary}
          textColor={colors.textOnPrimary}
          style={styles.goldButton}
        />
      </View>
    </ScreenContainer>
  );
}

function TodayPlaque({ title, greeting }: { title: string; greeting: string }) {
  return (
    <View style={styles.todayPlaque}>
      <View style={styles.todayPlaqueText}>
        <View style={styles.todayAccentLine} />
        <AppText style={styles.todayPlaqueTitle}>{title}</AppText>
        <AppText numberOfLines={2} style={styles.todayPlaqueSubtitle}>
          {greeting}
        </AppText>
      </View>

      <Image
        source={todayHeaderIllustration}
        resizeMode="contain"
        style={styles.todayPlaqueImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 0,
    paddingHorizontal: 0
  },
  todayPlaque: {
    width: '100%',
    minHeight: 108,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10
  },
  todayPlaqueText: {
    flex: 1,
    justifyContent: 'center'
  },
  todayAccentLine: {
    width: 52,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginBottom: 8
  },
  todayPlaqueTitle: {
    color: colors.primary,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '900'
  },
  todayPlaqueSubtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 20,
    marginTop: 4
  },
  todayPlaqueImage: {
    width: 122,
    height: 80,
    marginLeft: 8
  },
  contentBody: {
    paddingHorizontal: 20,
    paddingTop: 16
  },
  heroCard: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderColor: colors.accent
  },
  heroScore: {
    color: colors.accent
  },
  goldOutlineCard: {
    borderWidth: 1,
    borderColor: colors.accent
  },
  goldButton: {
    borderWidth: 1,
    borderColor: colors.accent
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16
  },
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: colors.textOnPrimaryMuted,
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
