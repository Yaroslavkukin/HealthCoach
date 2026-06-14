import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, TextInput } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { demoAssistantQuestions } from '@/data/mock/healthProfile';
import { useI18n } from '@/i18n';
import { translateAssistantQuestion } from '@/i18n/mockContent';
import { callHealthCoachAI } from '@/lib/aiClient';
import { colors } from '@/theme/colors';

export default function AIScreen() {
  const { t } = useI18n();
  const { context } = useLocalSearchParams<{ context?: string }>();
  const isNutritionContext = context === 'nutrition';
  const [message, setMessage] = useState(isNutritionContext ? t('ai.nutritionPrompt') : '');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitMessage() {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    const result = await callHealthCoachAI({
      userId: 'local-user',
      task: isNutritionContext ? 'nutrition_plan' : 'ai_chat',
      input: {
        message: trimmedMessage,
        context: isNutritionContext ? 'nutrition' : 'general'
      }
    });

    if ('answer' in result) {
      setAnswer(result.answer);
      if (result.ok) {
        setError('');
      } else {
        const detail = result.error ?? result.message;
        console.error('AI chat request failed in UI', {
          context: isNutritionContext ? 'nutrition' : 'general',
          task: isNutritionContext ? 'nutrition_plan' : 'ai_chat',
          error: detail
        });
        setError(detail);
      }
    } else {
      console.error('AI chat returned an unexpected client response', {
        context: isNutritionContext ? 'nutrition' : 'general',
        task: isNutritionContext ? 'nutrition_plan' : 'ai_chat',
        result
      });
      setAnswer('');
      setError(t('ai.unexpectedResponse'));
    }

    setIsSubmitting(false);
  }

  return (
    <ScreenContainer>
      <ScreenHeader>
        <AppText variant="title">{t('ai.title')}</AppText>
        <AppText variant="body">{t('ai.subtitle')}</AppText>
      </ScreenHeader>

      <StateNotice
        title={isNutritionContext ? t('ai.nutritionContextTitle') : t('ai.assistantTitle')}
        message={isNutritionContext ? t('ai.nutritionContextMessage') : t('ai.assistantMessage')}
        variant="info"
      />

      <SectionCard>
        <AppText variant="subtitle">{t('ai.examples')}</AppText>
        {demoAssistantQuestions.map((question, index) => {
          const displayQuestion = translateAssistantQuestion(question, index, t);

          return (
            <AppText key={question} variant="body" onPress={() => setMessage(displayQuestion)}>{displayQuestion}</AppText>
          );
        })}
      </SectionCard>

      <TextInput
        placeholder={t('ai.placeholder')}
        placeholderTextColor={colors.textSoft}
        value={message}
        onChangeText={setMessage}
        multiline
        style={styles.input}
      />
      <PrimaryButton
        label={isSubmitting ? t('ai.generating') : t('ai.send')}
        onPress={isSubmitting ? undefined : submitMessage}
        style={isSubmitting ? styles.loadingButton : undefined}
      />

      {error ? <StateNotice title={t('ai.errorTitle')} message={error} variant="error" /> : null}
      {isSubmitting ? <StateNotice title={t('ai.generating')} message={t('ai.generatingMessage')} variant="info" /> : null}

      {answer ? (
        <SectionCard>
          <AppText variant="subtitle">{t('ai.responseTitle')}</AppText>
          <AppText variant="body">{answer}</AppText>
          {isNutritionContext ? <AppText variant="caption">{t('ai.nutritionPlanSaved')}</AppText> : null}
          <AppText variant="caption">{t('ai.safety')}</AppText>
        </SectionCard>
      ) : (
        <StateNotice title={t('ai.emptyTitle')} message={t('ai.emptyMessage')} variant="empty" />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 120,
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 18,
    padding: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    marginBottom: 12
  },
  loadingButton: {
    opacity: 0.62
  }
});
