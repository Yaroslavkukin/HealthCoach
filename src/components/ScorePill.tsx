import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import type { HealthScore } from '@/types';

export function ScorePill({ score }: { score: HealthScore }) {
  return (
    <View style={styles.root}>
      <AppText variant="caption">{score.label}</AppText>
      <AppText style={styles.value}>{score.value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cardElevated,
    borderRadius: 18,
    padding: 14,
    minHeight: 84,
    justifyContent: 'space-between'
  },
  value: {
    color: colors.accent,
    fontWeight: '900',
    fontSize: 24
  }
});
