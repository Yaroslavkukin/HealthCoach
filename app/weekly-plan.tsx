import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { TaskItem } from '@/components/TaskItem';
import { demoWeeklyPlan } from '@/data/mock/healthProfile';
import { saveDailyTaskStatus } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

export default function WeeklyPlanScreen() {
  const [selectedDayId, setSelectedDayId] = useState(demoWeeklyPlan[0].id);
  const [completedOverrides, setCompletedOverrides] = useState<Record<string, boolean>>({});
  const [taskSaveMessage, setTaskSaveMessage] = useState('Weekly task changes will use mock fallback unless Supabase auth is configured.');
  const selectedDay = demoWeeklyPlan.find((day) => day.id === selectedDayId) ?? demoWeeklyPlan[0];
  const tasks = selectedDay.tasks.map((task) => ({ ...task, completed: completedOverrides[task.id] ?? task.completed }));
  const completed = tasks.filter((task) => task.completed).length;

  function toggleTask(id: string) {
    const currentTask = tasks.find((task) => task.id === id);
    const nextCompleted = !(completedOverrides[id] ?? selectedDay.tasks.find((task) => task.id === id)?.completed);

    setCompletedOverrides((current) => ({
      ...current,
      [id]: nextCompleted
    }));

    if (currentTask) {
      void saveDailyTaskStatus({ ...currentTask, completed: nextCompleted }).then((result) => {
        setTaskSaveMessage(result.message);
      });
    }
  }

  return (
    <ScreenContainer>
      <AppText variant="title">7-Day Plan</AppText>
      <AppText variant="body">This week is focused on recovery, movement consistency, and nutrition cleanup.</AppText>

      <View style={styles.dayRow}>
        {demoWeeklyPlan.map((day) => (
          <Pressable key={day.id} onPress={() => setSelectedDayId(day.id)} style={[styles.dayChip, selectedDayId === day.id && styles.dayChipActive]}>
            <AppText style={[styles.dayText, selectedDayId === day.id && styles.dayTextActive]}>{day.day.slice(0, 3)}</AppText>
          </Pressable>
        ))}
      </View>

      <SectionCard>
        <AppText variant="subtitle">{selectedDay.day}</AppText>
        <AppText variant="body">Focus: {selectedDay.focus}</AppText>
        <AppText variant="caption">Progress: {completed} of {tasks.length} completed</AppText>
        <StateNotice title="Daily task storage" message={taskSaveMessage} variant="info" />
        {tasks.map((task) => <TaskItem key={task.id} task={task} onToggle={() => toggleTask(task.id)} />)}
      </SectionCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border
  },
  dayChipActive: {
    backgroundColor: colors.accent
  },
  dayText: {
    color: colors.textSecondary,
    fontWeight: '800'
  },
  dayTextActive: {
    color: colors.background
  }
});
