import { router } from 'expo-router';
import { TextInput, StyleSheet } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { colors } from '@/theme/colors';

export default function CreateAccountScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Create Account</AppText>
      <AppText variant="body">Registration starts after subscription so users can explore the app first.</AppText>
      <SectionCard>
        <TextInput placeholder="Email" placeholderTextColor={colors.textMuted} style={styles.input} />
        <TextInput placeholder="Password" placeholderTextColor={colors.textMuted} secureTextEntry style={styles.input} />
        <PrimaryButton label="Continue" onPress={() => router.push('/onboarding/profile')} />
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
