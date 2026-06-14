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
        <AppText adjustsFontSizeToFit minimumFontScale={0.88} numberOfLines={1} style={styles.headerTitle}>{title}</AppText>
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
    minHeight: 74,
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingLeft: 26,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowOpacity: 0,
    elevation: 0
  },
  headerWave: {
    position: 'absolute',
    width: 168,
    height: 52,
    borderRadius: 84,
    right: -34,
    bottom: -18,
    backgroundColor: '#DDE8CF',
    opacity: 0.66,
    transform: [{ rotate: '-6deg' }],
    zIndex: 0
  },
  headerWaveSoft: {
    position: 'absolute',
    width: 104,
    height: 36,
    borderRadius: 52,
    right: 28,
    bottom: -12,
    backgroundColor: '#CAD8B8',
    opacity: 0.28,
    transform: [{ rotate: '10deg' }],
    zIndex: 0
  },
  headerIllustrationWrapper: {
    position: 'absolute',
    right: 12,
    bottom: 4,
    width: 86,
    height: 64,
    opacity: 0.94,
    zIndex: 0
  },
  headerIllustration: {
    width: '100%',
    height: '100%'
  },
  headerAction: {
    width: 48,
    height: 48,
    borderRadius: 15,
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
    marginLeft: 12,
    marginRight: 84,
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
    width: 0,
    height: 48,
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
