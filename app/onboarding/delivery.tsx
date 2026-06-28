import { Fragment, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SectionCard } from '@/components/SectionCard';
import { useI18n } from '@/i18n';
import type { TranslationKey } from '@/i18n/translations/en';
import { colors } from '@/theme/colors';

const deliveryHeaderPlaque = require('../../assets/images/delivery-header-plaque-final.png');
const deliveryBottomDecoration = require('../../assets/images/delivery-bottom-decoration.png');

const deliveryDecorationAspectRatio = 756 / 330;
const compactScreenHeight = 760;
const shortScreenHeight = 820;

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
  const { height, width } = useWindowDimensions();
  const [form, setForm] = useState<DeliveryForm>(initialDeliveryForm);
  const isCompactScreen = height < compactScreenHeight;
  const isShortScreen = height < shortScreenHeight;
  const fieldRowHeight = isCompactScreen ? 44 : isShortScreen ? 48 : 52;
  const decorationWidth = Math.min(width - 36, isCompactScreen ? 318 : 372);
  const decorationHeight = decorationWidth / deliveryDecorationAspectRatio;

  function updateField(key: keyof DeliveryForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <SafeAreaView style={styles.screenRoot}>
      <DeliveryHeader />

      <View style={styles.content}>
        <SectionCard style={styles.formCard}>
          <View style={styles.formPanel}>
            {deliveryPlaceholders.map((field, index) => (
              <Fragment key={field.key}>
                <TextInput
                  placeholder={t(field.placeholder)}
                  placeholderTextColor={colors.textOnPrimaryMuted}
                  value={form[field.key]}
                  onChangeText={(value) => updateField(field.key, value)}
                  style={[styles.input, { height: fieldRowHeight }]}
                />
                {index < deliveryPlaceholders.length - 1 ? <View style={styles.inputDivider} /> : null}
              </Fragment>
            ))}
          </View>
        </SectionCard>

        <Image
          source={deliveryBottomDecoration}
          resizeMode="contain"
          style={[
            styles.bottomDecoration,
            {
              width: decorationWidth,
              height: decorationHeight
            }
          ]}
        />
      </View>
    </SafeAreaView>
  );
}

function DeliveryHeader() {
  return (
    <View style={styles.headerCard}>
      <Image
        source={deliveryHeaderPlaque}
        resizeMode="cover"
        style={styles.headerImage}
      />
      <View pointerEvents="none" style={styles.headerBackButtonMask} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Назад"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.headerBackButton, pressed && styles.headerBackButtonPressed]}
      >
        <Ionicons name="chevron-back" size={22} color={colors.textOnPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12
  },
  headerCard: {
    height: 82,
    minHeight: 82,
    maxHeight: 82,
    width: '100%',
    alignSelf: 'stretch',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
    backgroundColor: colors.background,
    paddingVertical: 0,
    paddingHorizontal: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowOpacity: 0,
    elevation: 0
  },
  headerImage: {
    position: 'absolute',
    left: '-6%',
    top: '-6%',
    width: '112%',
    height: '112%',
    backgroundColor: colors.background
  },
  headerBackButtonMask: {
    position: 'absolute',
    left: 0,
    top: 16,
    width: 48,
    height: 48,
    backgroundColor: colors.background,
    borderRadius: 14,
    zIndex: 1
  },
  headerBackButton: {
    position: 'absolute',
    left: 6,
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  },
  headerBackButtonPressed: {
    opacity: 0.78
  },
  formCard: {
    width: '100%',
    marginBottom: 0
  },
  formPanel: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.accent,
    overflow: 'hidden'
  },
  input: {
    height: 52,
    color: colors.textOnPrimaryMuted,
    paddingHorizontal: 22,
    paddingVertical: 0,
    fontSize: 17,
    lineHeight: 22,
    textAlignVertical: 'center',
    includeFontPadding: false
  },
  inputDivider: {
    height: 1,
    marginHorizontal: 22,
    backgroundColor: colors.accent
  },
  bottomDecoration: {
    alignSelf: 'center'
  }
});
