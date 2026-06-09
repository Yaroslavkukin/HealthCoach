import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import type { DailyTask } from '@/types';

export function TaskItem({ task }: { task: DailyTask }) {
  return (
    <View style={styles.root}>
      <View style={[styles.checkbox, task.completed && styles.checkboxDone]}>
        {task.completed ? <Ionicons name="checkmark" size={16} color={colors.background} /> : null}
      </View>
      <View style={styles.textWrap}>
        <AppText style={styles.title}>{task.title}</AppText>
        <AppText variant="caption">{task.instruction}</AppText>
      </View>
      {task.time ? <AppText variant="caption">{task.time}</AppText> : null}
    </View>
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
  title: {
    fontWeight: '700',
    color: colors.textPrimary
  }
});
