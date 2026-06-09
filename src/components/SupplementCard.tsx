import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';
import type { SupplementRecommendation } from '@/types';

export function SupplementCard({ supplement }: { supplement: SupplementRecommendation }) {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <AppText style={styles.title}>{supplement.name}</AppText>
        <AppText style={styles.badge}>{supplement.stackType}</AppText>
      </View>
      <AppText variant="caption">{supplement.reason}</AppText>
      <View style={styles.metaRow}>
        <AppText variant="caption">{supplement.dosage}</AppText>
        <AppText variant="caption">Next: {supplement.nextIntake ?? supplement.schedule}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8
  },
  title: {
    flex: 1,
    fontWeight: '800',
    fontSize: 16
  },
  badge: {
    color: colors.accent,
    fontWeight: '800',
    textTransform: 'capitalize'
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12
  }
});
