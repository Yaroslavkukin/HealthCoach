import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { getCurrentAuthSession } from '@/services/authService';
import { colors } from '@/theme/colors';

export default function SplashScreen() {
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
    }, 1500);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.root}>
      <Image source={require('../assets/images/health-coach-splash.png')} style={styles.logo} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary
  },
  logo: {
    width: '82%',
    maxWidth: 420,
    aspectRatio: 1
  }
});
