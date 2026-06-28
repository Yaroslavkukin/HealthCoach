import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Platform, Pressable, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { SectionCard } from '@/components/SectionCard';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';

const subscriptionHeaderPlaque = require('../assets/images/subscription-header-plaque.png');

type SubscriptionPlan = 'monthly' | 'sixMonth';

const subscriptionFontFamily = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia',
  default: 'serif'
});
const subscriptionFontWeight = '400' as const;
const subscriptionLetterSpacing = 0;

export default function SubscriptionScreen() {
  const { t } = useI18n();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  function selectDemoPlan(plan: SubscriptionPlan) {
    setSelectedPlan(plan);
  }

  function continueToDemoProfile() {
    router.replace('/(tabs)/profile');
  }

  return (
    <SafeAreaView style={styles.screenRoot}>
      <SubscriptionHeader />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {selectedPlan ? (
          <SectionCard tone="primary" style={styles.greenElement}>
            <AppText variant="subtitle" style={styles.cardTitleText}>{t('subscription.planSelectedTitle')}</AppText>
            <AppText variant="body" style={styles.cardBodyText}>{t('subscription.planSelectedMessage')}</AppText>
            <AppText variant="caption" style={[styles.cardCaptionText, styles.accentText]}>
              {selectedPlan === 'monthly' ? t('subscription.monthly') : t('subscription.sixMonth')}
            </AppText>
            <SubscriptionButton
              label={t('subscription.continueToApp')}
              onPress={continueToDemoProfile}
              style={styles.greenButton}
            />
            <SubscriptionButton
              label={t('subscription.changePlan')}
              onPress={() => setSelectedPlan(null)}
              style={styles.greenButton}
            />
          </SectionCard>
        ) : (
          <>
            <SectionCard tone="primary" style={styles.greenElement}>
              <AppText variant="subtitle" style={styles.cardTitleText}>{t('subscription.monthly')}</AppText>
              <AppText variant="metric" style={styles.priceText}>3.000</AppText>
              <SubscriptionButton
                label={t('subscription.monthlyButton')}
                onPress={() => selectDemoPlan('monthly')}
                style={styles.greenButton}
              />
            </SectionCard>

            <SectionCard tone="primary" style={styles.greenElement}>
              <AppText variant="subtitle" style={styles.cardTitleText}>{t('subscription.sixMonth')}</AppText>
              <AppText variant="metric" style={styles.priceText}>15.000</AppText>
              <SubscriptionButton
                label={t('subscription.sixMonthButton')}
                onPress={() => selectDemoPlan('sixMonth')}
                style={styles.greenButton}
              />
            </SectionCard>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

function SubscriptionHeader() {
  return (
    <View style={styles.headerFrame}>
      <Image
        source={subscriptionHeaderPlaque}
        style={styles.headerImage}
        resizeMode="cover"
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Назад"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.headerAction, pressed && styles.pressedAction]}
      >
        <Ionicons name="chevron-back" size={22} color={colors.textOnPrimary} />
      </Pressable>
    </View>
  );
}

function SubscriptionButton({
  label,
  onPress,
  style
}: {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.subscriptionButton, style, pressed && styles.pressedButton]}
    >
      <AppText numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78} style={styles.subscriptionButtonText}>
        {label}
      </AppText>
    </Pressable>
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
  headerFrame: {
    width: '100%',
    height: 82,
    minHeight: 82,
    maxHeight: 82,
    backgroundColor: colors.background,
    overflow: 'hidden'
  },
  headerImage: {
    width: '100%',
    height: '100%',
    minHeight: 82,
    maxHeight: 82,
    backgroundColor: colors.background
  },
  headerAction: {
    position: 'absolute',
    left: 12,
    top: 21,
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
  cardTitleText: {
    fontFamily: subscriptionFontFamily,
    fontWeight: subscriptionFontWeight,
    letterSpacing: subscriptionLetterSpacing
  },
  cardBodyText: {
    fontFamily: subscriptionFontFamily,
    fontWeight: subscriptionFontWeight,
    letterSpacing: subscriptionLetterSpacing
  },
  descriptionParagraphText: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12
  },
  descriptionParagraphSpacing: {
    marginTop: 10
  },
  cardCaptionText: {
    fontFamily: subscriptionFontFamily,
    fontWeight: subscriptionFontWeight,
    letterSpacing: subscriptionLetterSpacing
  },
  greenElement: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent
  },
  greenButton: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent
  },
  subscriptionButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 3
  },
  pressedButton: {
    opacity: 0.78
  },
  subscriptionButtonText: {
    color: colors.textOnPrimary,
    fontFamily: subscriptionFontFamily,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: subscriptionFontWeight,
    letterSpacing: subscriptionLetterSpacing,
    textAlign: 'center'
  },
  priceText: {
    color: colors.accent,
    fontFamily: subscriptionFontFamily,
    fontWeight: subscriptionFontWeight,
    letterSpacing: subscriptionLetterSpacing
  },
  accentText: {
    color: colors.accent,
    fontWeight: subscriptionFontWeight
  }
});
