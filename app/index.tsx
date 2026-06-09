import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/preview'), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.root}>
      <Image source={require('../assets/images/icon.png')} style={styles.logo} />
      <AppText variant="title">Health Coach</AppText>
      <AppText variant="caption">Your personal AI health coach</AppText>
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
