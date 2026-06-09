import { router } from 'expo-router';
import { StyleSheet, TextInput } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { saveOnboardingChecklist } from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

export default function NutritionAssessmentScreen() {
  async function saveNutritionAndContinue() {
    await saveOnboardingChecklist({ nutritionCompleted: true });
    router.push('/onboarding/ai-processing');
  }

  return (
    <ScreenContainer>
      <AppText variant="title">Nutrition Description</AppText>
      <AppText variant="body">Describe what you usually eat so Nutrition AI can personalize your plan later.</AppText>
      <SectionCard>
        {['Typical breakfast', 'Lunch and dinner pattern', 'Sugar and processed food', 'Water intake', 'Restaurant or fast food habits'].map((placeholder) => (
          <TextInput key={placeholder} placeholder={placeholder} placeholderTextColor={colors.textMuted} multiline style={styles.input} />
        ))}
        <PrimaryButton label="Generate Mock AI Health Profile" onPress={saveNutritionAndContinue} />
      </SectionCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 72,
    backgroundColor: colors.cardElevated,
    color: colors.textPrimary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border
  }
});
