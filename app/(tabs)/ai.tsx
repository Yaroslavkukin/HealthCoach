import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { demoAssistantQuestions } from '@/data/mock/healthProfile';
import { useI18n } from '@/i18n';
import { translateAssistantQuestion } from '@/i18n/mockContent';
import { colors } from '@/theme/colors';

export default function AIScreen() {
  const { t } = useI18n();
  const [answer, setAnswer] = useState('');

  return (
    <ScreenContainer>
      <AppText variant="title">{t('ai.title')}</AppText>
      <AppText variant="body">{t('ai.subtitle')}</AppText>

      <StateNotice
        title={t('ai.mockTitle')}
        message={t('ai.mockMessage')}
        variant="info"
      />

      <SectionCard>
        <AppText variant="subtitle">{t('ai.examples')}</AppText>
        {demoAssistantQuestions.map((question, index) => {
          const displayQuestion = translateAssistantQuestion(question, index, t);

          return (
            <AppText key={question} variant="body" onPress={() => setAnswer(t('ai.demoAnswerFor', { question: displayQuestion }))}>{displayQuestion}</AppText>
          );
        })}
      </SectionCard>

      <TextInput placeholder={t('ai.placeholder')} placeholderTextColor={colors.textMuted} multiline style={styles.input} />
      <PrimaryButton label={t('ai.sendMock')} onPress={() => setAnswer(t('ai.demoAnswer'))} />

      {answer ? (
        <SectionCard>
          <AppText variant="subtitle">{t('ai.responseTitle')}</AppText>
          <AppText variant="body">{answer}</AppText>
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
