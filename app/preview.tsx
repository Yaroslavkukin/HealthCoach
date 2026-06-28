import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { accessRoutes } from '@/features/access/accessModel';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';

const previewHeroPlaque = require('../assets/images/preview-hero-plaque.png');
const previewDemoCard = require('../assets/images/preview-demo-card.png');

const demoButtonHitAreaHorizontalInset = 7;
const demoButtonHitAreaHeightRatio = 0.19;
const demoButtonBorderRadius = 16;
const visibleDemoButtonWidth = '86.4%';
const visibleDemoButtonHeight = 45;
const visibleDemoButtonBorderRadius = 7;
const previewButtonLabelVariant = 'title';
const previewButtonLabelFontFamily = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia',
  default: 'serif'
});
const previewButtonLabelFontSize = 16;
const previewButtonLabelLineHeight = 20;
const previewButtonLabelFontWeight = '400';
const previewButtonLabelLetterSpacing = 0;

export default function PreviewScreen() {
  const { t } = useI18n();
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  return (
    <ScreenContainer>
      <View style={styles.heroPlaqueFrame}>
        <Image source={previewHeroPlaque} style={styles.heroPlaqueImage} resizeMode="contain" />
      </View>

      <View style={styles.demoCardFrame}>
        <Image source={previewDemoCard} style={styles.demoCardImage} resizeMode="contain" />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('preview.demoAccess')}
          onPress={() => router.push(accessRoutes.mainApp)}
          style={styles.demoCardButtonHitArea}
        />
      </View>

      <View style={styles.websiteNoteFrame}>
        <AppText
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.82}
          style={styles.websiteNoteText}
        >
          Вся информация на сайте Health Coach
        </AppText>
      </View>

      <SectionCard tone="primary" style={styles.healthCoachInfoCard}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: isAboutExpanded }}
          accessibilityLabel="Что такое Health Coach"
          onPress={() => setIsAboutExpanded((current) => !current)}
          style={({ pressed }) => [
            styles.infoCardPressable,
            !isAboutExpanded && styles.infoCardPressableCollapsed,
            pressed && styles.infoCardPressed
          ]}
        >
          <View style={styles.infoCardTitleRow}>
            <AppText variant="subtitle" style={styles.infoCardTitle}>{t('subscription.includes')}</AppText>
            <Ionicons
              name={isAboutExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.textOnPrimary}
              style={styles.infoCardChevron}
            />
          </View>
          {isAboutExpanded ? (
            <>
              <AppText variant="body" style={[styles.infoCardBody, styles.infoCardParagraph]}>
                {t('subscription.descriptionParagraph1')}
              </AppText>
              <AppText variant="body" style={[styles.infoCardBody, styles.infoCardParagraph, styles.infoCardParagraphSpacing]}>
                {t('subscription.descriptionParagraph2')}
              </AppText>
            </>
          ) : null}
        </Pressable>
      </SectionCard>

      <View style={styles.blankButtonsFrame}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Документы"
          onPress={() => router.push('/security')}
          style={styles.blankPreviewButton}
        >
          <AppText
            variant={previewButtonLabelVariant}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.78}
            style={styles.blankPreviewButtonText}
          >
            Документы
          </AppText>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroPlaqueFrame: {
    width: '100%',
    alignSelf: 'center',
    aspectRatio: 1532 / 760,
    overflow: 'hidden',
    backgroundColor: colors.background,
    marginBottom: 6
  },
  heroPlaqueImage: {
    width: '100%',
    height: '100%'
  },
  demoCardFrame: {
    width: '100%',
    alignSelf: 'center',
    aspectRatio: 1512 / 902,
    overflow: 'hidden',
    backgroundColor: colors.background,
    marginBottom: 16
  },
  demoCardImage: {
    width: '100%',
    height: '100%'
  },
  demoCardButtonHitArea: {
    position: 'absolute',
    left: `${demoButtonHitAreaHorizontalInset}%`,
    right: `${demoButtonHitAreaHorizontalInset}%`,
    bottom: '10%',
    height: `${demoButtonHitAreaHeightRatio * 100}%`,
    borderRadius: demoButtonBorderRadius
  },
  websiteNoteFrame: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: -4,
    marginBottom: 12
  },
  websiteNoteText: {
    color: colors.primary,
    fontFamily: previewButtonLabelFontFamily,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: previewButtonLabelFontWeight,
    letterSpacing: previewButtonLabelLetterSpacing,
    textAlign: 'center',
    textDecorationLine: 'underline',
    textDecorationColor: colors.accent,
    textDecorationStyle: 'solid'
  },
  healthCoachInfoCard: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: 0,
    marginBottom: 16
  },
  infoCardPressable: {
    padding: 20
  },
  infoCardPressableCollapsed: {
    paddingVertical: 14
  },
  infoCardPressed: {
    opacity: 0.78
  },
  infoCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  infoCardTitle: {
    flex: 1,
    minWidth: 0,
    fontFamily: previewButtonLabelFontFamily,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: previewButtonLabelFontWeight,
    letterSpacing: previewButtonLabelLetterSpacing
  },
  infoCardChevron: {
    flexShrink: 0
  },
  infoCardBody: {
    fontFamily: previewButtonLabelFontFamily,
    fontWeight: previewButtonLabelFontWeight,
    letterSpacing: previewButtonLabelLetterSpacing
  },
  infoCardParagraph: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12
  },
  infoCardParagraphSpacing: {
    marginTop: 10
  },
  blankButtonsFrame: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.background
  },
  blankPreviewButton: {
    width: visibleDemoButtonWidth,
    height: visibleDemoButtonHeight,
    borderRadius: visibleDemoButtonBorderRadius,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.primary
  },
  blankPreviewButtonText: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: (visibleDemoButtonHeight - previewButtonLabelLineHeight) / 2,
    color: '#F7EEDC',
    fontFamily: previewButtonLabelFontFamily,
    fontSize: previewButtonLabelFontSize,
    lineHeight: previewButtonLabelLineHeight,
    fontWeight: previewButtonLabelFontWeight,
    letterSpacing: previewButtonLabelLetterSpacing,
    textAlign: 'center'
  }
});
