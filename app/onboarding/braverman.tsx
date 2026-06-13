import { useState } from 'react';
import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { demoUser } from '@/data/mock/healthProfile';
import { useI18n } from '@/i18n';
import { translateArchetype, translatePersistenceMessage } from '@/i18n/mockContent';
import { saveBravermanAssessment, saveOnboardingChecklist } from '@/services/phase3Persistence';

export default function BravermanScreen() {
  const { t } = useI18n();
  const [showResult, setShowResult] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  async function completeAssessment() {
    setShowResult(true);
    const assessmentResult = await saveBravermanAssessment({
      dominantProfile: 'balanced',
      motivationArchetype: demoUser.archetype,
      rawScores: {
        dopamine: 7,
        acetylcholine: 6,
        gaba: 5,
        serotonin: 6
      },
      aiSummary: 'Demo Braverman assessment result.'
    });
    const checklistResult = assessmentResult.ok
      ? await saveOnboardingChecklist({ bravermanCompleted: true })
      : assessmentResult;

    setSaveMessage(translatePersistenceMessage(checklistResult.message, t));
  }

  return (
    <ScreenContainer>
      <AppText variant="title">{t('onboarding.braverman.title')}</AppText>
      <AppText variant="body">{t('onboarding.braverman.subtitle')}</AppText>

      <SectionCard>
        <AppText variant="subtitle">{t('onboarding.braverman.questions')}</AppText>
        <AppText variant="body">- {t('onboarding.braverman.q1')}</AppText>
        <AppText variant="body">- {t('onboarding.braverman.q2')}</AppText>
        <AppText variant="body">- {t('onboarding.braverman.q3')}</AppText>
      </SectionCard>

      {showResult ? (
        <SectionCard>
          <AppText variant="subtitle">{t('onboarding.braverman.resultTitle', { archetype: translateArchetype(demoUser.archetype, t) })}</AppText>
          <AppText variant="body">{t('onboarding.braverman.resultBody')}</AppText>
          <AppText variant="caption">{t('onboarding.braverman.resultCaption')}</AppText>
        </SectionCard>
      ) : (
        <StateNotice title={t('onboarding.braverman.emptyTitle')} message={t('onboarding.braverman.emptyMessage')} variant="empty" />
      )}

      <StateNotice title={t('onboarding.braverman.persistence')} message={saveMessage ?? t('onboarding.braverman.initialSave')} variant="info" />
      <PrimaryButton label={t('onboarding.braverman.complete')} onPress={completeAssessment} />
      <PrimaryButton label={t('onboarding.braverman.continue')} variant="secondary" onPress={() => router.push('/onboarding/lifestyle')} />
    </ScreenContainer>
  );
}
