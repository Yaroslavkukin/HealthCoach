import { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { TextToneProvider } from '@/components/AppText';
import { colors } from '@/theme/colors';

export function ScreenHeader({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <TextToneProvider tone="primary">
      <View style={[styles.root, style]}>
        <View style={styles.accentMark} />
        {children}
      </View>
    </TextToneProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.primary,
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    marginBottom: 18,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 5
  },
  accentMark: {
    width: 42,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginBottom: 14
  }
});
