import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { TextToneProvider } from '@/components/AppText';
import { colors } from '@/theme/colors';

type SectionCardTone = 'background' | 'surface' | 'primary';

export function SectionCard({
  children,
  style,
  tone = 'surface'
}: {
  children: ReactNode;
  style?: ViewStyle;
  tone?: SectionCardTone;
}) {
  return (
    <TextToneProvider tone={tone}>
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
