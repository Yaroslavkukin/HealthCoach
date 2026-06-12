import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';

export default function SplashScreen() {
  const { t } = useI18n();

  useEffect(() => {
    const timer = setTimeout(() => router.replace('/preview'), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.root}>
      <Image source={require('../assets/images/icon.png')} style={styles.logo} />
      <AppText variant="title">{t('app.name')}</AppText>
      <AppText variant="caption">{t('splash.subtitle')}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: 12
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 32
  }
});
