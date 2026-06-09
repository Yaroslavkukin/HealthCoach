import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';

export default function AIProcessingScreen() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/onboarding/ai-summary'), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.root}>
      <ActivityIndicator color={colors.accent} size="large" />
      <AppText variant="subtitle">Building your Health Profile...</AppText>
      <AppText variant="caption">Reading blood analysis, evaluating biomarkers, reviewing lifestyle, and generating recommendations.</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 18 }
});
