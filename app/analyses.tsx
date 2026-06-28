import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, FlatList, Image, Linking, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { colors } from '@/theme/colors';

type AnalysisUploadStatus = 'idle' | 'picking' | 'processing' | 'completed' | 'error';
type AnalysisSourceType = 'photo' | 'image' | 'pdf';
type BiomarkerStatus = 'good' | 'attention' | 'poor' | 'unknown';

type BiomarkerResult = {
  id: string;
  name: string;
  value: string;
  unit: string;
  referenceLabel: string;
  status: BiomarkerStatus;
};

type AttentionItem = {
  label: string;
  statusLabel: string;
  status: BiomarkerStatus;
};

type AiAnalysisInterpretation = {
  attentionItems: AttentionItem[];
  bodyImpact: string[];
  nextActions: string[];
  nextStepLabel: string;
  safetyNote: string;
};

type AnalysisHistoryItem = {
  id: string;
  createdAt: string;
  sourceType: AnalysisSourceType;
  fileName: string;
  fileUri: string;
  mimeType?: string;
  status: AnalysisUploadStatus;
  biomarkers: BiomarkerResult[];
  aiInterpretation?: AiAnalysisInterpretation;
  errorMessage?: string;
  isDemo?: boolean;
};

type SelectedUpload = {
  sourceType: AnalysisSourceType;
  fileName: string;
  fileUri: string;
  mimeType?: string;
};

const analysesHeaderIllustration = require('../assets/images/analyses-header-illustration.png');
const takeAnalysesCtaImage = require('../assets/images/take-analyses-cta.png');
const uploadCardGradient = ['#01281F', '#073B2F', '#0B4A38'] as const;
const contentHorizontalPadding = 20;

// Temporary for demo access: prefill fictional completed analyses.
const SHOW_DEMO_ANALYSES = true;
const demoSafetyNote =
  'Расшифровка носит информационный характер и не заменяет консультацию специалиста. При выраженных симптомах обсудите результаты с врачом.';

const acceptedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'heic', 'heif', 'webp'];
const acceptedMimeTypes = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/heic',
  'image/heif',
  'image/webp'
];

const mockBiomarkers: BiomarkerResult[] = [
  {
    id: 'vitamin-d',
    name: 'Витамин D',
    value: '28',
    unit: 'ng/ml',
    referenceLabel: 'зона внимания',
    status: 'attention'
  },
  {
    id: 'ferritin',
    name: 'Ферритин',
    value: '44',
    unit: 'ng/ml',
    referenceLabel: 'низко-нормальный',
    status: 'attention'
  },
  {
    id: 'cortisol',
    name: 'Кортизол',
    value: '548',
    unit: 'nmol/L',
    referenceLabel: 'зона внимания',
    status: 'attention'
  },
  {
    id: 'hba1c',
    name: 'HbA1c',
    value: '5.2',
    unit: '%',
    referenceLabel: 'в норме',
    status: 'good'
  },
  {
    id: 'tsh',
    name: 'ТТГ',
    value: '2.1',
    unit: 'mIU/L',
    referenceLabel: 'в норме',
    status: 'good'
  }
];

const mockInterpretation: AiAnalysisInterpretation = {
  attentionItems: [
    { label: 'Витамин D', statusLabel: 'зона внимания', status: 'attention' },
    { label: 'Ферритин', statusLabel: 'низко-нормальный', status: 'attention' },
    { label: 'Кортизол', statusLabel: 'зона внимания', status: 'attention' }
  ],
  bodyImpact: [
    'Может снижать уровень энергии и мотивации в течение дня.',
    'Может ухудшать восстановление после нагрузки и стресса.',
    'Может влиять на сон, фокус и стрессоустойчивость.'
  ],
  nextActions: [
    'Проверить сон, восстановление и регулярность питания.',
    'Обсудить показатели, которые требуют внимания, с врачом.',
    'Повторить анализ при необходимости и сравнить динамику.',
    'Сформировать профиль здоровья после заполнения остальных данных.'
  ],
  nextStepLabel: 'Сформировать профиль здоровья',
  safetyNote:
    'Расшифровка носит информационный характер и не заменяет консультацию специалиста. При выраженных симптомах обсудите результаты с врачом.'
};

export default function AnalysesScreen() {
  const [historyItems, setHistoryItems] = useState<AnalysisHistoryItem[]>(() =>
    SHOW_DEMO_ANALYSES ? createDemoAnalysisHistory() : []
  );
  const [uploadStatus, setUploadStatus] = useState<AnalysisUploadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploadCardExpanded, setIsUploadCardExpanded] = useState(false);
  const isBusy = uploadStatus === 'picking' || uploadStatus === 'processing';
  const processingItem = historyItems.find((item) => item.status === 'processing');

  const startUpload = async (upload: SelectedUpload) => {
    const validationError = validateUpload(upload);

    if (validationError) {
      setUploadStatus('error');
      setErrorMessage(validationError);
      return;
    }

    const processingAnalysis = createProcessingAnalysis(upload);
    setErrorMessage(null);
    setUploadStatus('processing');
    setHistoryItems((currentItems) => [processingAnalysis, ...currentItems]);

    try {
      const completedAnalysis = await mockProcessBloodAnalysis(processingAnalysis);
      setHistoryItems((currentItems) =>
        currentItems.map((item) => (item.id === processingAnalysis.id ? completedAnalysis : item))
      );
      setUploadStatus('completed');
    } catch {
      setUploadStatus('error');
      setErrorMessage('Не удалось загрузить файл. Попробуйте ещё раз или загрузите другой файл.');
      setHistoryItems((currentItems) =>
        currentItems.map((item) =>
          item.id === processingAnalysis.id
            ? {
                ...item,
                status: 'error',
                errorMessage: 'Не удалось расшифровать анализ. Попробуйте загрузить другой файл.'
              }
            : item
        )
      );
    }
  };

  const handleTakePhoto = async () => {
    if (isBusy) {
      return;
    }

    setUploadStatus('picking');
    setErrorMessage(null);

    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        setUploadStatus('error');
        setErrorMessage('Разрешите доступ к камере, чтобы сделать фото.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.88
      });

      if (result.canceled) {
        setUploadStatus('idle');
        return;
      }

      const asset = result.assets[0];
      await startUpload({
        sourceType: 'photo',
        fileName: asset.fileName ?? `analysis-photo-${Date.now()}.jpg`,
        fileUri: asset.uri,
        mimeType: asset.mimeType ?? inferMimeType(asset.fileName ?? asset.uri)
      });
    } catch {
      setUploadStatus('error');
      setErrorMessage('Не удалось загрузить файл. Попробуйте ещё раз или загрузите другой файл.');
    }
  };

  const handlePickPhoto = async () => {
    if (isBusy) {
      return;
    }

    setUploadStatus('picking');
    setErrorMessage(null);

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        setUploadStatus('error');
        setErrorMessage('Разрешите доступ к фото, чтобы загрузить изображение анализа.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.92
      });

      if (result.canceled) {
        setUploadStatus('idle');
        return;
      }

      const asset = result.assets[0];
      await startUpload({
        sourceType: 'image',
        fileName: asset.fileName ?? `analysis-image-${Date.now()}.jpg`,
        fileUri: asset.uri,
        mimeType: asset.mimeType ?? inferMimeType(asset.fileName ?? asset.uri)
      });
    } catch {
      setUploadStatus('error');
      setErrorMessage('Не удалось загрузить файл. Попробуйте ещё раз или загрузите другой файл.');
    }
  };

  const handlePickDocument = async () => {
    if (isBusy) {
      return;
    }

    setUploadStatus('picking');
    setErrorMessage(null);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        multiple: false,
        copyToCacheDirectory: true
      });

      if (result.canceled) {
        setUploadStatus('idle');
        return;
      }

      const asset = result.assets[0];
      const mimeType = asset.mimeType ?? inferMimeType(asset.name);

      await startUpload({
        sourceType: isPdfUpload(asset.name, mimeType) ? 'pdf' : 'image',
        fileName: asset.name,
        fileUri: asset.uri,
        mimeType
      });
    } catch {
      setUploadStatus('error');
      setErrorMessage('Не удалось загрузить файл. Попробуйте ещё раз или загрузите другой файл.');
    }
  };

  return (
    <SafeAreaView style={styles.screenRoot}>
      <AnalysesHeader />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <UploadCard
          disabled={isBusy}
          expanded={isUploadCardExpanded}
          onToggleExpanded={() => setIsUploadCardExpanded((currentValue) => !currentValue)}
          onTakePhoto={handleTakePhoto}
          onPickPhoto={handlePickPhoto}
          onPickDocument={handlePickDocument}
        />
        <TakeAnalysesButton />

        {errorMessage ? <ErrorCard message={errorMessage} /> : null}
        {processingItem ? <ProcessingCard fileName={processingItem.fileName} /> : null}

        <HistorySection items={historyItems} />
      </ScrollView>
    </SafeAreaView>
  );
}

function AnalysesHeader() {
  return (
    <View style={styles.headerCard}>
      <View pointerEvents="none" style={styles.headerIllustrationWrapper}>
        <Image source={analysesHeaderIllustration} resizeMode="contain" style={styles.headerIllustration} />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Назад"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <Ionicons name="chevron-back" size={25} color={colors.textOnPrimary} />
      </Pressable>

      <View style={styles.headerText}>
        <AppText numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} style={styles.title}>
          Анализы
        </AppText>
        <AppText numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.86} style={styles.subtitle}>
          Ваши результаты и динамика
        </AppText>
      </View>
    </View>
  );
}

function TakeAnalysesButton() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Сдать анализы. Выберите подходящий пакет для старта."
      onPress={() => router.push('/take-analyses')}
      style={({ pressed }) => [styles.takeAnalysesButton, pressed && styles.pressed]}
    >
      <Image source={takeAnalysesCtaImage} resizeMode="contain" style={styles.takeAnalysesImage} />
    </Pressable>
  );
}

function UploadCard({
  disabled,
  expanded,
  onToggleExpanded,
  onTakePhoto,
  onPickPhoto,
  onPickDocument
}: {
  disabled: boolean;
  expanded: boolean;
  onToggleExpanded: () => void;
  onTakePhoto: () => void;
  onPickPhoto: () => void;
  onPickDocument: () => void;
}) {
  return (
    <LinearGradient
      colors={uploadCardGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.uploadCard, !expanded && styles.uploadCardCollapsed]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={expanded ? 'Свернуть загрузку анализов' : 'Открыть загрузку анализов'}
        onPress={onToggleExpanded}
        style={({ pressed }) => [styles.sectionHeader, !expanded && styles.sectionHeaderCollapsed, pressed && styles.pressed]}
      >
        <View style={styles.sectionIcon}>
          <Ionicons name="cloud-upload-outline" size={29} color={colors.accentSoft} />
        </View>
        <View style={styles.sectionTitleBlock}>
          <AppText numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.86} style={styles.sectionTitle}>
            Загрузка анализов
          </AppText>
          {expanded ? (
            <AppText style={styles.sectionCopy}>
              Загрузите PDF или фото анализов.{'\n'}ИИ извлечёт показатели и подготовит{'\n'}понятную расшифровку.
            </AppText>
          ) : null}
        </View>
        <View style={[styles.uploadCardChevron, !expanded && styles.uploadCardChevronCollapsed]}>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={22} color={colors.accentSoft} />
        </View>
      </Pressable>

      {expanded ? (
        <>
          <View style={styles.uploadActions}>
            <UploadButton
              icon="camera-outline"
              label="Сфотографировать"
              disabled={disabled}
              onPress={onTakePhoto}
            />
            <UploadButton icon="image-outline" label="Загрузить фото" disabled={disabled} onPress={onPickPhoto} />
            <UploadButton
              icon="document-text-outline"
              label="Загрузить файл"
              disabled={disabled}
              onPress={onPickDocument}
            />
          </View>

          <AppText style={styles.uploadNote}>
            PDF, JPG, PNG. Данные используются только{'\n'}для персональной расшифровки.
          </AppText>
        </>
      ) : null}
    </LinearGradient>
  );
}

function UploadButton({
  icon,
  label,
  disabled,
  onPress
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.uploadButton, disabled && styles.disabledButton, pressed && styles.pressed]}
    >
      <View style={styles.uploadButtonContent}>
        <Ionicons name={icon} size={24} color={disabled ? colors.textSoft : colors.primary} />
        <AppText style={[styles.uploadButtonText, disabled && styles.disabledButtonText]}>{label}</AppText>
      </View>
      <Ionicons name="chevron-forward" size={26} color={disabled ? colors.textSoft : colors.primary} />
    </Pressable>
  );
}

function ProcessingCard({ fileName }: { fileName: string }) {
  return (
    <View style={styles.processingCard}>
      <View style={styles.processingIcon}>
        <Ionicons name="sparkles-outline" size={20} color={colors.accent} />
      </View>
      <View style={styles.processingText}>
        <AppText style={styles.processingTitle}>ИИ расшифровывает анализы…</AppText>
        <AppText style={styles.processingCopy}>{fileName}</AppText>
      </View>
    </View>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <View style={styles.errorCard}>
      <Ionicons name="alert-circle-outline" size={20} color={colors.danger} />
      <AppText style={styles.errorText}>{message}</AppText>
    </View>
  );
}

function HistorySection({ items }: { items: AnalysisHistoryItem[] }) {
  const carouselRef = useRef<FlatList<AnalysisHistoryItem>>(null);
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedInterpretations, setExpandedInterpretations] = useState<Record<string, boolean>>({});
  const carouselWidth = Math.max(width - contentHorizontalPadding * 2, 1);
  const safeActiveIndex = items.length > 0 ? Math.min(activeIndex, items.length - 1) : 0;

  const setActiveAnalysisIndex = (nextIndex: number) => {
    const boundedIndex = Math.min(Math.max(nextIndex, 0), items.length - 1);

    if (boundedIndex !== activeIndex) {
      setExpandedInterpretations({});
    }

    setActiveIndex(boundedIndex);
  };

  const scrollToAnalysis = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= items.length) {
      return;
    }

    setActiveAnalysisIndex(nextIndex);
    carouselRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  };

  const toggleInterpretation = (itemId: string) => {
    setExpandedInterpretations((currentState) => ({
      ...currentState,
      [itemId]: !currentState[itemId]
    }));
  };

  return (
    <View style={styles.historySection}>
      <AppText style={styles.historyTitle}>История анализов</AppText>
      {items.length === 0 ? (
        <View style={styles.emptyCard}>
          <AppText style={styles.emptyTitle}>Загруженные анализы появятся здесь после обработки.</AppText>
          <AppText style={styles.emptyCopy}>Загрузите PDF или фото, чтобы ИИ подготовил расшифровку.</AppText>
        </View>
      ) : (
        <View style={styles.historyCarouselBlock}>
          <FlatList
            ref={carouselRef}
            data={items}
            horizontal
            pagingEnabled
            snapToInterval={carouselWidth}
            decelerationRate="fast"
            disableIntervalMomentum
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            extraData={expandedInterpretations}
            getItemLayout={(_, index) => ({
              length: carouselWidth,
              offset: carouselWidth * index,
              index
            })}
            onMomentumScrollEnd={(event) => {
              const nextIndex = Math.round(event.nativeEvent.contentOffset.x / carouselWidth);
              setActiveAnalysisIndex(nextIndex);
            }}
            onScrollToIndexFailed={({ index }) => {
              carouselRef.current?.scrollToOffset({
                offset: carouselWidth * index,
                animated: true
              });
            }}
            renderItem={({ item, index }) => (
              <View style={[styles.historyCarouselItem, { width: carouselWidth }]}>
                <AnalysisHistoryCard
                  item={item}
                  interpretationExpanded={index === safeActiveIndex && Boolean(expandedInterpretations[item.id])}
                  onToggleInterpretation={() => toggleInterpretation(item.id)}
                />
              </View>
            )}
          />

          <HistoryCarouselControls
            activeIndex={safeActiveIndex}
            total={items.length}
            onPrevious={() => scrollToAnalysis(safeActiveIndex - 1)}
            onNext={() => scrollToAnalysis(safeActiveIndex + 1)}
          />
        </View>
      )}
    </View>
  );
}

function HistoryCarouselControls({
  activeIndex,
  total,
  onPrevious,
  onNext
}: {
  activeIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === total - 1;

  return (
    <View style={styles.carouselControls}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Предыдущий анализ"
        accessibilityState={{ disabled: isFirst }}
        disabled={isFirst}
        onPress={onPrevious}
        style={({ pressed }) => [
          styles.carouselControlButton,
          isFirst && styles.carouselControlButtonDisabled,
          pressed && !isFirst && styles.pressed
        ]}
      >
        <Ionicons name="chevron-back" size={20} color={isFirst ? colors.textSoft : colors.primary} />
      </Pressable>

      <View style={styles.carouselIndicator}>
        <Ionicons name="document-text-outline" size={15} color={colors.accent} />
        <AppText style={styles.carouselIndicatorText}>
          {activeIndex + 1} / {total}
        </AppText>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Следующий анализ"
        accessibilityState={{ disabled: isLast }}
        disabled={isLast}
        onPress={onNext}
        style={({ pressed }) => [
          styles.carouselControlButton,
          isLast && styles.carouselControlButtonDisabled,
          pressed && !isLast && styles.pressed
        ]}
      >
        <Ionicons name="chevron-forward" size={20} color={isLast ? colors.textSoft : colors.primary} />
      </Pressable>
    </View>
  );
}

function AnalysisHistoryCard({
  item,
  interpretationExpanded,
  onToggleInterpretation
}: {
  item: AnalysisHistoryItem;
  interpretationExpanded: boolean;
  onToggleInterpretation: () => void;
}) {
  const completed = item.status === 'completed';

  return (
    <View style={styles.historyCard}>
      <View style={styles.historyCardTop}>
        <View style={styles.historyMeta}>
          <AppText style={styles.historyDate}>{formatAnalysisDate(item.createdAt)}</AppText>
        </View>
        <View style={styles.historyChipRow}>
          {item.isDemo ? (
            <View style={styles.demoChip}>
              <AppText style={styles.demoChipText}>Демо</AppText>
            </View>
          ) : null}
          <StatusChip status={item.status} />
        </View>
      </View>

      {!completed ? (
        <View style={styles.summaryPill}>
          <Ionicons name="analytics-outline" size={15} color={colors.primary} />
          <AppText style={styles.summaryPillText}>Ожидается расшифровка</AppText>
        </View>
      ) : null}

      {item.status === 'processing' ? (
        <AppText style={styles.processingInline}>ИИ расшифровывает анализы и готовит понятный план действий.</AppText>
      ) : null}

      {item.status === 'error' ? (
        <AppText style={styles.historyError}>{item.errorMessage ?? 'Не удалось расшифровать анализ.'}</AppText>
      ) : null}

      {completed ? <BiomarkerList biomarkers={item.biomarkers} /> : null}

      {completed && item.aiInterpretation ? (
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={interpretationExpanded ? 'Скрыть AI-расшифровку' : 'Показать AI-расшифровку'}
            onPress={onToggleInterpretation}
            style={({ pressed }) => [styles.interpretationToggle, pressed && styles.pressed]}
          >
            <AppText style={styles.interpretationToggleText}>
              {interpretationExpanded ? 'Скрыть AI-расшифровку' : 'Показать AI-расшифровку'}
            </AppText>
            <Ionicons
              name={interpretationExpanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={colors.primary}
            />
          </Pressable>

          {interpretationExpanded ? <InterpretationBlock interpretation={item.aiInterpretation} /> : null}
        </>
      ) : null}

      <AnalysisFileRow item={item} />
    </View>
  );
}

function AnalysisFileRow({ item }: { item: AnalysisHistoryItem }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Открыть файл ${item.fileName}`}
      onPress={() => handleOpenAnalysisFile(item)}
      style={({ pressed }) => [styles.analysisFileRow, pressed && styles.pressed]}
    >
      <View style={styles.analysisFileIcon}>
        <Ionicons name="document-text-outline" size={19} color={colors.primary} />
      </View>
      <View style={styles.analysisFileTextBlock}>
        <AppText style={styles.analysisFileLabel}>{getSourceLabel(item.sourceType)}</AppText>
        <AppText style={styles.analysisFileName} numberOfLines={1}>
          {item.fileName}
        </AppText>
      </View>
      <Ionicons name="open-outline" size={18} color={colors.primary} />
    </Pressable>
  );
}

async function handleOpenAnalysisFile(item: AnalysisHistoryItem) {
  if (item.isDemo || item.fileUri.startsWith('demo://')) {
    Alert.alert(
      'Демонстрационный файл',
      'Это демонстрационный файл. В реальном анализе здесь откроется загруженный PDF или изображение.'
    );
    return;
  }

  if (!item.fileUri) {
    Alert.alert('Файл недоступен', 'Не удалось открыть файл. Попробуйте загрузить его ещё раз.');
    return;
  }

  try {
    const canOpen = await Linking.canOpenURL(item.fileUri);

    if (!canOpen) {
      Alert.alert('Файл недоступен', 'Не удалось открыть файл. Попробуйте загрузить его ещё раз.');
      return;
    }

    await Linking.openURL(item.fileUri);
  } catch {
    Alert.alert('Файл недоступен', 'Не удалось открыть файл. Попробуйте загрузить его ещё раз.');
  }
}

function StatusChip({ status }: { status: AnalysisUploadStatus }) {
  return (
    <View style={[styles.statusChip, getUploadStatusChipStyle(status)]}>
      <AppText style={[styles.statusChipText, getUploadStatusTextStyle(status)]}>{getUploadStatusLabel(status)}</AppText>
    </View>
  );
}

function BiomarkerList({ biomarkers }: { biomarkers: BiomarkerResult[] }) {
  return (
    <View style={styles.biomarkerBlock}>
      <AppText style={styles.blockTitle}>Извлечённые показатели</AppText>
      <View style={styles.biomarkerList}>
        {biomarkers.map((biomarker) => (
          <View key={biomarker.id} style={styles.biomarkerRow}>
            <View style={styles.biomarkerInfo}>
              <AppText style={styles.biomarkerName}>{biomarker.name}</AppText>
              <AppText style={styles.biomarkerValue}>
                {biomarker.value} {biomarker.unit}
              </AppText>
            </View>
            <View style={[styles.biomarkerStatus, getBiomarkerStatusStyle(biomarker.status)]}>
              <AppText style={[styles.biomarkerStatusText, getBiomarkerStatusTextStyle(biomarker.status)]}>
                {biomarker.referenceLabel}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function InterpretationBlock({ interpretation }: { interpretation: AiAnalysisInterpretation }) {
  return (
    <View style={styles.interpretationBlock}>
      <AppText style={styles.blockTitle}>ИИ-расшифровка</AppText>

      <View style={styles.interpretationSection}>
        <InterpretationHeading title="Зоны внимания:" />
        <View style={styles.attentionList}>
          {interpretation.attentionItems.map((item) => (
            <View key={`${item.label}-${item.statusLabel}`} style={styles.attentionItem}>
              <AppText style={styles.attentionLabel}>{item.label}</AppText>
              <View style={[styles.biomarkerStatus, getBiomarkerStatusStyle(item.status)]}>
                <AppText style={[styles.biomarkerStatusText, getBiomarkerStatusTextStyle(item.status)]}>
                  {item.statusLabel}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      </View>

      <BulletSection title="Как это может влиять:" items={interpretation.bodyImpact} />
      <BulletSection title="Что делать:" items={interpretation.nextActions} />

      <View style={styles.nextStepRow}>
        <View>
          <AppText style={styles.nextStepTitle}>Следующий шаг</AppText>
          <AppText style={styles.nextStepCopy}>{interpretation.nextStepLabel}</AppText>
        </View>
        <View style={styles.soonBadge}>
          <AppText style={styles.soonBadgeText}>Скоро</AppText>
        </View>
      </View>

      <AppText style={styles.safetyNote}>{interpretation.safetyNote}</AppText>
    </View>
  );
}

function BulletSection({ title, items }: { title: string; items: string[] }) {
  return (
    <View style={styles.interpretationSection}>
      <InterpretationHeading title={title} />
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <View style={styles.bulletDot} />
          <AppText style={styles.bulletText}>{item}</AppText>
        </View>
      ))}
    </View>
  );
}

function InterpretationHeading({ title }: { title: string }) {
  return (
    <View style={styles.interpretationHeading}>
      <AppText style={styles.interpretationTitle}>{title}</AppText>
    </View>
  );
}

function createDemoAnalysisHistory(): AnalysisHistoryItem[] {
  const day = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const getDemoDate = (daysAgo: number) => new Date(now - daysAgo * day).toISOString();

  const items: AnalysisHistoryItem[] = [
    {
      id: 'demo-analysis-june-2026',
      createdAt: getDemoDate(10),
      sourceType: 'pdf',
      fileName: 'blood_test_june_2026.pdf',
      fileUri: 'demo://blood_test_june_2026.pdf',
      mimeType: 'application/pdf',
      status: 'completed',
      isDemo: true,
      biomarkers: [
        {
          id: 'demo-june-vitamin-d',
          name: 'Витамин D',
          value: '32',
          unit: 'ng/ml',
          referenceLabel: 'в норме',
          status: 'good'
        },
        {
          id: 'demo-june-ferritin',
          name: 'Ферритин',
          value: '54',
          unit: 'ng/ml',
          referenceLabel: 'в норме',
          status: 'good'
        },
        {
          id: 'demo-june-cortisol',
          name: 'Кортизол',
          value: '520',
          unit: 'nmol/L',
          referenceLabel: 'зона внимания',
          status: 'attention'
        },
        {
          id: 'demo-june-hba1c',
          name: 'HbA1c',
          value: '5.2',
          unit: '%',
          referenceLabel: 'в норме',
          status: 'good'
        },
        {
          id: 'demo-june-tsh',
          name: 'ТТГ',
          value: '2.1',
          unit: 'mIU/L',
          referenceLabel: 'в норме',
          status: 'good'
        },
        {
          id: 'demo-june-crp',
          name: 'CRP',
          value: '1.4',
          unit: 'mg/L',
          referenceLabel: 'зона внимания',
          status: 'attention'
        }
      ],
      aiInterpretation: {
        attentionItems: [
          { label: 'Кортизол', statusLabel: 'зона внимания', status: 'attention' },
          { label: 'CRP', statusLabel: 'лёгкое воспалительное напряжение', status: 'attention' }
        ],
        bodyImpact: [
          'Может влиять на восстановление и стрессоустойчивость.',
          'Может быть связано с повышенной реакцией на стресс.'
        ],
        nextActions: [
          'Сфокусироваться на сне и восстановлении.',
          'Повторить CRP при необходимости.',
          'Обсудить устойчивую стрессовую нагрузку со специалистом при выраженных симптомах.'
        ],
        nextStepLabel: 'Сравнить динамику',
        safetyNote: demoSafetyNote
      }
    },
    {
      id: 'demo-analysis-march-2026',
      createdAt: getDemoDate(90),
      sourceType: 'pdf',
      fileName: 'blood_test_march_2026.pdf',
      fileUri: 'demo://blood_test_march_2026.pdf',
      mimeType: 'application/pdf',
      status: 'completed',
      isDemo: true,
      biomarkers: [
        {
          id: 'demo-march-vitamin-d',
          name: 'Витамин D',
          value: '28',
          unit: 'ng/ml',
          referenceLabel: 'зона внимания',
          status: 'attention'
        },
        {
          id: 'demo-march-ferritin',
          name: 'Ферритин',
          value: '38',
          unit: 'ng/ml',
          referenceLabel: 'низко-нормальный',
          status: 'attention'
        },
        {
          id: 'demo-march-cortisol',
          name: 'Кортизол',
          value: '575',
          unit: 'nmol/L',
          referenceLabel: 'зона внимания',
          status: 'attention'
        },
        {
          id: 'demo-march-hba1c',
          name: 'HbA1c',
          value: '5.3',
          unit: '%',
          referenceLabel: 'в норме',
          status: 'good'
        },
        {
          id: 'demo-march-tsh',
          name: 'ТТГ',
          value: '2.4',
          unit: 'mIU/L',
          referenceLabel: 'в норме',
          status: 'good'
        },
        {
          id: 'demo-march-b12',
          name: 'B12',
          value: '430',
          unit: 'pg/ml',
          referenceLabel: 'зона внимания',
          status: 'attention'
        }
      ],
      aiInterpretation: {
        attentionItems: [
          { label: 'Витамин D', statusLabel: 'зона внимания', status: 'attention' },
          { label: 'Ферритин', statusLabel: 'низко-нормальный', status: 'attention' },
          { label: 'Кортизол', statusLabel: 'зона внимания', status: 'attention' }
        ],
        bodyImpact: [
          'Может снижать энергию и ухудшать восстановление.',
          'Может усиливать ощущение усталости к вечеру.'
        ],
        nextActions: [
          'Проверить режим сна и стрессовую нагрузку.',
          'Обсудить витамин D, ферритин и стрессовую нагрузку со специалистом.',
          'Повторить анализы через 8–12 недель.'
        ],
        nextStepLabel: 'План повторной проверки',
        safetyNote: demoSafetyNote
      }
    },
    {
      id: 'demo-analysis-december-2025',
      createdAt: getDemoDate(180),
      sourceType: 'pdf',
      fileName: 'blood_test_december_2025.pdf',
      fileUri: 'demo://blood_test_december_2025.pdf',
      mimeType: 'application/pdf',
      status: 'completed',
      isDemo: true,
      biomarkers: [
        {
          id: 'demo-december-vitamin-d',
          name: 'Витамин D',
          value: '24',
          unit: 'ng/ml',
          referenceLabel: 'зона внимания',
          status: 'attention'
        },
        {
          id: 'demo-december-ferritin',
          name: 'Ферритин',
          value: '26',
          unit: 'ng/ml',
          referenceLabel: 'зона внимания',
          status: 'attention'
        },
        {
          id: 'demo-december-cortisol',
          name: 'Кортизол',
          value: '610',
          unit: 'nmol/L',
          referenceLabel: 'зона внимания',
          status: 'attention'
        },
        {
          id: 'demo-december-hba1c',
          name: 'HbA1c',
          value: '5.4',
          unit: '%',
          referenceLabel: 'в норме',
          status: 'good'
        },
        {
          id: 'demo-december-tsh',
          name: 'ТТГ',
          value: '2.8',
          unit: 'mIU/L',
          referenceLabel: 'зона внимания',
          status: 'attention'
        },
        {
          id: 'demo-december-crp',
          name: 'CRP',
          value: '2.2',
          unit: 'mg/L',
          referenceLabel: 'зона внимания',
          status: 'attention'
        }
      ],
      aiInterpretation: {
        attentionItems: [
          { label: 'Витамин D', statusLabel: 'зона внимания', status: 'attention' },
          { label: 'Кортизол', statusLabel: 'зона внимания', status: 'attention' },
          { label: 'CRP', statusLabel: 'зона внимания', status: 'attention' }
        ],
        bodyImpact: [
          'Может быть связано с низкой энергией, слабым восстановлением и тяжёлым утром.',
          'Может влиять на сон, стрессоустойчивость и мотивацию.'
        ],
        nextActions: [
          'Обсудить зоны внимания со специалистом.',
          'Проверить сон, питание и уровень стрессовой нагрузки.',
          'Использовать эти данные как стартовую точку для профиля здоровья.'
        ],
        nextStepLabel: 'Стартовая точка профиля здоровья',
        safetyNote: demoSafetyNote
      }
    }
  ];

  return items.sort((firstItem, secondItem) => Date.parse(secondItem.createdAt) - Date.parse(firstItem.createdAt));
}

function createProcessingAnalysis(upload: SelectedUpload): AnalysisHistoryItem {
  return {
    id: `analysis-${Date.now()}`,
    createdAt: new Date().toISOString(),
    sourceType: upload.sourceType,
    fileName: upload.fileName,
    fileUri: upload.fileUri,
    mimeType: upload.mimeType,
    status: 'processing',
    biomarkers: []
  };
}

async function mockProcessBloodAnalysis(upload: AnalysisHistoryItem): Promise<AnalysisHistoryItem> {
  await wait(1400);

  return {
    ...upload,
    status: 'completed',
    biomarkers: mockBiomarkers,
    aiInterpretation: mockInterpretation
  };
}

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function validateUpload(upload: SelectedUpload) {
  const extension = getFileExtension(upload.fileName || upload.fileUri);
  const mimeType = upload.mimeType?.toLowerCase();
  const hasSupportedMime = mimeType ? acceptedMimeTypes.includes(mimeType) || mimeType.startsWith('image/') : false;
  const hasSupportedExtension = extension ? acceptedExtensions.includes(extension) : false;

  if (!hasSupportedMime && !hasSupportedExtension) {
    return 'Выберите PDF или изображение.';
  }

  return null;
}

function inferMimeType(fileNameOrUri: string) {
  const extension = getFileExtension(fileNameOrUri);

  if (extension === 'pdf') {
    return 'application/pdf';
  }

  if (extension === 'jpg' || extension === 'jpeg') {
    return 'image/jpeg';
  }

  if (extension === 'png') {
    return 'image/png';
  }

  if (extension === 'heic') {
    return 'image/heic';
  }

  if (extension === 'heif') {
    return 'image/heif';
  }

  if (extension === 'webp') {
    return 'image/webp';
  }

  return undefined;
}

function isPdfUpload(fileName: string, mimeType?: string) {
  return mimeType === 'application/pdf' || getFileExtension(fileName) === 'pdf';
}

function getFileExtension(fileNameOrUri: string) {
  const cleanValue = fileNameOrUri.split('?')[0] ?? '';
  const extension = cleanValue.split('.').pop();
  return extension ? extension.toLowerCase() : '';
}

function getSourceLabel(sourceType: AnalysisSourceType) {
  if (sourceType === 'photo') {
    return 'Фото';
  }

  if (sourceType === 'pdf') {
    return 'Файл PDF';
  }

  return 'Изображение';
}

function getUploadStatusLabel(status: AnalysisUploadStatus) {
  if (status === 'processing' || status === 'picking') {
    return 'Обработка';
  }

  if (status === 'completed') {
    return 'Готово';
  }

  if (status === 'error') {
    return 'Ошибка';
  }

  return 'Готово';
}

function getUploadStatusChipStyle(status: AnalysisUploadStatus) {
  if (status === 'completed') {
    return styles.statusGood;
  }

  if (status === 'error') {
    return styles.statusPoor;
  }

  return styles.statusAttention;
}

function getUploadStatusTextStyle(status: AnalysisUploadStatus) {
  if (status === 'completed') {
    return styles.statusGoodText;
  }

  if (status === 'error') {
    return styles.statusPoorText;
  }

  return styles.statusAttentionText;
}

function getBiomarkerStatusStyle(status: BiomarkerStatus) {
  if (status === 'good') {
    return styles.statusGood;
  }

  if (status === 'poor') {
    return styles.statusPoor;
  }

  if (status === 'unknown') {
    return styles.statusUnknown;
  }

  return styles.statusAttention;
}

function getBiomarkerStatusTextStyle(status: BiomarkerStatus) {
  if (status === 'good') {
    return styles.statusGoodText;
  }

  if (status === 'poor') {
    return styles.statusPoorText;
  }

  if (status === 'unknown') {
    return styles.statusUnknownText;
  }

  return styles.statusAttentionText;
}

function formatAnalysisDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: colors.background
  },
  headerCard: {
    minHeight: 82,
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
    backgroundColor: colors.background,
    paddingVertical: 8,
    paddingLeft: 22,
    paddingRight: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowOpacity: 0,
    elevation: 0
  },
  headerIllustrationWrapper: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 124,
    height: 76,
    opacity: 0.86,
    zIndex: 0
  },
  headerIllustration: {
    width: '100%',
    height: '100%'
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1
  },
  pressed: {
    opacity: 0.76
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    marginLeft: 14,
    marginRight: 78,
    zIndex: 1
  },
  title: {
    color: colors.primary,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '900'
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  content: {
    paddingHorizontal: contentHorizontalPadding,
    paddingTop: 16,
    paddingBottom: 120
  },
  uploadCard: {
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(216, 161, 59, 0.36)',
    padding: 21,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.22,
    shadowRadius: 26,
    elevation: 7
  },
  uploadCardCollapsed: {
    paddingVertical: 17
  },
  sectionHeader: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start'
  },
  sectionHeaderCollapsed: {
    alignItems: 'center'
  },
  sectionIcon: {
    width: 58,
    height: 58,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: 'rgba(1, 40, 31, 0.58)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionTitleBlock: {
    flex: 1,
    minWidth: 0
  },
  sectionTitle: {
    color: colors.textOnPrimary,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '900'
  },
  sectionCopy: {
    color: 'rgba(255, 248, 234, 0.88)',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8
  },
  uploadCardChevron: {
    width: 34,
    height: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(246, 214, 145, 0.52)',
    backgroundColor: 'rgba(1, 40, 31, 0.34)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12
  },
  uploadCardChevronCollapsed: {
    marginTop: 0
  },
  uploadActions: {
    gap: 11,
    marginTop: 20
  },
  uploadButton: {
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: colors.textOnPrimary,
    paddingHorizontal: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2
  },
  uploadButtonContent: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  uploadButtonText: {
    color: colors.primary,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '900'
  },
  disabledButton: {
    opacity: 0.48
  },
  disabledButtonText: {
    color: colors.textSoft
  },
  uploadNote: {
    color: 'rgba(255, 248, 234, 0.86)',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 16
  },
  takeAnalysesButton: {
    width: '88%',
    aspectRatio: 1360 / 382,
    alignSelf: 'center',
    marginTop: 9
  },
  takeAnalysesImage: {
    width: '100%',
    height: '100%'
  },
  processingCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.primary,
    padding: 14,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  processingIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center'
  },
  processingText: {
    flex: 1,
    minWidth: 0
  },
  processingTitle: {
    color: colors.textOnPrimary,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '900'
  },
  processingCopy: {
    color: colors.textOnPrimaryMuted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2
  },
  errorCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: '#FFF2EF',
    padding: 14,
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start'
  },
  errorText: {
    flex: 1,
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800'
  },
  historySection: {
    marginTop: 18
  },
  historyTitle: {
    color: colors.primary,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '900'
  },
  emptyCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    padding: 18,
    marginTop: 12
  },
  emptyTitle: {
    color: colors.primary,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900'
  },
  emptyCopy: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 7
  },
  historyCarouselBlock: {
    marginTop: 12
  },
  historyCarouselItem: {
    paddingRight: 0
  },
  historyCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    padding: 16
  },
  historyCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    alignItems: 'flex-start'
  },
  historyMeta: {
    flex: 1,
    minWidth: 0
  },
  historyChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0
  },
  demoChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  demoChipText: {
    color: colors.primary,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '900'
  },
  historyDate: {
    color: colors.primary,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900'
  },
  statusChip: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  statusChipText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '900'
  },
  statusGood: {
    backgroundColor: '#E6F1E6',
    borderWidth: 1,
    borderColor: '#9DBB9C'
  },
  statusGoodText: {
    color: colors.success
  },
  statusAttention: {
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent
  },
  statusAttentionText: {
    color: colors.primary
  },
  statusPoor: {
    backgroundColor: '#F7DED8',
    borderWidth: 1,
    borderColor: colors.danger
  },
  statusPoorText: {
    color: colors.danger
  },
  statusUnknown: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.borderSoft
  },
  statusUnknownText: {
    color: colors.textMuted
  },
  summaryPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 12
  },
  summaryPillText: {
    color: colors.primary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900'
  },
  processingInline: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12
  },
  historyError: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12
  },
  analysisFileRow: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.background,
    padding: 12,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  analysisFileIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center'
  },
  analysisFileTextBlock: {
    flex: 1,
    minWidth: 0
  },
  analysisFileLabel: {
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800'
  },
  analysisFileName: {
    color: colors.primary,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
    marginTop: 2
  },
  carouselControls: {
    alignSelf: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    padding: 5,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 2
  },
  carouselControlButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  carouselControlButtonDisabled: {
    borderColor: colors.borderSoft,
    backgroundColor: colors.backgroundSecondary,
    opacity: 0.58
  },
  carouselIndicator: {
    minWidth: 82,
    borderRadius: 999,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  carouselIndicatorText: {
    color: colors.textOnPrimary,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '900'
  },
  biomarkerBlock: {
    marginTop: 16
  },
  blockTitle: {
    color: colors.primary,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900'
  },
  biomarkerList: {
    gap: 8,
    marginTop: 10
  },
  biomarkerRow: {
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    alignItems: 'center'
  },
  biomarkerInfo: {
    flex: 1,
    minWidth: 0
  },
  biomarkerName: {
    color: colors.primary,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900'
  },
  biomarkerValue: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2
  },
  biomarkerStatus: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  biomarkerStatusText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '900'
  },
  interpretationToggle: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.background,
    paddingHorizontal: 13,
    paddingVertical: 11,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },
  interpretationToggleText: {
    flex: 1,
    color: colors.primary,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900'
  },
  interpretationBlock: {
    borderTopWidth: 1,
    borderTopColor: colors.accent,
    marginTop: 16,
    paddingTop: 16
  },
  interpretationSection: {
    marginTop: 12
  },
  interpretationHeading: {
    alignSelf: 'flex-start'
  },
  interpretationTitle: {
    color: colors.primary,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    textDecorationLine: 'underline',
    textDecorationColor: colors.accent,
    textDecorationStyle: 'solid'
  },
  attentionList: {
    gap: 8,
    marginTop: 8
  },
  attentionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },
  attentionLabel: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '800'
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    marginTop: 8
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginTop: 7
  },
  bulletText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20
  },
  nextStepRow: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.primary,
    padding: 14,
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12
  },
  nextStepTitle: {
    color: colors.textOnPrimaryMuted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800'
  },
  nextStepCopy: {
    color: colors.textOnPrimary,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '900',
    marginTop: 2
  },
  soonBadge: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  soonBadgeText: {
    color: colors.accentSoft,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '900'
  },
  safetyNote: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12
  }
});
