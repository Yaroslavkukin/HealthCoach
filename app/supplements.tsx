import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { SupplementCard } from '@/components/SupplementCard';
import { demoSupplements } from '@/data/mock/healthProfile';
import { useI18n } from '@/i18n';
import { translateSupplement } from '@/i18n/mockContent';
import { colors } from '@/theme/colors';
import type { SupplementStackType } from '@/types';

export default function SupplementsScreen() {
  const { t } = useI18n();
  const [stack, setStack] = useState<SupplementStackType>('essential');
  const visibleSupplements = demoSupplements.filter((supplement) => stack === 'complete' || supplement.stackType === 'essential');
  const displaySupplements = visibleSupplements.map((supplement) => translateSupplement(supplement, t));

  return (
    <ScreenContainer>
      <AppText variant="title">{t('supplements.title')}</AppText>
      <AppText variant="body">{t('supplements.subtitle')}</AppText>

      <View style={styles.segment}>
        {(['essential', 'complete'] as SupplementStackType[]).map((item) => (
          <Pressable key={item} onPress={() => setStack(item)} style={[styles.segmentButton, stack === item && styles.segmentButtonActive]}>
            <AppText style={[styles.segmentText, stack === item && styles.segmentTextActive]}>{t(item === 'essential' ? 'common.essential' : 'common.complete')}</AppText>
          </Pressable>
        ))}
      </View>

      {visibleSupplements.map((supplement) => (
        <SupplementCard key={supplement.id} supplement={supplement} />
      ))}

      <SectionCard>
        <AppText variant="subtitle">{t('supplements.scheduleNotes')}</AppText>
        {displaySupplements.map((supplement) => (
          <AppText key={`${supplement.id}-schedule`} variant="caption">
            {supplement.name}: {supplement.foodInstruction}. {supplement.compatibilityNotes}
          </AppText>
        ))}
      </SectionCard>

      <SectionCard>
        <AppText variant="caption">{t('mock.supplement.safety')}</AppText>
      </SectionCard>

      <PrimaryButton label={t('supplements.beeProducts')} onPress={() => router.push('/bee-products')} />
      <PrimaryButton label={t('supplements.backToday')} variant="secondary" onPress={() => router.push('/(tabs)/today')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 16
  },
  segmentButton: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border
  },
  segmentButtonActive: {
    backgroundColor: colors.accent
  },
  segmentText: {
    color: colors.textSecondary,
    fontWeight: '800',
    textTransform: 'capitalize'
  },
  segmentTextActive: {
    color: colors.background
  }
});
