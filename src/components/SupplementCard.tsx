import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { AppText, TextToneProvider } from '@/components/AppText';
import { useI18n } from '@/i18n';
import { translateSupplement } from '@/i18n/mockContent';
import { colors } from '@/theme/colors';
import type { SupplementRecommendation } from '@/types';

type SupplementCardTone = 'surface' | 'primary';

export function SupplementCard({
  supplement,
  style,
  tone = 'surface'
}: {
  supplement: SupplementRecommendation;
  style?: StyleProp<ViewStyle>;
  tone?: SupplementCardTone;
}) {
  const { t } = useI18n();
  const displaySupplement = translateSupplement(supplement, t);
  const intakeTime = formatIntakeTime(displaySupplement.nextIntake ?? displaySupplement.schedule, t('common.today'));

  return (
    <TextToneProvider tone={tone}>
      <View style={[styles.root, style]}>
        <AppText style={styles.title}>{displaySupplement.name}</AppText>
        <AppText variant="caption">{displaySupplement.reason}</AppText>
        <View style={styles.metaRow}>
          <AppText variant="caption">{displaySupplement.teaspoonDosage ?? displaySupplement.dosage}</AppText>
          <AppText variant="caption">{t('component.next', { next: intakeTime })}</AppText>
        </View>
        <AppText style={styles.statusText} variant="caption">
          {t('component.supplementToday', { status: displaySupplement.takenToday ? t('common.completed') : t('common.pending') })}
        </AppText>
        {displaySupplement.courseDuration ? <AppText variant="caption">{t('component.course', { course: displaySupplement.courseDuration })}</AppText> : null}
      </View>
    </TextToneProvider>
  );
}

function formatIntakeTime(value: string, todayLabel: string) {
  return /^\d{1,2}:\d{2}$/.test(value) ? `${todayLabel} ${value}` : value;
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    marginBottom: 12,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2
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
