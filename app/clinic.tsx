import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { SectionCard } from '@/components/SectionCard';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';

const clinicHeaderPlaque = require('../assets/images/clinic-header-plaque.png');

export default function ClinicScreen() {
  const { t } = useI18n();

  return (
    <SafeAreaView style={styles.screenRoot}>
      <ClinicHeader />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentBody}>
          <SectionCard>
            <AppText variant="subtitle">{t('clinic.services')}</AppText>
            <AppText variant="body">{t('clinic.servicesBody')}</AppText>
          </SectionCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ClinicHeader() {
  return (
    <View style={styles.headerPlaque}>
      <Image source={clinicHeaderPlaque} resizeMode="cover" style={styles.headerImage} />
      <View pointerEvents="none" style={styles.backButtonCover} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Назад"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
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
  scrollContent: {
    paddingTop: 0,
    paddingHorizontal: 0,
    paddingBottom: 120
  },
  headerPlaque: {
    width: '100%',
    height: 82,
    minHeight: 82,
    maxHeight: 82,
    backgroundColor: colors.background,
    overflow: 'hidden'
  },
  headerImage: {
    width: '100%',
    height: '100%'
  },
  backButtonCover: {
    position: 'absolute',
    left: 0,
    top: 12,
    width: 68,
    height: 58,
    backgroundColor: colors.background,
    zIndex: 1
  },
  backButton: {
    position: 'absolute',
    left: 12,
    top: 21,
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  },
  backButtonPressed: {
    opacity: 0.78
  },
  contentBody: {
    paddingHorizontal: 20,
    paddingTop: 16
  }
});
