import { StyleSheet, View } from 'react-native';
import { AppText, TextToneProvider } from '@/components/AppText';
import { useI18n } from '@/i18n';
import { translateHealthScore } from '@/i18n/mockContent';
import { colors } from '@/theme/colors';
import type { HealthScore } from '@/types';

export function ScorePill({ score }: { score: HealthScore }) {
  const { t } = useI18n();
  const displayScore = translateHealthScore(score, t);

  return (
    <TextToneProvider tone="surface">
      <View style={styles.root}>
        <AppText variant="caption">{displayScore.label}</AppText>
        <AppText style={styles.value}>{displayScore.value}</AppText>
      </View>
    </TextToneProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 18,
    padding: 14,
    minHeight: 84,
    justifyContent: 'space-between',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2
  },
  value: {
    color: colors.accent,
    fontWeight: '900',
    fontSize: 24
  }
});
