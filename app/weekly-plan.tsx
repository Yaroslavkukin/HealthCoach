import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { SectionCard } from '@/components/SectionCard';
import { TaskItem } from '@/components/TaskItem';
import { demoWeeklyPlan } from '@/data/mock/healthProfile';
import { useI18n } from '@/i18n';
import { translateWeeklyDay } from '@/i18n/mockContent';
import { saveDailyTaskStatus } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

const weeklyPlanLeafImage = require('../assets/images/weekly-plan-leaf.png');

export default function WeeklyPlanScreen() {
  const { t } = useI18n();
  const [selectedDayId, setSelectedDayId] = useState(demoWeeklyPlan[0].id);
  const [completedOverrides, setCompletedOverrides] = useState<Record<string, boolean>>({});
  const selectedDay = demoWeeklyPlan.find((day) => day.id === selectedDayId) ?? demoWeeklyPlan[0];
  const selectedDayText = translateWeeklyDay(selectedDay, t);
  const tasks = selectedDay.tasks.map((task) => ({ ...task, completed: completedOverrides[task.id] ?? task.completed }));
  const completed = tasks.filter((task) => task.completed).length;
  const weeklyRecommendation = t('weekly.aiRecommendation');

  function toggleTask(id: string) {
    const currentTask = tasks.find((task) => task.id === id);
    const nextCompleted = !(completedOverrides[id] ?? selectedDay.tasks.find((task) => task.id === id)?.completed);

    setCompletedOverrides((current) => ({
      ...current,
      [id]: nextCompleted
    }));

    if (currentTask) {
      void saveDailyTaskStatus({ ...currentTask, completed: nextCompleted });
    }
  }

  return (
    <SafeAreaView style={styles.screenRoot}>
      <WeeklyPlanHeader title={t('nav.weeklyPlan')} subtitle={t('weekly.headerSubtitle')} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <WeeklyAiRecommendationCard recommendation={weeklyRecommendation} />

        <View style={styles.dayRow}>
          {demoWeeklyPlan.map((day) => (
            <Pressable key={day.id} onPress={() => setSelectedDayId(day.id)} style={[styles.dayChip, selectedDayId === day.id && styles.dayChipActive]}>
              <AppText style={[styles.dayText, selectedDayId === day.id && styles.dayTextActive]}>{translateWeeklyDay(day, t).shortDay}</AppText>
            </Pressable>
          ))}
        </View>

        <SectionCard style={styles.goldOutline}>
          <AppText variant="subtitle">{selectedDayText.day}</AppText>
          <AppText variant="body">{t('weekly.focus', { focus: selectedDayText.focus })}</AppText>
          <AppText variant="caption">{t('weekly.progress', { completed, total: tasks.length })}</AppText>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              dividerColor={colors.accent}
              onToggle={() => toggleTask(task.id)}
            />
          ))}
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

function WeeklyAiRecommendationCard({ recommendation }: { recommendation: string }) {
  return (
    <View style={styles.aiRecommendationCard}>
      <View style={styles.aiRecommendationAccent} />
      <AppText style={styles.aiRecommendationText}>{recommendation}</AppText>
    </View>
  );
}

function WeeklyPlanHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.headerCard}>
      <View pointerEvents="none" style={styles.headerWave} />
      <View pointerEvents="none" style={styles.headerWaveSoft} />
      <View pointerEvents="none" style={styles.leafImageWrapper}>
        <Image
          source={weeklyPlanLeafImage}
          resizeMode="contain"
          style={styles.leafImage}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.headerAction, pressed && styles.pressedAction]}
      >
        <Ionicons name="chevron-back" size={22} color={colors.textOnPrimary} />
      </Pressable>

      <View style={styles.headerText}>
        <AppText numberOfLines={1} style={styles.headerTitle}>{title}</AppText>
        <AppText numberOfLines={1} style={styles.headerSubtitle}>{subtitle}</AppText>
      </View>

      <View style={styles.calendarAction}>
        <Ionicons name="calendar-outline" size={21} color={colors.textOnPrimary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120
  },
  goldOutline: {
    borderWidth: 1,
    borderColor: colors.accent
  },
  aiRecommendationCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.primary,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 3
  },
  aiRecommendationAccent: {
    width: 42,
    height: 3,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginBottom: 14
  },
  aiRecommendationText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700'
  },
  headerCard: {
    minHeight: 72,
    width: '100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingLeft: 22,
    paddingRight: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowOpacity: 0,
    elevation: 0
  },
  headerWave: {
    position: 'absolute',
    width: 132,
    height: 46,
    borderRadius: 66,
    right: -26,
    bottom: -20,
    backgroundColor: '#DDE8CF',
    opacity: 0.68,
    transform: [{ rotate: '-6deg' }],
    zIndex: 0
  },
  headerWaveSoft: {
    position: 'absolute',
    width: 88,
    height: 34,
    borderRadius: 44,
    right: 28,
    bottom: -14,
    backgroundColor: '#CAD8B8',
    opacity: 0.28,
    transform: [{ rotate: '10deg' }],
    zIndex: 0
  },
  leafImageWrapper: {
    position: 'absolute',
    right: 56,
    bottom: 2,
    width: 52,
    height: 62,
    opacity: 0.58,
    zIndex: 0
  },
  leafImage: {
    width: '100%',
    height: '100%'
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent,
    zIndex: 1
  },
  pressedAction: {
    opacity: 0.78
  },
  headerText: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
    zIndex: 1
  },
  headerTitle: {
    color: colors.primary,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900'
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  calendarAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent,
    zIndex: 1
  },
  dayRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 16
  },
  dayChip: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent
  },
  dayChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.accent
  },
  dayText: {
    color: colors.textMuted,
    fontWeight: '800'
  },
  dayTextActive: {
    color: colors.textOnPrimary
  }
});
