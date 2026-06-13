import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { TextToneProvider } from '@/components/AppText';
import { colors } from '@/theme/colors';

export function SectionCard({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return (
    <TextToneProvider tone="surface">
      <View style={[styles.card, style]}>{children}</View>
    </TextToneProvider>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    marginBottom: 16,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3
  }
});
