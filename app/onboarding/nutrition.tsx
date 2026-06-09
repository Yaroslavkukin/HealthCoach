import { router } from 'expo-router';
import { TextInput, StyleSheet } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { colors } from '@/theme/colors';

export default function NutritionAssessmentScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">Nutrition</AppText>
      <AppText variant="body">Describe what you usually eat so Nutrition AI can personalize your plan.</AppText>
      <SectionCard>
        <TextInput placeholder="Typical breakfast, lunch, dinner, snacks, sugar, water" placeholderTextColor={colors.textMuted} multiline style={styles.textArea} />
        <PrimaryButton label="Generate AI Health Profile" onPress={() => router.push('/onboarding/ai-processing')} />
      </SectionCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  textArea: { minHeight: 180, backgroundColor: colors.cardElevated, color: colors.textPrimary, borderRadius: 14, padding: 14, textAlignVertical: 'top' }
});
