import { useState } from 'react';
import { router } from 'expo-router';
import { TextInput, StyleSheet } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { upsertProfileDraft } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

export default function ProfileSetupScreen() {
  const [saveMessage, setSaveMessage] = useState('Profile will use mock fallback unless Supabase auth is configured.');

  async function saveProfile() {
    const result = await upsertProfileDraft({
      email: 'demo@healthcoach.local',
      firstName: 'Yaroslav',
      lastName: 'Demo',
      age: 30,
      gender: 'not_specified',
      heightCm: 180,
      weightKg: 78,
      country: 'Russia',
      city: 'Moscow'
    });

    setSaveMessage(result.message);
    router.push('/onboarding/delivery');
  }

  return (
    <ScreenContainer>
      <AppText variant="title">Personal Profile</AppText>
      <AppText variant="body">Enter your data once. Health Coach will reuse it across recommendations and future delivery flows.</AppText>
      <StateNotice title="Profile persistence" message={saveMessage} variant="info" />
      <SectionCard>
        {['First name', 'Last name', 'Age', 'Gender', 'Height cm', 'Weight kg', 'Main goal', 'Work type', 'Activity level', 'Sleep schedule', 'Stress level', 'Current symptoms'].map((placeholder) => (
          <TextInput key={placeholder} placeholder={placeholder} placeholderTextColor={colors.textMuted} style={styles.input} />
        ))}
        <PrimaryButton label="Continue to Delivery" onPress={saveProfile} />
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
