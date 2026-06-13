import { createContext, useContext, type ReactNode } from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

type TextTone = 'background' | 'surface' | 'primary';

const TextToneContext = createContext<TextTone>('background');

export function TextToneProvider({ children, tone }: { children: ReactNode; tone: TextTone }) {
  return <TextToneContext.Provider value={tone}>{children}</TextToneContext.Provider>;
}

export function AppText({ variant = 'body', style, ...props }: TextProps & { variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'metric' }) {
  const tone = useContext(TextToneContext);
  const toneStyles = tone === 'primary' ? primaryStyles : tone === 'surface' ? surfaceStyles : backgroundStyles;

  return <Text {...props} style={[toneStyles.base, styles[variant], toneStyles[variant], style]} />;
}

const styles = StyleSheet.create({
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
    lineHeight: 24
  },
  caption: {
    fontSize: 13,
    lineHeight: 18
  },
  metric: {
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '900'
  }
});

const backgroundStyles = StyleSheet.create({
  base: {
    color: colors.text
  },
  title: {},
  subtitle: {},
  body: {
    color: colors.textMuted
  },
  caption: {
    color: colors.textSoft
  },
  metric: {}
});

const surfaceStyles = StyleSheet.create({
  base: {
    color: colors.text
  },
  title: {},
  subtitle: {},
  body: {
    color: colors.textMuted
  },
  caption: {
    color: colors.textSoft
  },
  metric: {}
});

const primaryStyles = StyleSheet.create({
  base: {
    color: colors.textOnPrimary
  },
  title: {},
  subtitle: {},
  body: {
    color: colors.textOnPrimaryMuted
  },
  caption: {
    color: colors.textOnPrimaryMuted
  },
  metric: {}
});
