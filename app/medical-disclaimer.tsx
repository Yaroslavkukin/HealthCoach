import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { useI18n } from '@/i18n';
import type { TranslationKey } from '@/i18n/translations/en';
import { colors } from '@/theme/colors';

type DisclaimerSection = {
  title: TranslationKey;
  items: readonly TranslationKey[];
};

const sections: readonly DisclaimerSection[] = [
  {
    title: 'medicalDisclaimer.scopeTitle',
    items: ['medicalDisclaimer.scopeNoDiagnosis', 'medicalDisclaimer.scopeWellness', 'medicalDisclaimer.scopeClinician']
  },
  {
    title: 'medicalDisclaimer.aiTitle',
    items: ['medicalDisclaimer.aiIncomplete', 'medicalDisclaimer.aiContext', 'medicalDisclaimer.aiReview']
  },
  {
    title: 'medicalDisclaimer.urgentTitle',
    items: ['medicalDisclaimer.urgentEmergency', 'medicalDisclaimer.urgentSymptoms']
  },
  {
    title: 'medicalDisclaimer.supplementsTitle',
    items: ['medicalDisclaimer.supplementsNoPrescription', 'medicalDisclaimer.supplementsRisks']
  }
];

export default function MedicalDisclaimerScreen() {
  const { t } = useI18n();

  return (
    <ScreenContainer>
      <ScreenHeader>
        <AppText variant="title">{t('medicalDisclaimer.title')}</AppText>
        <AppText variant="body">{t('medicalDisclaimer.subtitle')}</AppText>
      </ScreenHeader>

      <StateNotice title={t('medicalDisclaimer.noticeTitle')} message={t('medicalDisclaimer.noticeMessage')} variant="info" />

      {sections.map((section) => (
        <SectionCard key={section.title}>
          <AppText variant="subtitle">{t(section.title)}</AppText>
          <View style={styles.list}>
            {section.items.map((item) => (
              <View key={item} style={styles.listItem}>
                <View style={styles.bullet} />
                <AppText variant="body" style={styles.listText}>{t(item)}</AppText>
              </View>
            ))}
          </View>
        </SectionCard>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
    marginTop: 12
  },
  listItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start'
  },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginTop: 9
  },
  listText: {
    flex: 1
  }
});
