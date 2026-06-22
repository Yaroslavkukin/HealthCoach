import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { recommendedSupplementProducts, type SupplementProduct } from '@/data/supplementsCatalog';
import { useI18n } from '@/i18n';
import type { Language } from '@/i18n';
import { colors } from '@/theme/colors';

const mySupplementsHeaderIllustration = require('../assets/images/my-supplements-header-illustration.png');
const displayedRecommendedProducts = recommendedSupplementProducts;

export default function MySupplementsScreen() {
  const { t, language } = useI18n();
  const [expandedProductId, setExpandedProductId] = useState<string | null>(displayedRecommendedProducts[0]?.id ?? null);

  return (
    <SafeAreaView style={styles.screenRoot}>
      <MySupplementsHeader
        title={t('supplements.mySupplements')}
        subtitle={t('supplements.mySupplementsSubtitle')}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.productList}>
          {displayedRecommendedProducts.map((product) => (
            <SupplementProductCard
              key={product.id}
              product={product}
              language={language}
              expanded={expandedProductId === product.id}
              onToggle={() => setExpandedProductId((currentId) => (currentId === product.id ? null : product.id))}
              t={t}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MySupplementsHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.headerCard}>
      <View pointerEvents="none" style={styles.headerWave} />
      <View pointerEvents="none" style={styles.headerWaveSoft} />
      <View pointerEvents="none" style={styles.headerIllustrationWrapper}>
        <Image
          source={mySupplementsHeaderIllustration}
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
        <AppText numberOfLines={1} style={styles.headerTitle}>
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

function SupplementProductCard({
  product,
  language,
  expanded,
  onToggle,
  t
}: {
  product: SupplementProduct;
  language: Language;
  expanded: boolean;
  onToggle: () => void;
  t: ReturnType<typeof useI18n>['t'];
}) {
  const name = getLocalized(product, language, 'name');
  const category = language === 'ru' ? product.categoryRu : product.categoryEn;
  const shortDescription = getLocalized(product, language, 'shortDescription');
  const detailedDescription = getLocalizedOptional(product, language, 'detailedDescription');
  const dosage = getLocalizedOptional(product, language, 'defaultDosage');
  const timing = getLocalizedOptional(product, language, 'timing');
  const intakeInstruction = getLocalizedOptional(product, language, 'intakeInstruction');
  const course = getLocalizedOptional(product, language, 'course');
  const safetyNote = getLocalizedOptional(product, language, 'safetyNote');
  const compatibilityNote = getLocalizedOptional(product, language, 'compatibilityNote');

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onToggle}
      style={({ pressed }) => [styles.productCard, pressed && styles.productCardPressed]}
    >
      <View style={styles.productHeader}>
        <View style={styles.productImageFrame}>
          <Image source={product.image} resizeMode="contain" style={styles.productImage} />
        </View>

        <View style={styles.productTitleBlock}>
          <View style={styles.badgeRow}>
            <View style={styles.typeBadge}>
              <AppText style={styles.typeBadgeText}>
                {product.type === 'beeProduct' ? t('supplements.type.beeProduct') : t('supplements.type.supplement')}
              </AppText>
            </View>
            <View style={styles.categoryBadge}>
              <AppText numberOfLines={1} style={styles.categoryBadgeText}>
                {category}
              </AppText>
            </View>
          </View>

          <AppText variant="subtitle" style={styles.productName}>
            {name}
          </AppText>
          <AppText variant="body" style={styles.productDescription}>
            {shortDescription}
          </AppText>
        </View>
      </View>

      <View style={styles.quickFacts}>
        <FactPill label={t('supplements.detail.dosage')} value={dosage} />
        <FactPill label={t('supplements.detail.timing')} value={timing} />
      </View>

      <InfoRow label={t('supplements.detail.instruction')} value={intakeInstruction} />

      {expanded ? (
        <View style={styles.expandedContent}>
          <InfoRow label={t('supplements.detail.details')} value={detailedDescription} />
          <InfoRow label={t('supplements.detail.course')} value={course} />
          <InfoRow label={t('supplements.detail.compatibility')} value={compatibilityNote} />
          <InfoRow label={t('supplements.detail.safety')} value={safetyNote} tone="warning" />
        </View>
      ) : null}

      <AppText variant="caption" style={styles.toggleText}>
        {expanded ? t('supplements.hideDetails') : t('supplements.showDetails')}
      </AppText>
    </Pressable>
  );
}

function FactPill({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.factPill}>
      <AppText style={styles.factLabel}>{label}</AppText>
      <AppText style={styles.factValue}>{value || '—'}</AppText>
    </View>
  );
}

function InfoRow({
  label,
  value,
  tone = 'default',
  compact = false
}: {
  label: string;
  value?: string;
  tone?: 'default' | 'warning';
  compact?: boolean;
}) {
  if (!value) {
    return null;
  }

  return (
    <View style={[styles.infoRow, compact && styles.infoRowCompact, tone === 'warning' && styles.warningRow]}>
      <AppText style={styles.infoLabel}>{label}</AppText>
      <AppText style={[styles.infoValue, tone === 'warning' && styles.warningText]}>{value}</AppText>
    </View>
  );
}

function getLocalized(product: SupplementProduct, language: Language, field: 'name' | 'shortDescription') {
  return language === 'ru' ? product[`${field}Ru`] : product[`${field}En`];
}

function getLocalizedOptional(
  product: SupplementProduct,
  language: Language,
  field:
    | 'detailedDescription'
    | 'defaultDosage'
    | 'timing'
    | 'intakeInstruction'
    | 'course'
    | 'safetyNote'
    | 'compatibilityNote'
) {
  return language === 'ru' ? product[`${field}Ru`] : product[`${field}En`];
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
    width: 124,
    height: 76,
    opacity: 0.82,
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
    marginRight: 78,
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
  productList: {
    gap: 14
  },
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: 14,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3
  },
  productCardPressed: {
    opacity: 0.92
  },
  productHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start'
  },
  productImageFrame: {
    width: 66,
    height: 66,
    borderRadius: 18,
    backgroundColor: '#FFF8EA',
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center'
  },
  productImage: {
    width: 58,
    height: 58
  },
  productTitleBlock: {
    flex: 1,
    minWidth: 0
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6
  },
  typeBadge: {
    borderRadius: 999,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 9,
    paddingVertical: 4
  },
  typeBadgeText: {
    color: colors.textOnPrimary,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800'
  },
  categoryBadge: {
    borderRadius: 999,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 9,
    paddingVertical: 4,
    maxWidth: 130
  },
  categoryBadgeText: {
    color: colors.primary,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800'
  },
  productName: {
    color: colors.primary,
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '900'
  },
  productDescription: {
    marginTop: 5,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20
  },
  quickFacts: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14
  },
  factPill: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 9
  },
  factLabel: {
    color: colors.textOnPrimaryMuted,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700'
  },
  factValue: {
    color: colors.textOnPrimary,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    marginTop: 2
  },
  infoRow: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.accent,
    paddingTop: 10
  },
  infoRowCompact: {
    paddingTop: 8,
    marginTop: 8
  },
  infoLabel: {
    color: colors.primary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900'
  },
  infoValue: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 3
  },
  warningRow: {
    borderTopColor: colors.accent
  },
  warningText: {
    color: colors.text
  },
  expandedContent: {
    marginTop: 2
  },
  toggleText: {
    color: colors.accent,
    fontWeight: '900',
    marginTop: 12,
    textAlign: 'right'
  }
});
