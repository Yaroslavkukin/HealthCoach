import { router } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StateNotice } from '@/components/StateNotice';
import { accessRoutes } from '@/features/access/accessModel';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';

export default function PreviewScreen() {
  const { t } = useI18n();

  return (
    <ScreenContainer>
      <ScreenHeader style={styles.headerPanel}>
        <Image
          source={require('../assets/images/health-coach-leaf-transparent.png')}
          style={styles.headerLeaf}
          resizeMode="contain"
        />
        <AppText variant="title">{t('app.name')}</AppText>
        <AppText variant="body">{t('preview.subtitle')}</AppText>
      </ScreenHeader>

      <StateNotice
        title={t('preview.noticeTitle')}
        message={t('preview.noticeMessage')}
        variant="info"
        iconColor={colors.accent}
        backgroundColor={colors.primary}
        titleColor={colors.textOnPrimary}
        messageColor={colors.textOnPrimaryMuted}
        style={styles.greenElement}
      />

      <View style={styles.actions}>
        <PrimaryButton
          label={t('preview.startJourney')}
          onPress={() => router.push(accessRoutes.subscription)}
          backgroundColor={colors.primary}
          textColor={colors.textOnPrimary}
          style={styles.primaryAction}
        />
        <PrimaryButton
          label={t('preview.demoAccess')}
          variant="secondary"
          onPress={() => router.push(accessRoutes.mainApp)}
          backgroundColor={colors.primary}
          textColor={colors.textOnPrimary}
          style={styles.greenElement}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerPanel: {
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.primary,
    paddingRight: 120,
    position: 'relative'
  },
  headerLeaf: {
    position: 'absolute',
    top: 20,
    right: 24,
    width: 72,
    height: 72
  },
  greenElement: {
    borderWidth: 1,
    borderColor: colors.accent
  },
  primaryAction: {
    borderWidth: 1,
    borderColor: colors.accent
  },
  actions: {
    gap: 12
  }
});
