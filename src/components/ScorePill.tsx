import { StyleSheet, View } from 'react-native';
import { AppText, TextToneProvider } from '@/components/AppText';
import { useI18n } from '@/i18n';
import { translateHealthScore } from '@/i18n/mockContent';
import { colors } from '@/theme/colors';
import type { HealthScore } from '@/types';

type ScorePillVariant = 'default' | 'primary';

export function ScorePill({ score, variant = 'default' }: { score: HealthScore; variant?: ScorePillVariant }) {
  const { t } = useI18n();
  const displayScore = translateHealthScore(score, t);
  const isPrimary = variant === 'primary';

  return (
    <TextToneProvider tone={isPrimary ? 'primary' : 'surface'}>
      <View style={[styles.root, isPrimary && styles.primaryRoot]}>
        <AppText variant="caption" style={styles.label}>{displayScore.label}</AppText>
        <AppText style={[styles.value, isPrimary && styles.primaryValue]}>{displayScore.value}</AppText>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2
  },
  primaryRoot: {
    backgroundColor: colors.primary,
    borderColor: colors.accent
  },
  label: {
    textAlign: 'center'
  },
  value: {
    color: colors.accent,
    fontWeight: '900',
    fontSize: 24,
    textAlign: 'center'
  },
  primaryValue: {
    color: colors.accent
  }
});
