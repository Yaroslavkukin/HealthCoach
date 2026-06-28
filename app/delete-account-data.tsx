import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { useI18n } from '@/i18n';
import type { TranslationKey } from '@/i18n/translations/en';
import { colors } from '@/theme/colors';

type DeletionSection = {
  title: TranslationKey;
  items: readonly TranslationKey[];
};

const sections: readonly DeletionSection[] = [
  {
    title: 'deletion.requestTitle',
    items: ['deletion.requestAccount', 'deletion.requestFiles', 'deletion.requestConsent']
  },
  {
    title: 'deletion.effectsTitle',
    items: ['deletion.effectsAccess', 'deletion.effectsPlans', 'deletion.effectsRecovery']
  },
  {
    title: 'deletion.scopeTitle',
    items: ['deletion.scopeUploaded', 'deletion.scopeProfile', 'deletion.scopeTechnical']
  },
  {
    title: 'deletion.futureTitle',
    items: ['deletion.futureControls', 'deletion.futureSupport', 'deletion.futureConfirmation']
  }
];

export default function DeleteAccountDataScreen() {
  const { t } = useI18n();

  return (
    <ScreenContainer>
      <ScreenHeader>
        <AppText variant="title">{t('deletion.title')}</AppText>
        <AppText variant="body">{t('deletion.subtitle')}</AppText>
      </ScreenHeader>

      <StateNotice title={t('deletion.noticeTitle')} message={t('deletion.noticeMessage')} variant="info" />

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
