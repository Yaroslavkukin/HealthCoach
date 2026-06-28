import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { useI18n } from '@/i18n';
import type { TranslationKey } from '@/i18n/translations/en';
import { colors } from '@/theme/colors';

type ConsentSection = {
  title: TranslationKey;
  items: readonly TranslationKey[];
};

const sections: readonly ConsentSection[] = [
  {
    title: 'healthConsent.dataTitle',
    items: ['healthConsent.dataProfile', 'healthConsent.dataAnalyses', 'healthConsent.dataBehavior']
  },
  {
    title: 'healthConsent.purposeTitle',
    items: ['healthConsent.purposeWellness', 'healthConsent.purposePlans', 'healthConsent.purposeSafety']
  },
  {
    title: 'healthConsent.choiceTitle',
    items: ['healthConsent.choiceOptional', 'healthConsent.choiceWithdraw', 'healthConsent.choiceDeletion']
  },
  {
    title: 'healthConsent.limitsTitle',
    items: ['healthConsent.limitsNoDiagnosis', 'healthConsent.limitsAi', 'healthConsent.limitsEmergency']
  }
];

export default function HealthDataConsentScreen() {
  const { t } = useI18n();

  return (
    <ScreenContainer>
      <ScreenHeader>
        <AppText variant="title">{t('healthConsent.title')}</AppText>
        <AppText variant="body">{t('healthConsent.subtitle')}</AppText>
      </ScreenHeader>

      <StateNotice title={t('healthConsent.noticeTitle')} message={t('healthConsent.noticeMessage')} variant="info" />

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
