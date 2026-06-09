import { Pressable, StyleSheet } from 'react-native';
import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';

export function PrimaryButton({ label, onPress, variant = 'primary' }: { label: string; onPress?: () => void; variant?: 'primary' | 'secondary' }) {
  return (
    <Pressable onPress={onPress} style={[styles.button, variant === 'secondary' && styles.secondary]}>
      <AppText style={variant === 'secondary' ? styles.secondaryText : styles.text}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent,
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12
  },
  secondary: {
    backgroundColor: colors.cardElevated,
    borderWidth: 1,
    borderColor: colors.border
  },
  text: {
    color: colors.background,
    fontWeight: '800',
    fontSize: 16
  },
  secondaryText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 16
  }
});
