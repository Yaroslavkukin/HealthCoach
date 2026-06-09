import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import type { DailyTask } from '@/types';

export function TaskItem({ task, onToggle }: { task: DailyTask; onToggle?: () => void }) {
  const iconName =
    task.category === 'supplement'
      ? 'medical-outline'
      : task.category === 'bee_product'
        ? 'flower-outline'
        : task.category === 'nutrition'
          ? 'restaurant-outline'
          : task.category === 'sleep'
            ? 'moon-outline'
            : task.category === 'water'
              ? 'water-outline'
              : task.category === 'training'
                ? 'barbell-outline'
                : 'walk-outline';

  return (
    <Pressable onPress={onToggle} style={({ pressed }) => [styles.root, pressed && styles.pressed]}>
      <View style={[styles.checkbox, task.completed && styles.checkboxDone]}>
        {task.completed ? <Ionicons name="checkmark" size={16} color={colors.background} /> : null}
      </View>
      <View style={styles.textWrap}>
        <View style={styles.titleRow}>
          <Ionicons name={iconName} size={16} color={colors.accent} />
          <AppText style={styles.title}>{task.title}</AppText>
        </View>
        <AppText variant="caption">{task.instruction}</AppText>
      </View>
      {task.time ? <AppText variant="caption">{task.time}</AppText> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  pressed: {
    opacity: 0.75
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxDone: {
    backgroundColor: colors.accent
  },
  textWrap: {
    flex: 1
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  title: {
    fontWeight: '700',
    color: colors.textPrimary
  }
});
