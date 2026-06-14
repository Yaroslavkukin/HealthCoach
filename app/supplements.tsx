import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SectionCard } from '@/components/SectionCard';
import { SupplementCard } from '@/components/SupplementCard';
import { demoSupplements } from '@/data/mock/healthProfile';
import { useI18n } from '@/i18n';
import { translateSupplement } from '@/i18n/mockContent';
import { colors } from '@/theme/colors';

const supplementStack = Array.from(
  new Map(demoSupplements.map((supplement) => [supplement.name.toLowerCase(), supplement])).values()
);
const supplementsHeaderIllustration = require('../assets/images/supplements-header-illustration.png');

export default function SupplementsScreen() {
  const { t } = useI18n();
  const displaySupplements = supplementStack.map((supplement) => translateSupplement(supplement, t));

  return (
    <SafeAreaView style={styles.screenRoot}>
      <SupplementsHeader title={t('supplements.title')} subtitle={t('supplements.subtitle')} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {supplementStack.map((supplement) => (
          <SupplementCard
            key={supplement.id}
            supplement={supplement}
            tone="primary"
            style={styles.greenElement}
          />
        ))}

        <SectionCard tone="primary" style={styles.greenElement}>
          <AppText variant="subtitle">{t('supplements.scheduleNotes')}</AppText>
          {displaySupplements.map((supplement) => (
            <AppText key={`${supplement.id}-schedule`} variant="caption">
              {supplement.name}: {supplement.foodInstruction}. {supplement.compatibilityNotes}
            </AppText>
          ))}
        </SectionCard>

        <SectionCard style={styles.goldOutline}>
          <AppText variant="caption">{t('mock.supplement.safety')}</AppText>
        </SectionCard>

        <PrimaryButton
          label={t('supplements.backToday')}
          variant="secondary"
          onPress={() => router.push('/(tabs)/today')}
          backgroundColor={colors.primary}
          textColor={colors.textOnPrimary}
          style={styles.greenElement}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function SupplementsHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.headerCard}>
      <View pointerEvents="none" style={styles.headerWave} />
      <View pointerEvents="none" style={styles.headerWaveSoft} />
      <View pointerEvents="none" style={styles.headerIllustrationWrapper}>
        <Image
          source={supplementsHeaderIllustration}
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
        <Ionicons name="chevron-back" size={22} color={colors.textOnPrimary} />
      </Pressable>

      <View style={styles.headerText}>
        <AppText numberOfLines={1} style={styles.headerTitle}>{title}</AppText>
        <AppText numberOfLines={1} style={styles.headerSubtitle}>{subtitle}</AppText>
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
    minHeight: 72,
    width: '100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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
    width: 132,
    height: 46,
    borderRadius: 66,
    right: -26,
    bottom: -20,
    backgroundColor: '#DDE8CF',
    opacity: 0.68,
    transform: [{ rotate: '-6deg' }],
    zIndex: 0
  },
  headerWaveSoft: {
    position: 'absolute',
    width: 88,
    height: 34,
    borderRadius: 44,
    right: 28,
    bottom: -14,
    backgroundColor: '#CAD8B8',
    opacity: 0.28,
    transform: [{ rotate: '10deg' }],
    zIndex: 0
  },
  headerIllustrationWrapper: {
    position: 'absolute',
    right: 10,
    bottom: 2,
    width: 92,
    height: 62,
    opacity: 0.72,
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
    marginRight: 10,
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
  greenElement: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent
  },
  goldOutline: {
    borderWidth: 1,
    borderColor: colors.accent
  }
});
