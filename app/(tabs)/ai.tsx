import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { demoAssistantQuestions } from '@/data/mock/healthProfile';
import { colors } from '@/theme/colors';

export default function AIScreen() {
  const [answer, setAnswer] = useState('');

  return (
    <ScreenContainer>
      <AppText variant="title">AI Assistant</AppText>
      <AppText variant="body">Ask about biomarkers, supplements, nutrition, symptoms, or your plan.</AppText>

      <StateNotice
        title="Mock assistant"
        message="Answers are fixed demo text in this prototype. Personalized generation runs through secure backend functions when available."
        variant="info"
      />

      <SectionCard>
        <AppText variant="subtitle">Example Questions</AppText>
        {demoAssistantQuestions.map((question) => (
          <AppText key={question} variant="body" onPress={() => setAnswer(`Demo answer for: ${question}`)}>{question}</AppText>
        ))}
      </SectionCard>

      <TextInput placeholder="Ask Health Coach AI..." placeholderTextColor={colors.textMuted} multiline style={styles.input} />
      <PrimaryButton label="Send Mock Question" onPress={() => setAnswer('Demo answer: focus on today’s plan, keep recommendations informational, and consult a qualified professional for medical decisions.')} />

      {answer ? (
        <SectionCard>
          <AppText variant="subtitle">Coach Response</AppText>
          <AppText variant="body">{answer}</AppText>
          <AppText variant="caption">This is not a diagnosis and does not replace professional medical advice.</AppText>
        </SectionCard>
      ) : (
        <StateNotice title="No conversation yet" message="Tap an example or send a mock question to preview the chat state." variant="empty" />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 120,
    backgroundColor: colors.card,
    color: colors.textPrimary,
    borderRadius: 18,
    padding: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12
  }
});
