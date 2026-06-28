import { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect, usePathname } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';

const supplementsHeaderIllustration = require('../../assets/images/supplements-header-illustration.png');
const supplementsBreakfastBanner = require('../../assets/images/supplements-breakfast-banner.png');
const timePlaqueImages = {
  morning: require('../../assets/images/supplements-time-morning.png'),
  day: require('../../assets/images/supplements-time-day.png'),
  evening: require('../../assets/images/supplements-time-evening.png')
};
const productImages = {
  honey: require('../../assets/images/bee-product-honey-icon.png'),
  pergaHoney: require('../../assets/images/bee-product-perga-icon.png'),
  pollen: require('../../assets/images/bee-product-pollen-icon.png'),
  royalJelly: require('../../assets/images/bee-product-royal-jelly-icon.png'),
  supplement: require('../../assets/images/supplement-product-icon.png')
};

let isCatalogNavigationLocked = false;

const intakeSchedule = [
  {
    id: 'morning',
    title: 'Утро',
    range: 'с 07:00 до 11:00',
    items: [
      {
        name: 'Витамин D3 + K2',
        dosage: '1 капсула',
        instruction: 'С белковым завтраком для нутритивной поддержки.',
        image: productImages.supplement
      },
      {
        name: 'Омега-3 (EPA/DHA)',
        dosage: '1 капсула',
        instruction: 'С завтраком для поддержки восстановления.',
        image: productImages.supplement
      },
      {
        name: 'Маточное молочко',
        dosage: '1/2 ч. л.',
        instruction: 'Утром с едой, если хорошо переносится.',
        image: productImages.royalJelly
      }
    ]
  },
  {
    id: 'day',
    title: 'Днём',
    range: 'с 12:00 до 16:00',
    items: [
      {
        name: 'Витамин C',
        dosage: '1 капсула',
        instruction: 'Во время или после обеда для поддержки рациона.',
        image: productImages.supplement
      },
      {
        name: 'Пчелиная пыльца',
        dosage: '1/2 ч. л.',
        instruction: 'После еды, начиная с малого количества.',
        image: productImages.pollen
      },
      {
        name: 'Мёд',
        dosage: '1 ч. л.',
        instruction: 'В первой половине дня.',
        image: productImages.honey
      },
      {
        name: 'Перга с мёдом',
        dosage: '1 ч. л.',
        instruction: 'С едой или тёплой водой.',
        image: productImages.pergaHoney
      }
    ]
  },
  {
    id: 'evening',
    title: 'Вечер',
    range: 'с 18:00 до 22:00',
    items: [
      {
        name: 'Магний (цитрат)',
        dosage: '1 капсула',
        instruction: 'За 1-2 часа до сна для вечернего восстановления.',
        image: productImages.supplement
      },
      {
        name: 'Цинк (пиколинат)',
        dosage: '1 капсула',
        instruction: 'После ужина, отдельно от магния при чувствительном желудке.',
        image: productImages.supplement
      }
    ]
  }
] as const;

export default function SupplementsScreen() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [isCatalogOpening, setIsCatalogOpening] = useState(false);

  const resetCatalogNavigationGuard = useCallback(() => {
    isCatalogNavigationLocked = false;
    setIsCatalogOpening(false);
  }, []);

  useFocusEffect(resetCatalogNavigationGuard);

  const openCatalog = useCallback(() => {
    if (isCatalogNavigationLocked || isCatalogOpening || pathname === '/supplement-catalog') {
      return;
    }

    isCatalogNavigationLocked = true;
    setIsCatalogOpening(true);

    try {
      router.push('/supplement-catalog');
    } catch (error) {
      isCatalogNavigationLocked = false;
      setIsCatalogOpening(false);
      throw error;
    }
  }, [isCatalogOpening, pathname]);

  return (
    <SafeAreaView style={styles.screenRoot}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SupplementsHeader title={t('supplements.title')} subtitle={t('supplements.subtitle')} />

        <View style={styles.contentBody}>
          <View style={styles.breakfastBannerFrame}>
            <Image
              source={supplementsBreakfastBanner}
              resizeMode="contain"
              style={styles.breakfastBanner}
            />
          </View>

          <IntakeScheduleSection />

          <View style={styles.bottomActions}>
            <PrimaryButton
              label={t('supplements.mySupplements')}
              onPress={() => router.push('/my-supplements')}
              style={styles.bottomActionButton}
            />
            <PrimaryButton
              label={t('supplements.catalog')}
              disabled={isCatalogOpening}
              onPress={openCatalog}
              style={styles.bottomActionButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function IntakeScheduleSection() {
  return (
    <View style={styles.intakeSection}>
      {intakeSchedule.map((group, groupIndex) => (
        <View
          key={group.id}
          style={[
            styles.timeBlock,
            groupIndex === 0 && styles.timeBlockFirst
          ]}
        >
          <View style={styles.timePlaqueFrame}>
            <Image
              source={timePlaqueImages[group.id]}
              resizeMode="cover"
              style={styles.timePlaque}
            />
          </View>

          <View style={styles.intakeItems}>
            {group.items.map((item, itemIndex) => (
              <View
                key={item.name}
                style={[
                  styles.intakeItem,
                  itemIndex > 0 && styles.intakeItemDivider
                ]}
              >
                <View style={styles.productThumbFrame}>
                  <Image source={item.image} resizeMode="contain" style={styles.productThumb} />
                </View>

                <View style={styles.itemText}>
                  <View style={styles.itemTopLine}>
                    <AppText numberOfLines={2} style={styles.itemName}>{item.name}</AppText>
                    <View style={styles.dosageChip}>
                      <AppText numberOfLines={1} style={styles.dosageText}>{item.dosage}</AppText>
                    </View>
                  </View>
                  <AppText style={styles.itemInstruction}>{item.instruction}</AppText>
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function SupplementsHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.headerPlaque}>
      <View style={styles.headerText}>
        <View style={styles.headerAccentLine} />
        <AppText adjustsFontSizeToFit minimumFontScale={0.88} numberOfLines={1} style={styles.headerTitle}>
          {title}
        </AppText>
        <AppText numberOfLines={2} style={styles.headerSubtitle}>{subtitle}</AppText>
      </View>

      <Image
        source={supplementsHeaderIllustration}
        resizeMode="contain"
        style={styles.headerIllustration}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: colors.background
  },
  scrollContent: {
    paddingTop: 0,
    paddingHorizontal: 0,
    paddingBottom: 120
  },
  contentBody: {
    paddingHorizontal: 20,
    paddingTop: 16
  },
  headerPlaque: {
    width: '100%',
    minHeight: 108,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    overflow: 'hidden'
  },
  headerIllustration: {
    width: 126,
    height: 86,
    marginLeft: 8
  },
  headerText: {
    flex: 1,
    justifyContent: 'center'
  },
  headerAccentLine: {
    width: 52,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginBottom: 8
  },
  headerTitle: {
    color: colors.primary,
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 30,
    lineHeight: 32,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0.35, height: 0 },
    textShadowRadius: 0.2
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 20,
    marginTop: 4
  },
  breakfastBannerFrame: {
    width: '100%',
    aspectRatio: 1628 / 680,
    borderRadius: 24,
    overflow: 'hidden'
  },
  breakfastBanner: {
    width: '100%',
    height: '100%'
  },
  intakeSection: {
    marginTop: 18,
    backgroundColor: colors.primary,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.accent,
    padding: 12,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3
  },
  timeBlock: {
    marginTop: 18
  },
  timeBlockFirst: {
    marginTop: 0
  },
  timePlaqueFrame: {
    width: '100%',
    aspectRatio: 3,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accent,
    overflow: 'hidden',
    backgroundColor: colors.primaryDark
  },
  timePlaque: {
    width: '100%',
    height: '100%'
  },
  intakeItems: {
    marginTop: 0,
    borderRadius: 18,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    overflow: 'hidden'
  },
  intakeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  intakeItemDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.accent
  },
  productThumbFrame: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#FFF8EA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.accent
  },
  productThumb: {
    width: 52,
    height: 52
  },
  itemText: {
    flex: 1,
    minWidth: 0,
    width: 0
  },
  itemTopLine: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6
  },
  itemName: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    width: '100%',
    color: colors.primary,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800'
  },
  dosageChip: {
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 78,
    maxWidth: 96,
    flexShrink: 0,
    alignSelf: 'flex-start',
    alignItems: 'center'
  },
  dosageText: {
    color: colors.textOnPrimary,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700'
  },
  itemInstruction: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 5
  },
  bottomActions: {
    marginTop: 18,
    paddingBottom: 8
  },
  bottomActionButton: {
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.primary
  }
});
