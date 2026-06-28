import { useCallback, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { Image, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { onboardingSteps, type OnboardingStepId } from '@/features/onboarding/onboardingSteps';
import {
  fetchOnboardingChecklist,
  type OnboardingChecklistState
} from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

type OnboardingStepStatus = 'not started' | 'completed';

const startChecklistHeaderPlaque = require('../../assets/images/start-checklist-header-plaque.png');
const startChecklistCardsExact = require('../../assets/images/start-checklist-cards-exact.png');
const startChecklistJourneyExact = require('../../assets/images/start-checklist-journey-exact.png');

const cardsAssetSize = {
  width: 852,
  height: 1010
};

const journeyAssetSize = {
  width: 852,
  height: 545
};

const headerHeight = 82;

const emptyChecklist: OnboardingChecklistState = {
  bloodAnalysisCompleted: false,
  bravermanCompleted: false,
  lifestyleCompleted: false,
  nutritionCompleted: false,
  aiProfileGenerated: false
};

const statusLabels: Record<OnboardingStepStatus, string> = {
  'not started': 'Не начато',
  completed: 'Выполнено'
};

const cardHitAreas: {
  id: OnboardingStepId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
}[] = [
  { id: 'blood-analysis', title: 'Анализы крови', x: 47, y: 45, width: 758, height: 306 },
  { id: 'braverman', title: 'Тест Бравермана', x: 47, y: 374, width: 758, height: 296 },
  { id: 'profile', title: 'Заполнить профиль', x: 47, y: 696, width: 758, height: 296 }
];

export default function StartChecklistScreen() {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [checklist, setChecklist] = useState<OnboardingChecklistState>(emptyChecklist);
  const availableMediaHeight = Math.max(0, height - insets.top - insets.bottom - headerHeight);
  const fullWidthMediaHeight =
    (width * cardsAssetSize.height) / cardsAssetSize.width +
    (width * journeyAssetSize.height) / journeyAssetSize.width;
  const contentScale = fullWidthMediaHeight > 0 ? Math.min(1, availableMediaHeight / fullWidthMediaHeight) : 1;
  const cardsImageWidth = width * contentScale;
  const cardsScale = cardsImageWidth / cardsAssetSize.width;
  const cardsImageHeight = cardsAssetSize.height * cardsScale;
  const journeyImageHeight = journeyAssetSize.height * cardsScale;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      fetchOnboardingChecklist()
        .then((result) => {
          if (!isActive) {
            return;
          }

          if (result.ok) {
            setChecklist(result.data ?? emptyChecklist);
          }
        })
        .catch(() => {
          if (isActive) {
            setChecklist(emptyChecklist);
          }
        });

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screenRoot}>
      <StartChecklistHeader />

      <View style={[styles.content, { paddingBottom: insets.bottom }]}>
        <View style={[styles.cardsImageFrame, { width: cardsImageWidth, height: cardsImageHeight }]}>
          <Image
            source={startChecklistCardsExact}
            resizeMode="contain"
            style={styles.cardsImage}
          />

          {cardHitAreas.map((area) => {
            const step = onboardingSteps.find((candidate) => candidate.id === area.id);

            if (!step) {
              return null;
            }

            const status = getStepStatus(area.id, checklist);

            return (
              <Pressable
                key={area.id}
                accessibilityRole="button"
                accessibilityLabel={`${area.title}, ${statusLabels[status]}`}
                onPress={() => router.push(step.route)}
                style={[
                  styles.cardHitArea,
                  {
                    left: area.x * cardsScale,
                    top: area.y * cardsScale,
                    width: area.width * cardsScale,
                    height: area.height * cardsScale
                  }
                ]}
              />
            );
          })}
        </View>

        <Image
          source={startChecklistJourneyExact}
          resizeMode="contain"
          style={{ width: cardsImageWidth, height: journeyImageHeight }}
        />
      </View>
    </SafeAreaView>
  );
}

function StartChecklistHeader() {
  return (
    <View style={styles.headerCard}>
      <Image source={startChecklistHeaderPlaque} resizeMode="cover" style={styles.headerImage} />
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

function getStepStatus(stepId: OnboardingStepId, checklist: OnboardingChecklistState): OnboardingStepStatus {
  if (stepId === 'blood-analysis') {
    return checklist.bloodAnalysisCompleted ? 'completed' : 'not started';
  }

  if (stepId === 'braverman') {
    return checklist.bravermanCompleted ? 'completed' : 'not started';
  }

  return 'not started';
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: colors.background
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
    paddingTop: 0
  },
  headerCard: {
    width: '100%',
    height: headerHeight,
    minHeight: headerHeight,
    maxHeight: headerHeight,
    backgroundColor: colors.background,
    overflow: 'hidden',
    shadowOpacity: 0,
    elevation: 0
  },
  headerImage: {
    width: '100%',
    height: '100%',
    transform: [{ translateY: 5 }]
  },
  headerAction: {
    position: 'absolute',
    left: '4.25%',
    top: 11,
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
  cardsImageFrame: {
    position: 'relative',
    overflow: 'visible'
  },
  cardsImage: {
    width: '100%',
    height: '100%'
  },
  cardHitArea: {
    position: 'absolute',
    backgroundColor: 'transparent'
  }
});
