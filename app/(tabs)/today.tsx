import { useState } from 'react';
import { router } from 'expo-router';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { TaskItem } from '@/components/TaskItem';
import { demoTasks, demoUser } from '@/data/mock/healthProfile';
import { useI18n } from '@/i18n';
import { saveDailyTaskStatus } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

const todayHeaderIllustration = require('../../assets/images/today-header-illustration.png');
const todayHealthScoreCard = require('../../assets/images/today-health-score-card.png');
const todayPlanTitleFontFamily = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia',
  default: 'serif'
});

export default function TodayScreen() {
  const { t } = useI18n();
  const [tasks, setTasks] = useState(demoTasks);

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
        <View style={styles.healthScoreImageFrame}>
          <Image source={todayHealthScoreCard} resizeMode="contain" style={styles.healthScoreCardImage} />
        </View>

        <View style={styles.planCard}>
          <View style={styles.planCardHeader}>
            <AppText style={styles.planCardTitle}>{t('today.plan')}</AppText>
          </View>
          <View style={styles.planCardBody}>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                dividerColor={colors.accent}
                onToggle={() => toggleTask(task.id)}
              />
            ))}
          </View>
        </View>

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
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 30,
    lineHeight: 32,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0.35, height: 0 },
    textShadowRadius: 0.2
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
  healthScoreImageFrame: {
    width: '100%',
    aspectRatio: 1.2766,
    alignSelf: 'center',
    marginBottom: 16,
    overflow: 'visible'
  },
  healthScoreCardImage: {
    width: '117.5%',
    height: '100%',
    aspectRatio: 1.5,
    alignSelf: 'center'
  },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.accent,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3
  },
  planCardHeader: {
    minHeight: 56,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14
  },
  planCardTitle: {
    color: colors.textOnPrimary,
    fontFamily: todayPlanTitleFontFamily,
    fontSize: 22.5,
    lineHeight: 27,
    fontWeight: '400',
    letterSpacing: 0,
    textAlign: 'center'
  },
  planCardBody: {
    backgroundColor: colors.surface,
    padding: 20,
    paddingTop: 14
  },
  goldOutlineCard: {
    borderWidth: 1,
    borderColor: colors.accent
  },
  goldButton: {
    borderWidth: 1,
    borderColor: colors.accent
  }
});
