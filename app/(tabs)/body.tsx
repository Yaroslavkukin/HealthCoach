import { router } from 'expo-router';
import { Image, ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { demoBodyOverview, type DemoBodySystem } from '@/data/demoBodyData';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';

const bodyHeaderPlaque = require('../../assets/images/body-header-plaque-v1.png');
const bodySystemsPanel = require('../../assets/images/body-systems-panel.png');
const BODY_PLAQUE_SURFACE = '#FBF3E8';
const PANEL_ASPECT_RATIO = 1086 / 1448;

type BodySystemTouchZone = {
  id: DemoBodySystem['id'];
  label: string;
  left: `${number}%`;
  top: `${number}%`;
};

const TOUCH_ZONE_SIZE = {
  width: '14.8%' as const,
  height: '10.8%' as const
};

const systemTouchZones: BodySystemTouchZone[] = [
  { id: 'hormonal', label: 'Гормоны', left: '13.4%', top: '18.9%' },
  { id: 'energy', label: 'Метаболизм', left: '13.4%', top: '36.1%' },
  { id: 'stress_recovery', label: 'Стресс', left: '13.4%', top: '53.0%' },
  { id: 'sleep', label: 'Сон', left: '13.4%', top: '69.9%' },
  { id: 'thyroid', label: 'Щитовидка', left: '71.8%', top: '18.9%' },
  { id: 'nutritional', label: 'Питание', left: '71.8%', top: '36.1%' },
  { id: 'inflammation', label: 'Воспаление', left: '71.8%', top: '53.0%' },
  { id: 'digestive', label: 'Пищеварение', left: '71.8%', top: '69.9%' }
];

const summarySections = [
  {
    title: 'Главные ограничения',
    items: demoBodyOverview.limitingFactors
  },
  {
    title: 'Что поддерживает состояние',
    items: demoBodyOverview.supportingFactors
  },
  {
    title: 'Что улучшать в первую очередь',
    items: [demoBodyOverview.recommendedAction]
  }
];

export default function BodyScreen() {
  const { t } = useI18n();

  return (
    <ScreenContainer contentStyle={styles.scrollContent}>
      <BodyPlaque title={t('body.title')} subtitle={t('body.subtitle')} />

      <View style={styles.contentBody}>
        <BodySystemsPanel />
        <View style={styles.actionButtons}>
          <BodyActionButton label={t('body.openAnalyses')} onPress={() => router.push('/analyses')} />
          <BodyActionButton label={t('body.openBraverman')} onPress={() => router.push('/braverman-test')} />
        </View>
        <BodyStateSummary />
      </View>
    </ScreenContainer>
  );
}

function BodySystemsPanel() {
  return (
    <View style={styles.systemsPanel}>
      <Image source={bodySystemsPanel} resizeMode="stretch" style={styles.systemsPanelImage} />

      {systemTouchZones.map((zone) => (
        <Pressable
          key={zone.id}
          accessibilityRole="button"
          accessibilityLabel={zone.label}
          hitSlop={0}
          onPress={() => router.push({ pathname: '/body-system/[id]', params: { id: zone.id } })}
          style={({ pressed }) => [
            styles.touchZone,
            {
              left: zone.left,
              top: zone.top,
              width: TOUCH_ZONE_SIZE.width,
              height: TOUCH_ZONE_SIZE.height
            },
            pressed && styles.touchZonePressed
          ]}
        />
      ))}
    </View>
  );
}

function BodyActionButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
    >
      <AppText numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} style={styles.actionButtonText}>
        {label}
      </AppText>
    </Pressable>
  );
}

function BodyStateSummary() {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <View style={styles.summaryIcon}>
          <Ionicons name="analytics-outline" size={22} color={colors.accent} />
        </View>
        <View style={styles.summaryTitleBlock}>
          <AppText style={styles.summaryTitle}>Общее состояние тела</AppText>
          <AppText style={styles.summaryHelper}>{demoBodyOverview.summary}</AppText>
        </View>
      </View>

      <View style={styles.summaryScoreRow}>
        <View style={styles.summaryScoreBadge}>
          <AppText style={styles.summaryScoreValue}>{demoBodyOverview.score}</AppText>
          <AppText style={styles.summaryScoreSuffix}>/100</AppText>
        </View>
        <View style={styles.summaryMeta}>
          <View style={styles.summaryPill}>
            <AppText style={styles.summaryPillText}>{demoBodyOverview.sourceLabel}</AppText>
          </View>
          <AppText style={styles.summaryStatus}>{demoBodyOverview.statusLabel}</AppText>
          <AppText style={styles.summaryTrend}>
            Тренд: {demoBodyOverview.trendLabel} · {demoBodyOverview.confidenceLabel}
          </AppText>
        </View>
      </View>

      <AppText style={styles.summaryMainText}>{demoBodyOverview.recommendedAction}</AppText>

      <View style={styles.summarySections}>
        {summarySections.map((section) => (
          <View key={section.title} style={styles.summarySection}>
            <AppText style={styles.summarySectionTitle}>{section.title}</AppText>
            {section.items.map((item) => (
              <View key={item} style={styles.summaryListItem}>
                <View style={styles.summaryListDot} />
                <AppText style={styles.summarySectionText}>{item}</AppText>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.sourceBlock}>
        <AppText style={styles.sourceTitle}>Основано на демо-данных</AppText>
        {demoBodyOverview.sourceDetails.map((source) => (
          <AppText key={source} style={styles.sourceText}>
            {source}
          </AppText>
        ))}
      </View>
    </View>
  );
}

function BodyPlaque({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <ImageBackground
      source={bodyHeaderPlaque}
      resizeMode="cover"
      style={styles.bodyPlaque}
      imageStyle={styles.bodyPlaqueArtwork}
    >
      <View style={styles.bodyPlaqueText}>
        <View style={styles.bodyAccentLine} />
        <AppText numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.88} style={styles.bodyPlaqueTitle}>
          {title}
        </AppText>
        <AppText numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.86} style={styles.bodyPlaqueSubtitle}>
          {subtitle}
        </AppText>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 0,
    paddingHorizontal: 0
  },
  bodyPlaque: {
    width: '100%',
    height: 112,
    minHeight: 108,
    backgroundColor: BODY_PLAQUE_SURFACE,
    borderWidth: 1,
    borderColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    overflow: 'hidden'
  },
  bodyPlaqueArtwork: {
    backgroundColor: BODY_PLAQUE_SURFACE,
    transform: [{ translateX: 48 }]
  },
  bodyPlaqueText: {
    justifyContent: 'center',
    width: '62%',
    maxWidth: 250,
    minWidth: 0
  },
  bodyAccentLine: {
    width: 52,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginBottom: 8
  },
  bodyPlaqueTitle: {
    color: colors.primary,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '900'
  },
  bodyPlaqueSubtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 20,
    marginTop: 4
  },
  contentBody: {
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 10
  },
  actionButtons: {
    width: '100%',
    maxWidth: 430,
    gap: 12,
    marginTop: 18
  },
  actionButton: {
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 3
  },
  actionButtonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }]
  },
  actionButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
    textAlign: 'center'
  },
  summaryCard: {
    width: '100%',
    maxWidth: 430,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    padding: 18,
    marginTop: 18,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 3
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12
  },
  summaryIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  summaryTitleBlock: {
    flex: 1,
    minWidth: 0
  },
  summaryTitle: {
    color: colors.primary,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900'
  },
  summaryHelper: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6
  },
  summaryScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 16
  },
  summaryScoreBadge: {
    width: 78,
    height: 78,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  summaryScoreValue: {
    color: colors.accent,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '900'
  },
  summaryScoreSuffix: {
    color: colors.textOnPrimaryMuted,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '800'
  },
  summaryMeta: {
    flex: 1,
    minWidth: 0
  },
  summaryPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 14
  },
  summaryPillText: {
    color: colors.primary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800'
  },
  summaryStatus: {
    color: colors.primary,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
    marginTop: 8
  },
  summaryTrend: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3
  },
  summaryMainText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14
  },
  summarySections: {
    gap: 10,
    marginTop: 16
  },
  summarySection: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.background,
    padding: 14
  },
  summarySectionTitle: {
    color: colors.primary,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800'
  },
  summarySectionText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    flex: 1
  },
  summaryListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8
  },
  summaryListDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginTop: 7
  },
  sourceBlock: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.background,
    padding: 14,
    marginTop: 14
  },
  sourceTitle: {
    color: colors.primary,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900'
  },
  sourceText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5
  },
  systemsPanel: {
    width: '100%',
    maxWidth: 430,
    aspectRatio: PANEL_ASPECT_RATIO,
    overflow: 'hidden'
  },
  systemsPanelImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  touchZone: {
    position: 'absolute',
    borderRadius: 22
  },
  touchZonePressed: {
    backgroundColor: 'rgba(255, 240, 182, 0.14)'
  }
});
