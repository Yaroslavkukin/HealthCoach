import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { useI18n } from '@/i18n';
import { getCurrentAuthSession } from '@/services/authService';
import { colors } from '@/theme/colors';

export default function SplashScreen() {
  const { t } = useI18n();

  useEffect(() => {
    let active = true;

    const timer = setTimeout(() => {
      async function routeFromSession() {
        const result = await getCurrentAuthSession();

        if (!active) {
          return;
        }

        router.replace(result.mode === 'supabase' && result.session ? '/(tabs)/today' : '/preview');
      }

      void routeFromSession();
    }, 1800);

    return () => {
      active = false;
      clearTimeout(timer);
    };
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
