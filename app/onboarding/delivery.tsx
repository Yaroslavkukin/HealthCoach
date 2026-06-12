import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, TextInput } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { accessRoutes } from '@/features/access/accessModel';
import { useI18n } from '@/i18n';
import { translatePersistenceMessage } from '@/i18n/mockContent';
import type { TranslationKey } from '@/i18n/translations/en';
import { upsertDeliveryDraft } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

const deliveryPlaceholders = [
  'onboarding.delivery.country',
  'onboarding.delivery.city',
  'onboarding.delivery.address',
  'onboarding.delivery.postal',
  'onboarding.delivery.method',
  'onboarding.delivery.cdek',
  'onboarding.delivery.post',
  'onboarding.delivery.comments'
] as const satisfies readonly TranslationKey[];

export default function DeliverySetupScreen() {
  const { t } = useI18n();
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  async function saveDelivery() {
    const result = await upsertDeliveryDraft({
      country: 'Russia',
      city: 'Moscow',
      addressLine1: 'Demo address',
      postalCode: '000000',
      preferredDeliveryProvider: 'CDEK',
      cdekPickupPointAddress: 'Demo CDEK pickup point',
      russianPostOfficeAddress: 'Demo Russian Post office',
      deliveryNotes: 'Mock delivery notes'
    });

    setSaveMessage(translatePersistenceMessage(result.message, t));
    router.push(accessRoutes.startChecklist);
  }

  return (
    <ScreenContainer>
      <AppText variant="title">{t('onboarding.delivery.title')}</AppText>
      <AppText variant="body">{t('onboarding.delivery.subtitle')}</AppText>
      <StateNotice title={t('onboarding.delivery.title')} message={saveMessage ?? t('onboarding.delivery.initialSave')} variant="info" />

      <SectionCard>
        {deliveryPlaceholders.map((placeholder) => (
          <TextInput key={placeholder} placeholder={t(placeholder)} placeholderTextColor={colors.textMuted} style={styles.input} />
        ))}
        <PrimaryButton label={t('onboarding.delivery.continue')} onPress={saveDelivery} />
      </SectionCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.cardElevated,
    color: colors.textPrimary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border
  }
});
