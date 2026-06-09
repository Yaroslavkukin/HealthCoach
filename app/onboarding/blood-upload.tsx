import { useState } from 'react';
import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { demoBiomarkers } from '@/data/mock/healthProfile';
import { saveBloodUploadMetadata, saveOnboardingChecklist } from '@/services/phase3Persistence';

type MockUploadState = 'empty' | 'loading' | 'uploaded' | 'error';

export default function BloodUploadScreen() {
  const [uploadState, setUploadState] = useState<MockUploadState>('empty');
  const [persistenceMessage, setPersistenceMessage] = useState('Blood upload metadata has not been saved yet.');

  async function saveDemoUpload() {
    setUploadState('loading');

    const uploadResult = await saveBloodUploadMetadata({
      fileName: 'demo-blood-analysis.pdf',
      packageCode: 'male_foundation',
      fileUrl: 'mock://blood-test/demo-blood-analysis.pdf',
      status: 'uploaded'
    });
    const checklistResult = await saveOnboardingChecklist({ bloodAnalysisCompleted: true });

    setPersistenceMessage(uploadResult.ok ? checklistResult.message : uploadResult.message);
    setUploadState(uploadResult.ok && checklistResult.ok ? 'uploaded' : 'error');
  }

  const notice =
    uploadState === 'loading'
      ? { title: 'Mock upload in progress', message: 'The prototype is showing a loading state only.', variant: 'loading' as const }
      : uploadState === 'uploaded'
        ? { title: 'Demo file attached', message: 'Mock biomarkers are ready for the next step.', variant: 'info' as const }
        : uploadState === 'error'
          ? { title: 'Unsupported file placeholder', message: 'In production this will explain file type and upload problems.', variant: 'error' as const }
          : { title: 'No file selected', message: 'Upload PDF, image, or use manual entry in this mock flow.', variant: 'empty' as const };

  return (
    <ScreenContainer>
      <AppText variant="title">Blood Analysis</AppText>
      <AppText variant="body">Upload PDF, image, or enter biomarkers manually.</AppText>

      <StateNotice {...notice} />
      <StateNotice title="Upload metadata" message={persistenceMessage} variant={uploadState === 'error' ? 'error' : 'info'} />

      <SectionCard>
        <AppText variant="subtitle">Preparation Guide</AppText>
        <AppText variant="body">Avoid intense training, emotional overload, overeating, and poor sleep before testing.</AppText>
        <AppText variant="body">Repeat tests at the same time of day when tracking progress.</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">Supported Packages</AppText>
        <AppText variant="body">Male: Foundation, Advanced, Complete</AppText>
        <AppText variant="body">Female: Foundation, Complete</AppText>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">Manual Biomarker Preview</AppText>
        {demoBiomarkers.map((marker) => (
          <AppText key={marker.id} variant="body">{marker.name}: {marker.value} {marker.unit}</AppText>
        ))}
      </SectionCard>

      <PrimaryButton label="Mock Upload File" onPress={() => setUploadState('loading')} />
      <PrimaryButton label="Mark Demo File Uploaded" variant="secondary" onPress={saveDemoUpload} />
      <PrimaryButton label="Show Upload Error State" variant="secondary" onPress={() => setUploadState('error')} />
      <PrimaryButton label="Continue to Braverman" onPress={() => router.push('/onboarding/braverman')} />
    </ScreenContainer>
  );
}
