import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { AppText, TextToneProvider } from '@/components/AppText';
import { colors } from '@/theme/colors';

type StateNoticeVariant = 'empty' | 'loading' | 'error' | 'info';

const iconByVariant: Record<StateNoticeVariant, keyof typeof Ionicons.glyphMap> = {
  empty: 'document-text-outline',
  loading: 'sync-outline',
  error: 'alert-circle-outline',
  info: 'information-circle-outline'
};

export function StateNotice({
  title,
  message,
  variant = 'info',
  iconColor,
  backgroundColor,
  titleColor,
  messageColor,
  style
}: {
  title: string;
  message: string;
  variant?: StateNoticeVariant;
  iconColor?: string;
  backgroundColor?: string;
  titleColor?: string;
  messageColor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const color = variant === 'error' ? colors.danger : variant === 'loading' ? colors.info : colors.accent;
  const displayIconColor = iconColor ?? color;

  return (
    <TextToneProvider tone="surface">
      <View
        style={[
          styles.root,
          { borderColor: color },
          style,
          backgroundColor && { backgroundColor }
        ]}
      >
        <Ionicons name={iconByVariant[variant]} size={20} color={displayIconColor} />
        <View style={styles.text}>
          <AppText style={[styles.title, titleColor && { color: titleColor }]}>{title}</AppText>
          <AppText variant="caption" style={messageColor && { color: messageColor }}>
            {message}
          </AppText>
        </View>
      </View>
    </TextToneProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2
  },
  text: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontWeight: '800'
  }
});
