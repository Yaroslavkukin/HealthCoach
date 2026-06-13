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
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [noticeVariant, setNoticeVariant] = useState<'info' | 'error'>('info');

  function updateField(key: keyof DeliveryForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveDelivery() {
    const result = await upsertDeliveryDraft({
      country: textOrUndefined(form.country),
      city: textOrUndefined(form.city),
      addressLine1: textOrUndefined(form.address),
      postalCode: textOrUndefined(form.postal),
      preferredDeliveryProvider: textOrUndefined(form.method),
      cdekPickupPointAddress: textOrUndefined(form.cdek),
      russianPostOfficeAddress: textOrUndefined(form.post),
      deliveryNotes: textOrUndefined(form.comments)
    });

    setSaveMessage(translatePersistenceMessage(result.message, t));
    setNoticeVariant(result.ok ? 'info' : 'error');

    if (result.ok) {
      router.push(accessRoutes.startChecklist);
    }
  }

  return (
    <ScreenContainer>
      <AppText variant="title">{t('onboarding.delivery.title')}</AppText>
      <AppText variant="body">{t('onboarding.delivery.subtitle')}</AppText>
      <StateNotice title={t('onboarding.delivery.title')} message={saveMessage ?? t('onboarding.delivery.initialSave')} variant={noticeVariant} />

      <SectionCard>
        {deliveryPlaceholders.map((field) => (
          <TextInput
            key={field.key}
            placeholder={t(field.placeholder)}
            placeholderTextColor={colors.textMuted}
            value={form[field.key]}
            onChangeText={(value) => updateField(field.key, value)}
            style={styles.input}
          />
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

function textOrUndefined(value: string) {
  const text = value.trim();
  return text || undefined;
}
