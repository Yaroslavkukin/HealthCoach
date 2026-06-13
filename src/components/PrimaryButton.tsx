import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  backgroundColor,
  textColor,
  style
}: {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  backgroundColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        variant === 'secondary' && styles.secondary,
        style,
        backgroundColor && { backgroundColor }
      ]}
    >
      <AppText style={[variant === 'secondary' ? styles.secondaryText : styles.text, textColor && { color: textColor }]}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 3
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft
  },
  text: {
    color: colors.textOnPrimary,
    fontWeight: '800',
    fontSize: 16
  },
  secondaryText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 16
  }
});
