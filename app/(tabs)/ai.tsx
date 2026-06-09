import { TextInput, StyleSheet } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { colors } from '@/theme/colors';

export default function AIScreen() {
  return (
    <ScreenContainer>
      <AppText variant="title">AI Assistant</AppText>
      <AppText variant="body">Ask about biomarkers, supplements, nutrition, symptoms, or your plan.</AppText>
      <SectionCard>
        <AppText variant="subtitle">Example Questions</AppText>
        <AppText variant="body">Why is my cortisol high?</AppText>
        <AppText variant="body">Can I take magnesium and zinc together?</AppText>
        <AppText variant="body">What should I eat today?</AppText>
      </SectionCard>
      <TextInput placeholder="Ask Health Coach AI..." placeholderTextColor={colors.textMuted} multiline style={styles.input} />
      <PrimaryButton label="Send" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: { minHeight: 120, backgroundColor: colors.card, color: colors.textPrimary, borderRadius: 18, padding: 16, textAlignVertical: 'top', borderWidth: 1, borderColor: colors.border }
});
