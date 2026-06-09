import { router } from 'expo-router';
import { StyleSheet, TextInput } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { colors } from '@/theme/colors';

export default function DeliverySetupScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Delivery Information</AppText>
      <AppText variant="body">
        Placeholder setup for future supplement and bee product delivery preferences.
      </AppText>

      <SectionCard>
        {['Country', 'City', 'Address', 'Postal code', 'Preferred delivery method', 'CDEK pickup point', 'Russian Post office', 'Delivery comments'].map((placeholder) => (
          <TextInput key={placeholder} placeholder={placeholder} placeholderTextColor={colors.textMuted} style={styles.input} />
        ))}
        <PrimaryButton label="Continue to Start Checklist" onPress={() => router.push('/onboarding/start-checklist')} />
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
