import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Image, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { SectionCard } from '@/components/SectionCard';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';

const securityHeaderPlaque = require('../assets/images/security-header-plaque.png');
const securityTextFontFamily = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia',
  default: 'serif'
});

type SecurityDocumentRoute =
  | '/privacy-policy'
  | '/terms-of-use'
  | '/health-data-consent'
  | '/delete-account-data'
  | '/medical-disclaimer'
  | '/subscription';

type SecurityDocumentItem = {
  title: string;
  route?: SecurityDocumentRoute;
};

type SecurityDocumentSection = {
  title: string;
  items: readonly SecurityDocumentItem[];
};

const securityDocumentSections: readonly SecurityDocumentSection[] = [
  {
    title: 'Юридические документы',
    items: [
      { title: 'Политика конфиденциальности', route: '/privacy-policy' },
      { title: 'Пользовательское соглашение', route: '/terms-of-use' },
      { title: 'Условия подписки' }
    ]
  },
  {
    title: 'Здоровье и AI',
    items: [
      { title: 'Медицинское предупреждение', route: '/medical-disclaimer' },
      { title: 'Об AI-рекомендациях' },
      { title: 'Возрастные ограничения' }
    ]
  },
  {
    title: 'Данные пользователя',
    items: [
      { title: 'Согласие на обработку персональных данных' },
      { title: 'Согласие на обработку данных о здоровье', route: '/health-data-consent' },
      { title: 'Удаление аккаунта и данных', route: '/delete-account-data' },
      { title: 'Разрешения приложения' },
      { title: 'Безопасность данных' }
    ]
  },
  {
    title: 'Оплата и поддержка',
    items: [
      { title: 'Управление подпиской', route: '/subscription' },
      { title: 'Поддержка' }
    ]
  },
  {
    title: 'О приложении',
    items: [
      { title: 'Лицензии' },
      { title: 'Версия приложения' }
    ]
  }
];

function openSecurityDocument(item: SecurityDocumentItem) {
  if (item.route) {
    router.push(item.route);
    return;
  }

  Alert.alert(item.title, 'Раздел будет добавлен позже.');
}

export default function SecurityScreen() {
  const { t } = useI18n();

  return (
    <SafeAreaView style={styles.screenRoot}>
      <SecurityHeader />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HealthNoticeStrip title={t('security.noticeTitle')} message={t('security.noticeMessage')} />

        <View style={styles.cardContent}>
          {securityDocumentSections.map((section) => (
            <SectionCard key={section.title} style={styles.documentSectionCard}>
              <AppText variant="subtitle" style={styles.documentSectionTitle}>
                {section.title}
              </AppText>
              <View style={styles.documentList}>
                {section.items.map((item) => (
                  <Pressable
                    key={item.title}
                    accessibilityRole="button"
                    accessibilityLabel={item.title}
                    onPress={() => openSecurityDocument(item)}
                    style={({ pressed }) => [styles.documentRow, pressed && styles.documentRowPressed]}
                  >
                    <View style={styles.bullet} />
                    <AppText variant="body" style={styles.documentText}>
                      {item.title}
                    </AppText>
                    <Ionicons name="chevron-forward" size={18} color={colors.primary} />
                  </Pressable>
                ))}
              </View>
            </SectionCard>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function HealthNoticeStrip({ title, message }: { title: string; message: string }) {
  return (
    <View style={styles.healthNoticeStrip}>
      <Ionicons name="information-circle-outline" size={22} color={colors.accent} style={styles.healthNoticeIcon} />
      <View style={styles.healthNoticeText}>
        <AppText
          variant="subtitle"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.9}
          style={styles.healthNoticeTitle}
        >
          {title}
        </AppText>
        <AppText variant="body" style={styles.healthNoticeMessage}>
          {message}
        </AppText>
      </View>
    </View>
  );
}

function SecurityHeader() {
  return (
    <View style={styles.headerCard}>
      <Image source={securityHeaderPlaque} resizeMode="cover" style={styles.headerImage} />
      <AppText numberOfLines={1} style={styles.headerTitle}>
        Документы и безопасность
      </AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Назад"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.headerAction, pressed && styles.pressedAction]}
      >
        <Ionicons name="chevron-back" size={22} color={colors.textOnPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    paddingTop: 14,
    paddingBottom: 120
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingTop: 16
  },
  headerCard: {
    width: '100%',
    height: 82,
    minHeight: 82,
    maxHeight: 82,
    backgroundColor: colors.background,
    overflow: 'hidden',
    shadowOpacity: 0,
    elevation: 0
  },
  headerImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background
  },
  headerTitle: {
    position: 'absolute',
    left: 64,
    top: 31,
    right: 0,
    color: colors.primary,
    fontFamily: securityTextFontFamily,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900',
    letterSpacing: 0,
    includeFontPadding: false,
    zIndex: 1
  },
  headerAction: {
    position: 'absolute',
    left: 8,
    top: 21,
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent,
    zIndex: 1
  },
  pressedAction: {
    opacity: 0.78
  },
  healthNoticeStrip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    width: '100%',
    marginBottom: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: colors.accent,
    borderBottomColor: colors.accent,
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0
  },
  healthNoticeIcon: {
    marginTop: 1
  },
  healthNoticeText: {
    flex: 1
  },
  healthNoticeTitle: {
    color: colors.textOnPrimary,
    fontFamily: securityTextFontFamily,
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: 0
  },
  healthNoticeMessage: {
    color: colors.textOnPrimaryMuted,
    fontFamily: securityTextFontFamily,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '400',
    letterSpacing: 0,
    marginTop: 4
  },
  documentSectionCard: {
    backgroundColor: colors.primary,
    borderColor: colors.accent,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14
  },
  documentSectionTitle: {
    color: colors.textOnPrimary,
    fontFamily: securityTextFontFamily,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '400',
    letterSpacing: 0,
    marginBottom: 12
  },
  documentList: {
    gap: 10
  },
  documentRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  documentRowPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }]
  },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginTop: 9
  },
  documentText: {
    flex: 1,
    color: colors.primary,
    fontFamily: securityTextFontFamily,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0
  }
});
