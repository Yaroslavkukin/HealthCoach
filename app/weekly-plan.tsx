import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { TaskItem } from '@/components/TaskItem';
import { demoWeeklyPlan } from '@/data/mock/healthProfile';
import { colors } from '@/theme/colors';

export default function WeeklyPlanScreen() {
  const [selectedDayId, setSelectedDayId] = useState(demoWeeklyPlan[0].id);
  const [completedOverrides, setCompletedOverrides] = useState<Record<string, boolean>>({});
  const selectedDay = demoWeeklyPlan.find((day) => day.id === selectedDayId) ?? demoWeeklyPlan[0];
  const tasks = selectedDay.tasks.map((task) => ({ ...task, completed: completedOverrides[task.id] ?? task.completed }));
  const completed = tasks.filter((task) => task.completed).length;

  function toggleTask(id: string) {
    setCompletedOverrides((current) => ({
      ...current,
      [id]: !(current[id] ?? selectedDay.tasks.find((task) => task.id === id)?.completed)
    }));
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
