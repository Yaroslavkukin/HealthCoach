import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';

type StateNoticeVariant = 'empty' | 'loading' | 'error' | 'info';

const iconByVariant: Record<StateNoticeVariant, keyof typeof Ionicons.glyphMap> = {
  empty: 'document-text-outline',
  loading: 'sync-outline',
  error: 'alert-circle-outline',
  info: 'information-circle-outline'
};

export function StateNotice({ title, message, variant = 'info' }: { title: string; message: string; variant?: StateNoticeVariant }) {
  const color = variant === 'error' ? colors.warning : variant === 'loading' ? colors.info : colors.accent;

  return (
    <View style={[styles.root, { borderColor: color }]}>
      <Ionicons name={iconByVariant[variant]} size={20} color={color} />
      <View style={styles.text}>
        <AppText style={styles.title}>{title}</AppText>
        <AppText variant="caption">{message}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.cardElevated,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 16
  },
  text: {
    flex: 1
  },
  title: {
    color: colors.textPrimary,
    fontWeight: '800'
  }
});
