import { useState } from 'react';
import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { demoBiomarkers } from '@/data/mock/healthProfile';
import { useI18n } from '@/i18n';
import { translateBiomarker, translatePersistenceMessage } from '@/i18n/mockContent';
import { saveBloodUploadMetadata, saveOnboardingChecklist } from '@/services/phase3Persistence';

type MockUploadState = 'empty' | 'loading' | 'uploaded' | 'error';

export default function BloodUploadScreen() {
  const { t } = useI18n();
  const [uploadState, setUploadState] = useState<MockUploadState>('empty');
  const [persistenceMessage, setPersistenceMessage] = useState<string | null>(null);

  async function saveDemoUpload() {
    setUploadState('loading');

    const uploadResult = await saveBloodUploadMetadata({
      fileName: 'demo-blood-analysis.pdf',
      packageCode: 'male_foundation',
      fileUrl: 'mock://blood-test/demo-blood-analysis.pdf',
      status: 'uploaded'
    });
    const checklistResult = await saveOnboardingChecklist({ bloodAnalysisCompleted: true });

    setPersistenceMessage(translatePersistenceMessage(uploadResult.ok ? checklistResult.message : uploadResult.message, t));
    setUploadState(uploadResult.ok && checklistResult.ok ? 'uploaded' : 'error');
  }

  const notice =
    uploadState === 'loading'
      ? { title: t('onboarding.blood.loadingTitle'), message: t('onboarding.blood.loadingMessage'), variant: 'loading' as const }
      : uploadState === 'uploaded'
        ? { title: t('onboarding.blood.uploadedTitle'), message: t('onboarding.blood.uploadedMessage'), variant: 'info' as const }
        : uploadState === 'error'
          ? { title: t('onboarding.blood.errorTitle'), message: t('onboarding.blood.errorMessage'), variant: 'error' as const }
          : { title: t('onboarding.blood.emptyTitle'), message: t('onboarding.blood.emptyMessage'), variant: 'empty' as const };

  return (
    <ScreenContainer>
      <AppText variant="title">{t('onboarding.blood.title')}</AppText>
      <AppText variant="body">{t('onboarding.blood.subtitle')}</AppText>

      <StateNotice {...notice} />
      <StateNotice title={t('onboarding.blood.metadata')} message={persistenceMessage ?? t('onboarding.blood.initialSave')} variant={uploadState === 'error' ? 'error' : 'info'} />

      <SectionCard>
        <AppText variant="subtitle">{t('onboarding.blood.prepTitle')}</AppText>
        <AppText variant="body">{t('onboarding.blood.prep1')}</AppText>
        <AppText variant="body">{t('onboarding.blood.prep2')}</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">{t('onboarding.blood.packages')}</AppText>
        <AppText variant="body">{t('onboarding.blood.malePackages')}</AppText>
        <AppText variant="body">{t('onboarding.blood.femalePackages')}</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">{t('onboarding.blood.manual')}</AppText>
        {demoBiomarkers.map((item) => {
          const marker = translateBiomarker(item, t);

          return (
          <AppText key={marker.id} variant="body">{marker.name}: {marker.value} {marker.unit}</AppText>
          );
        })}
      </SectionCard>

      <PrimaryButton label={t('onboarding.blood.mockUpload')} onPress={() => setUploadState('loading')} />
      <PrimaryButton label={t('onboarding.blood.markUploaded')} variant="secondary" onPress={saveDemoUpload} />
      <PrimaryButton label={t('onboarding.blood.showError')} variant="secondary" onPress={() => setUploadState('error')} />
      <PrimaryButton label={t('onboarding.blood.continue')} onPress={() => router.push('/onboarding/braverman')} />
    </ScreenContainer>
  );
}
