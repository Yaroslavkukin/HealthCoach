import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, TextInput } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { accessRoutes, getAccessProgressLabel, getAccessStageDescription } from '@/features/access/accessModel';
import { upsertDeliveryDraft } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

export default function DeliverySetupScreen() {
  const [saveMessage, setSaveMessage] = useState('Delivery data will use mock fallback unless Supabase auth is configured.');

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

    setSaveMessage(result.message);
    router.push(accessRoutes.startChecklist);
  }

  return (
    <ScreenContainer>
      <AppText variant="title">Delivery Information</AppText>
      <AppText variant="body">
        Placeholder setup for future supplement and bee product delivery preferences.
      </AppText>
      <StateNotice title={getAccessProgressLabel('deliverySetup')} message={`${getAccessStageDescription('deliverySetup')} ${saveMessage}`} variant="info" />

      <SectionCard>
        {['Country', 'City', 'Address', 'Postal code', 'Preferred delivery method', 'CDEK pickup point', 'Russian Post office', 'Delivery comments'].map((placeholder) => (
          <TextInput key={placeholder} placeholder={placeholder} placeholderTextColor={colors.textMuted} style={styles.input} />
        ))}
        <PrimaryButton label="Continue to Start Checklist" onPress={saveDelivery} />
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
