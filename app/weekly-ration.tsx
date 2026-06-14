import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { SectionCard } from '@/components/SectionCard';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import type { TranslationKey } from '@/i18n/translations/en';

const weeklyRationHeaderIllustration = require('../assets/images/weekly-ration-header-illustration.png');

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
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.screenRoot}>
        <WeeklyRationHeader title={t('weeklyRation.title')} subtitle={t('nutrition.subtitle')} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {dayKeys.map((dayKey) => (
            <SectionCard key={dayKey} style={styles.dayCard}>
              <AppText variant="subtitle">{t(dayKey)}</AppText>
              <View style={styles.slotList}>
                {mealSlotKeys.map((mealKey) => (
                  <View key={`${dayKey}-${mealKey}`} style={styles.slot}>
                    <View style={styles.placeholderIcon}>
                      <AppText style={styles.placeholderIconText}>AI</AppText>
                    </View>
                    <View style={styles.slotText}>
                      <AppText style={styles.slotTitle}>{t(mealKey)}</AppText>
                      <AppText variant="caption" style={styles.slotCaption}>{t('weeklyRation.aiPlaceholder')}</AppText>
                    </View>
                  </View>
                ))}
              </View>
            </SectionCard>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

function WeeklyRationHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.headerCard}>
      <View pointerEvents="none" style={styles.headerWave} />
      <View pointerEvents="none" style={styles.headerWaveSoft} />
      <View pointerEvents="none" style={styles.headerIllustrationWrapper}>
        <Image
          source={weeklyRationHeaderIllustration}
          resizeMode="contain"
          style={styles.headerIllustration}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.headerAction, pressed && styles.pressedAction]}
      >
        <Ionicons name="chevron-back" size={24} color={colors.textOnPrimary} />
      </Pressable>

      <View style={styles.headerText}>
        <AppText
          adjustsFontSizeToFit
          minimumFontScale={0.84}
          numberOfLines={1}
          style={styles.headerTitle}
        >
          {title}
        </AppText>
        <AppText numberOfLines={2} style={styles.headerSubtitle}>
          {subtitle}
        </AppText>
      </View>

      <View style={styles.headerActionSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120
  },
  headerCard: {
    minHeight: 82,
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingLeft: 22,
    paddingRight: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowOpacity: 0,
    elevation: 0
  },
  headerWave: {
    position: 'absolute',
    width: 150,
    height: 52,
    borderRadius: 75,
    right: -30,
    bottom: -18,
    backgroundColor: '#DDE8CF',
    opacity: 0.68,
    transform: [{ rotate: '-6deg' }],
    zIndex: 0
  },
  headerWaveSoft: {
    position: 'absolute',
    width: 98,
    height: 36,
    borderRadius: 49,
    right: 26,
    bottom: -12,
    backgroundColor: '#CAD8B8',
    opacity: 0.28,
    transform: [{ rotate: '10deg' }],
    zIndex: 0
  },
  headerIllustrationWrapper: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 132,
    height: 78,
    opacity: 0.9,
    zIndex: 0
  },
  headerIllustration: {
    width: '100%',
    height: '100%'
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent,
    zIndex: 1
  },
  pressedAction: {
    opacity: 0.78
  },
  headerText: {
    flex: 1,
    marginLeft: 14,
    marginRight: 86,
    zIndex: 1
  },
  headerTitle: {
    color: colors.primary,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900'
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  headerActionSpacer: {
    width: 40,
    height: 40,
    zIndex: 1
  },
  dayCard: {
    borderColor: colors.accent
  },
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
    borderColor: colors.accent,
    backgroundColor: colors.primary,
    padding: 12
  },
  placeholderIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
    borderWidth: 1,
    borderColor: colors.accent
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
    color: colors.textOnPrimary,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2
  },
  slotCaption: {
    color: colors.textOnPrimaryMuted
  }
});
