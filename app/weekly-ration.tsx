import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import type { TranslationKey } from '@/i18n/translations/en';

const dayKeys = [
  'mock.weekday.mon',
  'mock.weekday.tue',
  'mock.weekday.wed',
  'mock.weekday.thu',
  'mock.weekday.fri',
  'mock.weekday.sat',
  'mock.weekday.sun'
] as const satisfies readonly TranslationKey[];

const mealSlotKeys = [
  'mock.meal.breakfast.meal',
  'mock.meal.lunch.meal',
  'mock.meal.dinner.meal',
  'mock.meal.snack.meal'
] as const satisfies readonly TranslationKey[];

export default function WeeklyRationScreen() {
  const { t } = useI18n();

  return (
    <ScreenContainer>
      <AppText variant="title">{t('weeklyRation.title')}</AppText>
      <AppText variant="body">{t('weeklyRation.subtitle')}</AppText>

      {dayKeys.map((dayKey) => (
        <SectionCard key={dayKey}>
          <AppText variant="subtitle">{t(dayKey)}</AppText>
          <View style={styles.slotList}>
            {mealSlotKeys.map((mealKey) => (
              <View key={`${dayKey}-${mealKey}`} style={styles.slot}>
                <View style={styles.placeholderIcon}>
                  <AppText style={styles.placeholderIconText}>AI</AppText>
                </View>
                <View style={styles.slotText}>
                  <AppText style={styles.slotTitle}>{t(mealKey)}</AppText>
                  <AppText variant="caption">{t('weeklyRation.aiPlaceholder')}</AppText>
                </View>
              </View>
            ))}
          </View>
        </SectionCard>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  slotList: {
    gap: 10,
    marginTop: 14
  },
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
    padding: 12
  },
  placeholderIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardElevated,
    borderWidth: 1,
    borderColor: colors.accentSoft
  },
  placeholderIconText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '900'
  },
  slotText: {
    flex: 1
  },
  slotTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2
  }
});
