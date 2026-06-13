import { StyleSheet, View } from 'react-native';
import { AppText, TextToneProvider } from '@/components/AppText';
import { useI18n } from '@/i18n';
import { translateHealthScore, translateSimpleLabel } from '@/i18n/mockContent';
import { colors } from '@/theme/colors';
import type { HealthScore } from '@/types';

export function HealthSystemCard({ score }: { score: HealthScore }) {
  const { t } = useI18n();
  const displayScore = translateHealthScore(score, t);
  const statusColor = score.status === 'good' ? colors.success : score.status === 'poor' ? colors.danger : colors.warning;

  return (
    <TextToneProvider tone="surface">
      <View style={styles.root}>
        <View>
          <AppText style={styles.title}>{displayScore.label}</AppText>
          <AppText variant="caption">{t('component.status', { status: translateSimpleLabel(displayScore.status, t) })}</AppText>
          {displayScore.limitingFactor ? <AppText variant="caption">{t('component.limit', { limit: displayScore.limitingFactor })}</AppText> : null}
          {displayScore.action ? <AppText variant="caption">{t('component.action', { action: displayScore.action })}</AppText> : null}
        </View>
        <View style={[styles.badge, { borderColor: statusColor }]}>
          <AppText style={[styles.value, { color: statusColor }]}>{displayScore.value}</AppText>
        </View>
      </View>
    </TextToneProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2
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
