import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SectionCard } from '@/components/SectionCard';
import { StateNotice } from '@/components/StateNotice';
import { accessRoutes } from '@/features/access/accessModel';
import { languageOptions, useI18n } from '@/i18n';
import { colors } from '@/theme/colors';

export default function SettingsScreen() {
  const { language, isReady, setLanguage, t } = useI18n();
  const currentLanguageLabel = t(languageOptions.find((item) => item.value === language)?.labelKey ?? 'settings.english');

  return (
    <ScreenContainer>
      <ScreenHeader>
        <AppText variant="title">{t('settings.title')}</AppText>
        <AppText variant="body">{t('settings.subtitle')}</AppText>
      </ScreenHeader>

      <SectionCard>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Войти в аккаунт"
          onPress={() => router.push(accessRoutes.createAccount)}
          style={({ pressed }) => [styles.accountActionRow, pressed && styles.accountActionRowPressed]}
        >
          <View style={styles.accountActionIcon}>
            <Ionicons name="person-circle-outline" size={22} color={colors.primary} />
          </View>
          <AppText style={styles.accountActionText}>Войти в аккаунт</AppText>
          <Ionicons name="chevron-forward" size={18} color={colors.primary} />
        </Pressable>
      </SectionCard>

      <SectionCard>
        <AppText variant="subtitle">{t('settings.languageTitle')}</AppText>
        <AppText variant="body">{t('settings.languageBody')}</AppText>
        <View style={styles.languageRow}>
          {languageOptions.map((option) => {
            const selected = option.value === language;

            return (
              <Pressable key={option.value} onPress={() => void setLanguage(option.value)} style={[styles.languageButton, selected && styles.languageButtonActive]}>
                <AppText style={[styles.languageText, selected && styles.languageTextActive]}>{t(option.labelKey)}</AppText>
              </Pressable>
            );
          })}
        </View>
        <AppText variant="caption">
          {isReady ? t('settings.currentLanguage', { language: currentLanguageLabel }) : t('common.loadingLanguage')}
        </AppText>
      </SectionCard>

      <StateNotice title={t('settings.savedLocally')} message={t('settings.savedLocallyBody')} variant="info" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  accountActionRow: {
    minHeight: 56,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.borderSoft
  },
  accountActionRowPressed: {
    opacity: 0.82
  },
  accountActionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft
  },
  accountActionText: {
    flex: 1,
    color: colors.text,
    fontWeight: '800'
  },
  languageRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    marginBottom: 12
  },
  languageButton: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.borderSoft
  },
  languageButtonActive: {
    backgroundColor: colors.primary
  },
  languageText: {
    color: colors.textMuted,
    fontWeight: '800'
  },
  languageTextActive: {
    color: colors.textOnPrimary
  }
});
