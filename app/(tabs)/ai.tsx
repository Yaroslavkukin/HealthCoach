import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { buildDemoAiCoachResponse, demoAiCoachPrompts } from '@/data/demoAiCoach';
import { useI18n } from '@/i18n';
import { callHealthCoachAI } from '@/lib/aiClient';
import { colors } from '@/theme/colors';

const aiAssistantHeader = require('../../assets/images/ai-assistant-header.png');

export default function AIScreen() {
  const { language, t } = useI18n();
  const { context } = useLocalSearchParams<{ context?: string }>();
  const isNutritionContext = context === 'nutrition';
  const [message, setMessage] = useState(isNutritionContext ? t('ai.nutritionPrompt') : '');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [fallbackNotice, setFallbackNotice] = useState('');
  const [nutritionPlanSaved, setNutritionPlanSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitMessage(messageOverride?: string) {
    const activeMessage = messageOverride ?? message;
    const trimmedMessage = activeMessage.trim();

    if (!trimmedMessage || isSubmitting) {
      return;
    }

    if (messageOverride) {
      setMessage(messageOverride);
    }

    setIsSubmitting(true);
    setError('');
    setFallbackNotice('');
    setNutritionPlanSaved(false);

    const result = await callHealthCoachAI({
      userId: 'local-user',
      task: isNutritionContext ? 'nutrition_plan' : 'ai_chat',
      input: {
        message: trimmedMessage,
        context: isNutritionContext ? 'nutrition' : 'general',
        language
      }
    });

    if ('answer' in result) {
      const responseAnswer =
        result.answer ||
        buildDemoAiCoachResponse({
          message: trimmedMessage,
          language,
          context: isNutritionContext ? 'nutrition' : 'general'
        });

      setAnswer(responseAnswer);
      setNutritionPlanSaved(isNutritionContext && Boolean(result.nutritionPlan));
      if (result.ok) {
        setError('');
        setFallbackNotice('');
      } else {
        const detail = result.error ?? result.message;
        console.error('AI chat request failed in UI', {
          context: isNutritionContext ? 'nutrition' : 'general',
          task: isNutritionContext ? 'nutrition_plan' : 'ai_chat',
          error: detail
        });
        setError('');
        setFallbackNotice(t('ai.demoFallbackMessage'));
      }
    } else {
      console.error('AI chat returned an unexpected client response', {
        context: isNutritionContext ? 'nutrition' : 'general',
        task: isNutritionContext ? 'nutrition_plan' : 'ai_chat',
        result
      });
      setAnswer(buildDemoAiCoachResponse({
        message: trimmedMessage,
        language,
        context: isNutritionContext ? 'nutrition' : 'general'
      }));
      setNutritionPlanSaved(false);
      setError('');
      setFallbackNotice(t('ai.demoFallbackMessage'));
    }

    setIsSubmitting(false);
  }

  return (
    <ScreenContainer contentStyle={styles.scrollContent}>
      <AIPlaque />

      <View style={styles.contentBody}>
        <StateNotice
          title={isNutritionContext ? t('ai.nutritionContextTitle') : t('ai.assistantTitle')}
          message={isNutritionContext ? t('ai.nutritionContextMessage') : t('ai.assistantMessage')}
          variant="info"
        />

        <StateNotice
          title={t('ai.demoProfileTitle')}
          message={t('ai.demoProfileMessage')}
          variant="info"
        />

        <SectionCard>
          <AppText variant="subtitle">{t('ai.todayFocusTitle')}</AppText>
          <AppText variant="body">{t('ai.todayFocusBody')}</AppText>
        </SectionCard>

        <SectionCard>
          <AppText variant="subtitle">{t('ai.examples')}</AppText>
          <View style={styles.promptGrid}>
            {demoAiCoachPrompts.map((prompt) => {
              const displayQuestion = prompt.label[language];

              return (
                <Pressable
                  key={prompt.id}
                  disabled={isSubmitting}
                  onPress={() => void submitMessage(displayQuestion)}
                  style={({ pressed }) => [styles.promptChip, pressed && styles.promptChipPressed]}
                >
                  <AppText style={styles.promptText}>{displayQuestion}</AppText>
                </Pressable>
              );
            })}
          </View>
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
          onPress={isSubmitting ? undefined : () => void submitMessage()}
          style={isSubmitting ? styles.loadingButton : undefined}
        />

        {fallbackNotice ? <StateNotice title={t('ai.demoFallbackTitle')} message={fallbackNotice} variant="info" /> : null}
        {error ? <StateNotice title={t('ai.errorTitle')} message={error} variant="error" /> : null}
        {isSubmitting ? <StateNotice title={t('ai.generating')} message={t('ai.generatingMessage')} variant="info" /> : null}

        {answer ? (
          <SectionCard>
            <AppText variant="subtitle">{t('ai.responseTitle')}</AppText>
            <AppText variant="body">{answer}</AppText>
            {nutritionPlanSaved ? <AppText variant="caption">{t('ai.nutritionPlanSaved')}</AppText> : null}
            <AppText variant="caption">{t('ai.safety')}</AppText>
          </SectionCard>
        ) : (
          <StateNotice title={t('ai.emptyTitle')} message={t('ai.emptyMessage')} variant="empty" />
        )}
      </View>
    </ScreenContainer>
  );
}

function AIPlaque() {
  return (
    <Image
      source={aiAssistantHeader}
      resizeMode="cover"
      style={styles.aiPlaqueImage}
    />
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 0,
    paddingHorizontal: 0
  },
  aiPlaqueImage: {
    width: '100%',
    height: 112,
    minHeight: 108,
    backgroundColor: colors.background,
    overflow: 'hidden'
  },
  contentBody: {
    paddingHorizontal: 20,
    paddingTop: 16
  },
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
  promptGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10
  },
  promptChip: {
    borderRadius: 16,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: 12,
    paddingVertical: 10,
    maxWidth: '100%'
  },
  promptChipPressed: {
    opacity: 0.72
  },
  promptText: {
    color: colors.primary,
    fontWeight: '800'
  },
  loadingButton: {
    opacity: 0.62
  }
});
