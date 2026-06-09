import { Text, TextProps, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export function AppText({ variant = 'body', style, ...props }: TextProps & { variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'metric' }) {
  return <Text {...props} style={[styles.base, styles[variant], style]} />;
}

const styles = StyleSheet.create({
  base: {
    color: colors.textPrimary
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800'
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700'
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted
  },
  metric: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '900'
  }
});
