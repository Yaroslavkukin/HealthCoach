import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { useI18n } from '@/i18n';
import type { TranslationKey } from '@/i18n/translations/en';
import { colors } from '@/theme/colors';

type LegalSection = {
  title: TranslationKey;
  body?: TranslationKey;
  items?: readonly TranslationKey[];
};

const sections: readonly LegalSection[] = [
  { title: 'privacyPolicy.scopeTitle', body: 'privacyPolicy.scopeBody' },
  {
    title: 'privacyPolicy.dataTitle',
    items: [
      'privacyPolicy.dataProfile',
      'privacyPolicy.dataHealthInputs',
      'privacyPolicy.dataPlans',
      'privacyPolicy.dataTechnical'
    ]
  },
  {
    title: 'privacyPolicy.useTitle',
    items: [
      'privacyPolicy.usePersonalization',
      'privacyPolicy.useOperation',
      'privacyPolicy.useSafety',
      'privacyPolicy.useImprovement'
    ]
  },
  { title: 'privacyPolicy.noSaleTitle', body: 'privacyPolicy.noSaleBody' },
  {
    title: 'privacyPolicy.controlsTitle',
    items: [
      'privacyPolicy.controlsRequest',
      'privacyPolicy.controlsCorrect',
      'privacyPolicy.controlsDelete',
      'privacyPolicy.controlsWithdraw'
    ]
  },
  {
    title: 'privacyPolicy.securityTitle',
    items: [
      'privacyPolicy.securityServerSide',
      'privacyPolicy.securityNoPublic'
    ]
  }
];

export default function PrivacyPolicyScreen() {
  const { t } = useI18n();

  return (
    <ScreenContainer>
      <ScreenHeader>
        <AppText variant="title">{t('privacyPolicy.title')}</AppText>
        <AppText variant="body">{t('privacyPolicy.subtitle')}</AppText>
      </ScreenHeader>

      <StateNotice title={t('privacyPolicy.noticeTitle')} message={t('privacyPolicy.noticeMessage')} variant="info" />

      {sections.map((section) => (
        <SectionCard key={section.title}>
          <AppText variant="subtitle">{t(section.title)}</AppText>
          {section.body ? <AppText variant="body" style={styles.body}>{t(section.body)}</AppText> : null}
          {section.items ? (
            <View style={styles.list}>
              {section.items.map((item) => (
                <View key={item} style={styles.listItem}>
                  <View style={styles.bullet} />
                  <AppText variant="body" style={styles.listText}>{t(item)}</AppText>
                </View>
              ))}
            </View>
          ) : null}
        </SectionCard>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    marginTop: 8
  },
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
