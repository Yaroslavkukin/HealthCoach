import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { StateNotice } from '@/components/StateNotice';
import { accessRoutes } from '@/features/access/accessModel';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';

export default function PreviewScreen() {
  const { t } = useI18n();

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <View>
          <AppText variant="title">{t('app.name')}</AppText>
          <AppText variant="body">{t('preview.subtitle')}</AppText>
        </View>
        <View style={styles.demoBadge}>
          <AppText style={styles.demoBadgeText}>{t('preview.demoMode')}</AppText>
        </View>
      </View>

      <StateNotice
        title={t('preview.noticeTitle')}
        message={t('preview.noticeMessage')}
        variant="info"
      />

      <View style={styles.actions}>
        <PrimaryButton label={t('preview.startJourney')} onPress={() => router.push(accessRoutes.subscription)} />
        <PrimaryButton label={t('preview.demoAccess')} variant="secondary" onPress={() => router.push(accessRoutes.mainApp)} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'flex-start',
    marginBottom: 16
  },
  demoBadge: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  demoBadgeText: {
    color: colors.background,
    fontWeight: '900'
  },
  actions: {
    gap: 12
  }
});
