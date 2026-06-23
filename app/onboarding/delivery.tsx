import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { useI18n } from '@/i18n';
import type { TranslationKey } from '@/i18n/translations/en';
import { colors } from '@/theme/colors';

const deliveryPlaceholders = [
  { key: 'country', placeholder: 'onboarding.delivery.country' },
  { key: 'city', placeholder: 'onboarding.delivery.city' },
  { key: 'address', placeholder: 'onboarding.delivery.address' },
  { key: 'postal', placeholder: 'onboarding.delivery.postal' },
  { key: 'method', placeholder: 'onboarding.delivery.method' },
  { key: 'cdek', placeholder: 'onboarding.delivery.cdek' },
  { key: 'post', placeholder: 'onboarding.delivery.post' },
  { key: 'comments', placeholder: 'onboarding.delivery.comments' }
] as const satisfies readonly { key: keyof DeliveryForm; placeholder: TranslationKey }[];

type DeliveryForm = {
  country: string;
  city: string;
  address: string;
  postal: string;
  method: string;
  cdek: string;
  post: string;
  comments: string;
};

const initialDeliveryForm: DeliveryForm = {
  country: '',
  city: '',
  address: '',
  postal: '',
  method: '',
  cdek: '',
  post: '',
  comments: ''
};

export default function DeliverySetupScreen() {
  const { t } = useI18n();
  const [form, setForm] = useState<DeliveryForm>(initialDeliveryForm);

  function updateField(key: keyof DeliveryForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <ScreenContainer>
      <ScreenHeader>
        <AppText variant="title">{t('onboarding.delivery.title')}</AppText>
        <AppText variant="body">{t('onboarding.delivery.subtitle')}</AppText>
      </ScreenHeader>
      <StateNotice title={t('onboarding.delivery.title')} message={t('onboarding.delivery.initialSave')} variant="info" />

      <SectionCard>
        {deliveryPlaceholders.map((field) => (
          <TextInput
            key={field.key}
            placeholder={t(field.placeholder)}
            placeholderTextColor={colors.textSoft}
            value={form[field.key]}
            onChangeText={(value) => updateField(field.key, value)}
            style={styles.input}
          />
        ))}
      </SectionCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.surfaceMuted,
    color: colors.text,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderSoft
  }
});
