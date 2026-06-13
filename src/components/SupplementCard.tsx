import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { useI18n } from '@/i18n';
import { translateSupplement } from '@/i18n/mockContent';
import { colors } from '@/theme/colors';
import type { SupplementRecommendation } from '@/types';

export function SupplementCard({ supplement }: { supplement: SupplementRecommendation }) {
  const { t } = useI18n();
  const displaySupplement = translateSupplement(supplement, t);

  return (
    <View style={styles.root}>
      <AppText style={styles.title}>{displaySupplement.name}</AppText>
      <AppText variant="caption">{displaySupplement.reason}</AppText>
      <View style={styles.metaRow}>
        <AppText variant="caption">{displaySupplement.dosage}</AppText>
        <AppText variant="caption">{t('component.next', { next: displaySupplement.nextIntake ?? displaySupplement.schedule })}</AppText>
      </View>
      <AppText style={styles.statusText} variant="caption">
        {t('component.supplementToday', { status: displaySupplement.takenToday ? t('common.completed') : t('common.pending') })}
      </AppText>
      {displaySupplement.courseDuration ? <AppText variant="caption">{t('component.course', { course: displaySupplement.courseDuration })}</AppText> : null}
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
  title: {
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 8
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12
  },
  statusText: {
    marginTop: 12
  }
});
