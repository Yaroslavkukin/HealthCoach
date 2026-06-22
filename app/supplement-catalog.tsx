import { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import {
  supplementsCatalog,
  type SupplementManufacturer,
  type SupplementProduct
} from '@/data/supplementsCatalog';
import { useI18n, type Language } from '@/i18n';
import { colors } from '@/theme/colors';

type CatalogSingleFilter = 'all' | 'beeProduct' | SupplementManufacturer;

const catalogHeaderIllustration = require('../assets/images/catalog-header-illustration.png');
const catalogPremiumBanner = require('../assets/images/catalog-premium-banner.png');
const AM_BOOST_DOCUMENT_LABEL = 'AM BOOST';

export default function SupplementCatalogScreen() {
  const { t, language } = useI18n();
  const [activeFilter, setActiveFilter] = useState<CatalogSingleFilter>('all');
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [orderingProductId, setOrderingProductId] = useState<string | null>(null);
  const catalogTitle = language === 'ru' ? 'Каталог товаров' : 'Product catalog';

  const filterOptions = [
    { id: 'all' as const, label: t('supplements.catalogFilterAll') },
    { id: 'beeProduct' as const, label: t('supplements.catalogFilterBeeProducts') },
    { id: 'EVALITE' as const, label: 'EVALITE' },
    { id: 'HIVITAL' as const, label: 'HIVITAL' },
    { id: 'AM BOOST' as const, label: AM_BOOST_DOCUMENT_LABEL },
    { id: 'Nootropics Depot' as const, label: 'Nootropics Depot' },
    { id: 'NOW Foods' as const, label: 'NOW Foods' }
  ];

  const visibleProducts = useMemo(() => {
    if (activeFilter === 'all') {
      return supplementsCatalog;
    }

    if (activeFilter === 'beeProduct') {
      return supplementsCatalog.filter((product) => product.type === 'beeProduct');
    }

    return supplementsCatalog.filter(
      (product) => product.type === 'supplement' && product.manufacturer === activeFilter
    );
  }, [activeFilter]);

  return (
    <SafeAreaView style={styles.screenRoot}>
      <CatalogHeader title={catalogTitle} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.premiumBannerFrame}>
          <Image source={catalogPremiumBanner} resizeMode="cover" style={styles.premiumBannerImage} />
        </View>

        <View style={styles.contentBody}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterContent}
          >
            {filterOptions.map((option) => {
              const selected = activeFilter === option.id;

              return (
                <Pressable
                  key={option.id}
                  accessibilityRole="button"
                  onPress={() => setActiveFilter(option.id)}
                  style={({ pressed }) => [
                    styles.filterButton,
                    option.id === 'AM BOOST' && styles.amBoostFilterButton,
                    option.id === 'NOW Foods' && styles.nowFoodsFilterButton,
                    selected && styles.filterButtonSelected,
                    pressed && styles.pressed
                  ]}
                >
                  <AppText numberOfLines={1} style={[styles.filterText, selected && styles.filterTextSelected]}>
                    {option.label}
                  </AppText>
                </Pressable>
              );
            })}
          </ScrollView>

          {visibleProducts.length > 0 ? (
            <View style={styles.productList}>
              {visibleProducts.map((product) => (
                <CatalogProductCard
                  key={product.id}
                  product={product}
                  language={language}
                  expanded={expandedProductId === product.id}
                  ordering={orderingProductId === product.id}
                  onToggleDetails={() =>
                    setExpandedProductId((currentId) => (currentId === product.id ? null : product.id))
                  }
                  onToggleOrder={() =>
                    setOrderingProductId((currentId) => (currentId === product.id ? null : product.id))
                  }
                  t={t}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <AppText style={styles.emptyStateText}>{t('supplements.catalogEmpty')}</AppText>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CatalogHeader({ title }: { title: string }) {
  return (
    <View style={styles.headerCard}>
      <View pointerEvents="none" style={styles.headerWave} />
      <View pointerEvents="none" style={styles.headerWaveSoft} />
      <View pointerEvents="none" style={styles.headerIllustrationWrapper}>
        <Image
          source={catalogHeaderIllustration}
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
        <AppText numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} style={styles.headerTitle}>
          {title}
        </AppText>
      </View>

      <View style={styles.headerActionSpacer} />
    </View>
  );
}

function CatalogProductCard({
  product,
  language,
  expanded,
  ordering,
  onToggleDetails,
  onToggleOrder,
  t
}: {
  product: SupplementProduct;
  language: Language;
  expanded: boolean;
  ordering: boolean;
  onToggleDetails: () => void;
  onToggleOrder: () => void;
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
  const productTypeLabel =
    product.type === 'beeProduct' ? t('supplements.type.beeProduct') : t('supplements.type.supplement');

  const openSellerSite = () => {
    if (product.productUrl) {
      void Linking.openURL(product.productUrl);
    }
  };

  return (
    <View style={styles.productCard}>
      <View style={styles.productHeader}>
        <View style={styles.productImageFrame}>
          <Image source={product.image} resizeMode="contain" style={styles.productImage} />
        </View>

        <View style={styles.productTitleBlock}>
          <View style={styles.badgeRow}>
            <View style={styles.typeBadge}>
              <AppText style={styles.typeBadgeText}>{productTypeLabel}</AppText>
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

      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          onPress={onToggleDetails}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
        >
          <AppText style={styles.secondaryButtonText}>
            {expanded ? t('supplements.hideDetails') : t('supplements.catalogDetails')}
          </AppText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onToggleOrder}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        >
          <AppText style={styles.primaryButtonText}>{t('supplements.catalogOrder')}</AppText>
        </Pressable>
      </View>

      {expanded ? (
        <View style={styles.expandedContent}>
          <InfoRow label={t('supplements.detail.details')} value={detailedDescription} />
          <InfoRow label={t('supplements.detail.instruction')} value={intakeInstruction} />
          <InfoRow label={t('supplements.detail.course')} value={course} />
          <InfoRow label={t('supplements.detail.compatibility')} value={compatibilityNote} />
          <InfoRow label={t('supplements.detail.safety')} value={safetyNote} tone="warning" />
        </View>
      ) : null}

      {ordering ? (
        <View style={styles.orderPlaceholder}>
          <AppText variant="subtitle" style={styles.orderTitle}>
            {t('supplements.catalogOrderAiTitle')}
          </AppText>
          <AppText variant="body" style={styles.orderText}>
            {t('supplements.catalogOrderAiBody')}
          </AppText>

          {product.productUrl ? (
            <Pressable
              accessibilityRole="link"
              onPress={openSellerSite}
              style={({ pressed }) => [styles.sellerButton, pressed && styles.pressed]}
            >
              <AppText style={styles.sellerButtonText}>{t('supplements.catalogOpenSellerSite')}</AppText>
            </Pressable>
          ) : (
            <AppText variant="caption" style={styles.noSellerText}>
              {t('supplements.catalogNoSellerLink')}
            </AppText>
          )}
        </View>
      ) : null}
    </View>
  );
}

function FactPill({ label, value }: { label: string; value?: string }) {
  if (!value) {
    return null;
  }

  return (
    <View style={styles.factPill}>
      <AppText style={styles.factLabel}>{label}</AppText>
      <AppText style={styles.factValue}>{value}</AppText>
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
    marginRight: 24,
    zIndex: 1
  },
  headerTitle: {
    color: colors.primary,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900'
  },
  headerActionSpacer: {
    width: 40,
    height: 40,
    zIndex: 1
  },
  scrollView: {
    flex: 1
  },
  content: {
    paddingBottom: 120
  },
  premiumBannerFrame: {
    width: '100%',
    aspectRatio: 1880 / 782,
    backgroundColor: '#06120C',
    borderRadius: 0,
    overflow: 'hidden'
  },
  premiumBannerImage: {
    width: '100%',
    height: '100%'
  },
  contentBody: {
    paddingHorizontal: 20,
    paddingTop: 16
  },
  filterScroll: {
    marginBottom: 16
  },
  filterContent: {
    gap: 8,
    paddingRight: 2
  },
  filterButton: {
    flexShrink: 0,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center'
  },
  amBoostFilterButton: {
    minWidth: 104
  },
  nowFoodsFilterButton: {
    minWidth: 104
  },
  filterButtonSelected: {
    backgroundColor: colors.primary
  },
  filterText: {
    color: colors.primary,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '900',
    flexShrink: 0
  },
  filterTextSelected: {
    color: colors.textOnPrimary
  },
  productList: {
    gap: 14
  },
  emptyState: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 22,
    alignItems: 'center'
  },
  emptyStateText: {
    color: colors.primary,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900'
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
  productHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start'
  },
  productImageFrame: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: '#FFF8EA',
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center'
  },
  productImage: {
    width: 60,
    height: 60
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
    maxWidth: 138
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
    marginTop: 10
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
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14
  },
  secondaryButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900'
  },
  primaryButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12
  },
  primaryButtonText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900'
  },
  expandedContent: {
    marginTop: 4
  },
  orderPlaceholder: {
    marginTop: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.primary,
    padding: 14
  },
  orderTitle: {
    color: colors.textOnPrimary,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900'
  },
  orderText: {
    color: colors.textOnPrimaryMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6
  },
  sellerButton: {
    minHeight: 42,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginTop: 12
  },
  sellerButtonText: {
    color: colors.primary,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900'
  },
  noSellerText: {
    color: colors.textOnPrimaryMuted,
    marginTop: 10
  },
  pressed: {
    opacity: 0.82
  }
});
