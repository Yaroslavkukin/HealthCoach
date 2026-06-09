import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import type { HealthScore } from '@/types';

export function HealthSystemCard({ score }: { score: HealthScore }) {
  const statusColor = score.status === 'good' ? colors.success : score.status === 'poor' ? colors.danger : colors.warning;

  return (
    <View style={styles.root}>
      <View>
        <AppText style={styles.title}>{score.label}</AppText>
        <AppText variant="caption">Status: {score.status}</AppText>
      </View>
      <View style={[styles.badge, { borderColor: statusColor }]}>
        <AppText style={[styles.value, { color: statusColor }]}>{score.value}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: '800'
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  value: {
    fontWeight: '900',
    fontSize: 18
  }
});
