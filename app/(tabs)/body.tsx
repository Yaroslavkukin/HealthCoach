import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { HealthSystemCard } from '@/components/HealthSystemCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionCard } from '@/components/SectionCard';
import { demoBiomarkers, demoSystemScores } from '@/data/mock/healthProfile';
import { useI18n } from '@/i18n';
import { translateBiomarker, translateSimpleLabel } from '@/i18n/mockContent';
import { colors } from '@/theme/colors';

export default function BodyScreen() {
  const { t } = useI18n();

  return (
    <ScreenContainer>
      <AppText variant="title">{t('body.title')}</AppText>
      <AppText variant="body">{t('body.subtitle')}</AppText>

      <SectionCard style={styles.bodyVisual}>
        <View style={styles.figure}>
          <View style={styles.head} />
          <View style={styles.torso} />
          <View style={styles.legs} />
        </View>
        <AppText variant="subtitle">{t('body.systemMap')}</AppText>
        <AppText variant="caption">{t('body.systemMapCaption')}</AppText>
      </SectionCard>

      {demoSystemScores.map((score) => <HealthSystemCard key={score.label} score={score} />)}

      <SectionCard>
        <AppText variant="subtitle">{t('body.keyBiomarkers')}</AppText>
        {demoBiomarkers.map((item) => {
          const marker = translateBiomarker(item, t);

          return (
          <AppText key={marker.id} variant="body" onPress={() => router.push(`/biomarker/${marker.id}`)}>
            {marker.name}: {marker.value} {marker.unit} - {translateSimpleLabel(marker.status, t)}
          </AppText>
          );
        })}
      </SectionCard>

      <PrimaryButton label={t('body.askAi')} onPress={() => router.push('/(tabs)/ai')} />
      <PrimaryButton label={t('body.openCortisol')} variant="secondary" onPress={() => router.push('/biomarker/cortisol')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  bodyVisual: {
    alignItems: 'center'
  },
  figure: {
    alignItems: 'center',
    marginBottom: 12
  },
  head: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.accentSoft
  },
  torso: {
    width: 86,
    height: 120,
    borderRadius: 42,
    backgroundColor: colors.cardElevated,
    borderWidth: 2,
    borderColor: colors.accent,
    marginTop: 8
  },
  legs: {
    width: 54,
    height: 70,
    borderRadius: 24,
    backgroundColor: colors.accentSoft,
    marginTop: 8
  }
});
