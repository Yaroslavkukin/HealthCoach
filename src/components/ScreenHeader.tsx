import { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { TextToneProvider } from '@/components/AppText';
import { colors } from '@/theme/colors';

export function ScreenHeader({
  children,
  style,
  integrated = false
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  integrated?: boolean;
}) {
  return (
    <TextToneProvider tone="primary">
      <View style={[styles.root, integrated && styles.integrated, style]}>
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
  integrated: {
    borderRadius: 0,
    borderWidth: 0,
    marginHorizontal: -20,
    marginBottom: 16,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 20,
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0
  },
  accentMark: {
    width: 42,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginBottom: 14
  }
});
