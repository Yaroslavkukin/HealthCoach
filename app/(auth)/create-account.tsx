import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, TextInput } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { accessRoutes, getAccessProgressLabel, getAccessStageDescription } from '@/features/access/accessModel';
import { registerPlaceholderAccount } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

export default function CreateAccountScreen() {
  const [persistenceMessage, setPersistenceMessage] = useState('Auth placeholder has not been checked yet.');

  async function continueWithPlaceholderAccount() {
    const result = await registerPlaceholderAccount('demo@healthcoach.local');
    setPersistenceMessage(result.message);
    router.push(accessRoutes.profile);
  }

  return (
    <ScreenContainer>
      <AppText variant="title">Create Account</AppText>
      <AppText variant="body">Registration starts after mock subscription so users can explore the app first.</AppText>

      <StateNotice
        title={getAccessProgressLabel('accountCreation')}
        message={`${getAccessStageDescription('accountCreation')} ${persistenceMessage}`}
        variant="info"
      />

      <SectionCard>
        <TextInput placeholder="Email" placeholderTextColor={colors.textMuted} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
        <TextInput placeholder="Password" placeholderTextColor={colors.textMuted} secureTextEntry style={styles.input} />
        <PrimaryButton label="Create Mock Account" onPress={continueWithPlaceholderAccount} />
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">Future Login Options</AppText>
        <AppText variant="body">Apple Login and Google Login will be added in a later phase.</AppText>
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
