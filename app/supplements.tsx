import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { SupplementCard } from '@/components/SupplementCard';
import { demoSupplements, supplementSafetyNote } from '@/data/mock/healthProfile';
import { colors } from '@/theme/colors';
import type { SupplementStackType } from '@/types';

export default function SupplementsScreen() {
  const [stack, setStack] = useState<SupplementStackType>('essential');
  const visibleSupplements = demoSupplements.filter((supplement) => stack === 'complete' || supplement.stackType === 'essential');

  return (
    <ScreenContainer>
      <AppText variant="title">Supplements</AppText>
      <AppText variant="body">Essential stack first. Complete stack is optional.</AppText>

      <View style={styles.segment}>
        {(['essential', 'complete'] as SupplementStackType[]).map((item) => (
          <Pressable key={item} onPress={() => setStack(item)} style={[styles.segmentButton, stack === item && styles.segmentButtonActive]}>
            <AppText style={[styles.segmentText, stack === item && styles.segmentTextActive]}>{item}</AppText>
          </Pressable>
        ))}
      </View>

      {visibleSupplements.map((supplement) => (
        <SupplementCard key={supplement.id} supplement={supplement} />
      ))}

      <SectionCard>
        <AppText variant="subtitle">Schedule Notes</AppText>
        {visibleSupplements.map((supplement) => (
          <AppText key={`${supplement.id}-schedule`} variant="caption">
            {supplement.name}: {supplement.foodInstruction}. {supplement.compatibilityNotes}
          </AppText>
        ))}
      </SectionCard>

      <SectionCard>
        <AppText variant="caption">{supplementSafetyNote}</AppText>
      </SectionCard>

      <PrimaryButton label="Bee Product Optimization" onPress={() => router.push('/bee-products')} />
      <PrimaryButton label="Back to Today" variant="secondary" onPress={() => router.push('/(tabs)/today')} />
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
