import { router } from 'expo-router';
import { TextInput, StyleSheet } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { colors } from '@/theme/colors';

export default function ProfileSetupScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Personal Profile</AppText>
      <AppText variant="body">Enter your data once. Health Coach will reuse it across recommendations and future delivery flows.</AppText>
      <SectionCard>
        {['First name', 'Age', 'Gender', 'Height cm', 'Weight kg', 'City', 'CDEK / Russian Post pickup point'].map((placeholder) => (
          <TextInput key={placeholder} placeholder={placeholder} placeholderTextColor={colors.textMuted} style={styles.input} />
        ))}
        <PrimaryButton label="Save Profile" onPress={() => router.push('/onboarding/start-checklist')} />
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
