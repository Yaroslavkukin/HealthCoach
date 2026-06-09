import { router } from 'expo-router';
import { TextInput, StyleSheet } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { colors } from '@/theme/colors';

export default function LifestyleScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Lifestyle</AppText>
      <AppText variant="body">Describe your typical day, sleep, stress, work, and physical activity.</AppText>
      <SectionCard>
        <TextInput placeholder="Describe your usual day" placeholderTextColor={colors.textMuted} multiline style={styles.textArea} />
        <PrimaryButton label="Save and Continue" onPress={() => router.push('/onboarding/nutrition')} />
      </SectionCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  textArea: { minHeight: 160, backgroundColor: colors.cardElevated, color: colors.textPrimary, borderRadius: 14, padding: 14, textAlignVertical: 'top' }
});
