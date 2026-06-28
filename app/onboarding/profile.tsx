import { useCallback, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { SectionCard } from '@/components/SectionCard';
import {
  fetchProfile,
  type ProfileDraft,
  upsertProfileDraft
} from '@/services/phase3Persistence';
import { colors } from '@/theme/colors';

type ProfileGender = 'male' | 'female' | '';
type BooleanChoice = boolean | null;
type MeasurementUnits = 'metric' | 'imperial';

type ProfileForm = {
  firstName: string;
  birthDate: string;
  gender: ProfileGender;
  heightCm: string;
  weightKg: string;
  targetWeightKg: string;
  mainGoal: string;
  priorityFocus: string;
  activityLevel: string;
  workType: string;
  wakeTime: string;
  bedtime: string;
  sleepDurationHours: string;
  stressLevel: string;
  dietType: string;
  mealCount: string;
  foodAllergies: string;
  foodIntolerances: string;
  caffeineServings: string;
  alcoholUse: string;
  chronicConditions: string;
  medications: string;
  medicationAllergies: string;
  contraindications: string;
  pregnancy: BooleanChoice;
  breastfeeding: BooleanChoice;
  currentSupplements: string;
  supplementReactions: string;
  measurementUnits: MeasurementUnits;
  remindersEnabled: boolean;
  profileRecommendationsConsent: boolean;
};

type ProfileFormKey = keyof ProfileForm;
type ProfileErrors = Partial<Record<ProfileFormKey, string>>;

const personalProfileHeaderPlaque = require('../../assets/images/personal-profile-header-plaque.png');

const mainGoalOptions = [
  'Повысить энергию',
  'Улучшить сон',
  'Улучшить восстановление',
  'Повысить концентрацию',
  'Снизить стресс',
  'Нормализовать вес',
  'Улучшить общее самочувствие'
];

const activityOptions = ['Низкий', 'Средний', 'Высокий'];
const workTypeOptions = ['Преимущественно сидячая', 'Смешанная', 'Физическая'];
const stressOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const dietOptions = ['Обычное', 'Вегетарианское', 'Веганское', 'Безглютеновое', 'Низкоуглеводное', 'Другое'];
const mealCountOptions = ['1', '2', '3', '4', '5', '6'];
const caffeineOptions = ['0', '1', '2', '3', '4', '5'];
const alcoholOptions = ['Не употребляю', 'Редко', 'Несколько раз в неделю', 'Ежедневно'];

const initialProfileForm: ProfileForm = {
  firstName: '',
  birthDate: '',
  gender: '',
  heightCm: '',
  weightKg: '',
  targetWeightKg: '',
  mainGoal: '',
  priorityFocus: '',
  activityLevel: '',
  workType: '',
  wakeTime: '',
  bedtime: '',
  sleepDurationHours: '',
  stressLevel: '',
  dietType: '',
  mealCount: '',
  foodAllergies: '',
  foodIntolerances: '',
  caffeineServings: '',
  alcoholUse: '',
  chronicConditions: '',
  medications: '',
  medicationAllergies: '',
  contraindications: '',
  pregnancy: null,
  breastfeeding: null,
  currentSupplements: '',
  supplementReactions: '',
  measurementUnits: 'metric',
  remindersEnabled: true,
  profileRecommendationsConsent: false
};

export default function ProfileSetupScreen() {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<ProfileForm>(initialProfileForm);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      fetchProfile()
        .then((result) => {
          if (!isActive) {
            return;
          }

          if (result.ok) {
            const savedProfile = result.data;

            if (savedProfile) {
              setForm((current) => ({ ...current, ...profileDraftToForm(savedProfile) }));
            }
          }
        })
        .catch(() => undefined);

      return () => {
        isActive = false;
      };
    }, [])
  );

  function updateField<Key extends ProfileFormKey>(key: Key, value: ProfileForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) {
        return current;
      }

      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function saveProfile() {
    const validationErrors = validateProfile(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSaving(true);
    await upsertProfileDraft(formToProfileDraft(form));
    setIsSaving(false);
  }

  return (
    <SafeAreaView style={styles.screenRoot}>
      <PersonalProfileHeader />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardRoot}
      >
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 132 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FormSection title="Основные данные">
            <TextField
              label="Имя"
              required
              value={form.firstName}
              onChangeText={(value) => updateField('firstName', value)}
              error={errors.firstName}
            />
            <TextField
              label="Дата рождения"
              placeholder="ДД.ММ.ГГГГ"
              required
              value={form.birthDate}
              onChangeText={(value) => updateField('birthDate', value)}
              error={errors.birthDate}
            />
            <SegmentedField
              label="Пол"
              value={form.gender}
              options={[
                { label: 'Мужской', value: 'male' },
                { label: 'Женский', value: 'female' }
              ]}
              onChange={(value) => updateField('gender', value as ProfileGender)}
            />
          </FormSection>

          <FormSection title="Параметры тела">
            <TextField
              label="Рост, см"
              required
              keyboardType="numeric"
              value={form.heightCm}
              onChangeText={(value) => updateField('heightCm', value)}
              error={errors.heightCm}
            />
            <TextField
              label="Вес, кг"
              required
              keyboardType="numeric"
              value={form.weightKg}
              onChangeText={(value) => updateField('weightKg', value)}
              error={errors.weightKg}
            />
            <TextField
              label="Желаемый вес, кг"
              keyboardType="numeric"
              value={form.targetWeightKg}
              onChangeText={(value) => updateField('targetWeightKg', value)}
              error={errors.targetWeightKg}
            />
          </FormSection>

          <FormSection title="Цели">
            <ChipField
              label="Главная цель"
              value={form.mainGoal}
              options={mainGoalOptions}
              onChange={(value) => updateField('mainGoal', value)}
            />
            <TextField
              label="Что особенно важно улучшить"
              multiline
              value={form.priorityFocus}
              onChangeText={(value) => updateField('priorityFocus', value)}
            />
          </FormSection>

          <FormSection title="Образ жизни">
            <ChipField
              label="Уровень физической активности"
              value={form.activityLevel}
              options={activityOptions}
              onChange={(value) => updateField('activityLevel', value)}
            />
            <ChipField
              label="Характер работы"
              value={form.workType}
              options={workTypeOptions}
              onChange={(value) => updateField('workType', value)}
            />
            <TextField
              label="Обычное время пробуждения"
              placeholder="07:30"
              value={form.wakeTime}
              onChangeText={(value) => updateField('wakeTime', value)}
            />
            <TextField
              label="Обычное время сна"
              placeholder="23:00"
              value={form.bedtime}
              onChangeText={(value) => updateField('bedtime', value)}
            />
            <TextField
              label="Средняя продолжительность сна"
              keyboardType="numeric"
              value={form.sleepDurationHours}
              onChangeText={(value) => updateField('sleepDurationHours', value)}
              error={errors.sleepDurationHours}
            />
            <ChipField
              label="Уровень стресса"
              value={form.stressLevel}
              options={stressOptions}
              onChange={(value) => updateField('stressLevel', value)}
            />
          </FormSection>

          <FormSection title="Питание">
            <ChipField
              label="Тип питания"
              value={form.dietType}
              options={dietOptions}
              onChange={(value) => updateField('dietType', value)}
            />
            <ChipField
              label="Количество приёмов пищи в день"
              value={form.mealCount}
              options={mealCountOptions}
              onChange={(value) => updateField('mealCount', value)}
              error={errors.mealCount}
            />
            <NoneTextField
              label="Пищевые аллергии"
              noneLabel="Нет"
              value={form.foodAllergies}
              onChangeText={(value) => updateField('foodAllergies', value)}
            />
            <NoneTextField
              label="Пищевая непереносимость"
              noneLabel="Нет"
              value={form.foodIntolerances}
              onChangeText={(value) => updateField('foodIntolerances', value)}
            />
            <ChipField
              label="Кофеин в день"
              value={form.caffeineServings}
              options={caffeineOptions}
              onChange={(value) => updateField('caffeineServings', value)}
            />
            <ChipField
              label="Алкоголь"
              value={form.alcoholUse}
              options={alcoholOptions}
              onChange={(value) => updateField('alcoholUse', value)}
            />
          </FormSection>

          <FormSection title="Здоровье и безопасность">
            <NoneTextField
              label="Хронические заболевания и состояния"
              noneLabel="Нет"
              value={form.chronicConditions}
              onChangeText={(value) => updateField('chronicConditions', value)}
            />
            <NoneTextField
              label="Постоянно принимаемые лекарства"
              noneLabel="Нет"
              value={form.medications}
              onChangeText={(value) => updateField('medications', value)}
            />
            <NoneTextField
              label="Аллергия на лекарства"
              noneLabel="Нет"
              value={form.medicationAllergies}
              onChangeText={(value) => updateField('medicationAllergies', value)}
            />
            <NoneTextField
              label="Противопоказания и ограничения"
              noneLabel="Нет"
              value={form.contraindications}
              onChangeText={(value) => updateField('contraindications', value)}
            />

            {form.gender === 'female' ? (
              <>
                <BooleanField
                  label="Беременность"
                  value={form.pregnancy}
                  onChange={(value) => updateField('pregnancy', value)}
                />
                <BooleanField
                  label="Грудное вскармливание"
                  value={form.breastfeeding}
                  onChange={(value) => updateField('breastfeeding', value)}
                />
              </>
            ) : null}
          </FormSection>

          <FormSection title="Добавки">
            <NoneTextField
              label="Добавки, которые принимаются сейчас"
              noneLabel="Не принимаю"
              value={form.currentSupplements}
              onChangeText={(value) => updateField('currentSupplements', value)}
            />
            <NoneTextField
              label="Нежелательные реакции на добавки"
              noneLabel="Нет"
              value={form.supplementReactions}
              onChangeText={(value) => updateField('supplementReactions', value)}
            />
          </FormSection>

          <FormSection title="Настройки">
            <SegmentedField
              label="Единицы измерения"
              value={form.measurementUnits}
              options={[
                { label: 'Метрические', value: 'metric' },
                { label: 'Имперские', value: 'imperial' }
              ]}
              onChange={(value) => updateField('measurementUnits', value as MeasurementUnits)}
            />
            <ToggleField
              label="Напоминания"
              value={form.remindersEnabled}
              onChange={(value) => updateField('remindersEnabled', value)}
            />
            <ConsentField
              label="Использовать данные профиля для персональных рекомендаций"
              value={form.profileRecommendationsConsent}
              onChange={(value) => updateField('profileRecommendationsConsent', value)}
              error={errors.profileRecommendationsConsent}
            />
          </FormSection>

          <Pressable
            accessibilityRole="button"
            disabled={isSaving}
            onPress={saveProfile}
            style={({ pressed }) => [styles.saveButton, isSaving && styles.disabledButton, pressed && styles.pressedAction]}
          >
            <AppText style={styles.saveButtonText}>{isSaving ? 'Сохраняем...' : 'Сохранить профиль'}</AppText>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FormSection({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <SectionCard tone="primary" style={styles.sectionCard}>
      <AppText style={styles.sectionTitle}>{title}</AppText>
      {children}
    </SectionCard>
  );
}

function TextField({
  error,
  keyboardType,
  label,
  multiline,
  onChangeText,
  placeholder,
  required,
  value
}: {
  error?: string;
  keyboardType?: 'numeric';
  label: string;
  multiline?: boolean;
  onChangeText: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  value: string;
}) {
  return (
    <View style={styles.fieldBlock}>
      <FieldLabel label={label} required={required} />
      <TextInput
        keyboardType={keyboardType}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder ?? label}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, multiline && styles.multilineInput, error && styles.inputError]}
        textAlignVertical={multiline ? 'top' : 'center'}
        value={value}
      />
      {error ? <AppText style={styles.errorText}>{error}</AppText> : null}
    </View>
  );
}

function NoneTextField({
  label,
  noneLabel,
  onChangeText,
  value
}: {
  label: string;
  noneLabel: string;
  onChangeText: (value: string) => void;
  value: string;
}) {
  return (
    <View style={styles.fieldBlock}>
      <View style={styles.labelRow}>
        <View style={styles.labelRowText}>
          <FieldLabel label={label} />
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => onChangeText(noneLabel)}
          style={[styles.smallChip, value.trim() === noneLabel && styles.chipActive]}
        >
          <AppText style={[styles.smallChipText, value.trim() === noneLabel && styles.chipTextActive]}>{noneLabel}</AppText>
        </Pressable>
      </View>
      <TextInput
        multiline
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, styles.multilineInput]}
        textAlignVertical="top"
        value={value}
      />
    </View>
  );
}

function SegmentedField({
  label,
  onChange,
  options,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  value: string;
}) {
  return (
    <View style={styles.fieldBlock}>
      <FieldLabel label={label} />
      <View style={styles.segmentRow}>
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              onPress={() => onChange(option.value)}
              style={[styles.segmentButton, selected && styles.segmentButtonActive]}
            >
              <AppText style={[styles.segmentText, selected && styles.segmentTextActive]}>{option.label}</AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function ChipField({
  error,
  label,
  onChange,
  options,
  value
}: {
  error?: string;
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <View style={styles.fieldBlock}>
      <FieldLabel label={label} />
      <View style={styles.chipRow}>
        {options.map((option) => {
          const selected = value === option;

          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              onPress={() => onChange(option)}
              style={[styles.chip, selected && styles.chipActive]}
            >
              <AppText style={[styles.chipText, selected && styles.chipTextActive]}>{option}</AppText>
            </Pressable>
          );
        })}
      </View>
      {error ? <AppText style={styles.errorText}>{error}</AppText> : null}
    </View>
  );
}

function BooleanField({
  label,
  onChange,
  value
}: {
  label: string;
  onChange: (value: boolean) => void;
  value: BooleanChoice;
}) {
  return (
    <SegmentedField
      label={label}
      value={value === true ? 'yes' : value === false ? 'no' : ''}
      options={[
        { label: 'Да', value: 'yes' },
        { label: 'Нет', value: 'no' }
      ]}
      onChange={(nextValue) => onChange(nextValue === 'yes')}
    />
  );
}

function ToggleField({
  label,
  onChange,
  value
}: {
  label: string;
  onChange: (value: boolean) => void;
  value: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      style={styles.toggleRow}
    >
      <AppText style={styles.toggleLabel}>{label}</AppText>
      <View style={[styles.toggleTrack, value && styles.toggleTrackActive]}>
        <View style={[styles.toggleKnob, value && styles.toggleKnobActive]} />
      </View>
    </Pressable>
  );
}

function ConsentField({
  error,
  label,
  onChange,
  value
}: {
  error?: string;
  label: string;
  onChange: (value: boolean) => void;
  value: boolean;
}) {
  return (
    <View style={styles.fieldBlock}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: value }}
        onPress={() => onChange(!value)}
        style={[styles.consentRow, error && styles.consentError]}
      >
        <Ionicons
          name={value ? 'checkbox-outline' : 'square-outline'}
          size={22}
          color={value ? colors.accent : colors.primary}
        />
        <AppText style={styles.consentText}>{label}</AppText>
      </Pressable>
      {error ? <AppText style={styles.errorText}>{error}</AppText> : null}
    </View>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <AppText style={styles.fieldLabel}>
      {label}
      {required ? <AppText style={styles.requiredMark}> *</AppText> : null}
    </AppText>
  );
}

function PersonalProfileHeader() {
  return (
    <View style={styles.headerCard}>
      <Image source={personalProfileHeaderPlaque} resizeMode="cover" style={styles.headerImage} />
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

function validateProfile(currentForm: ProfileForm) {
  const nextErrors: ProfileErrors = {};

  if (!currentForm.firstName.trim()) {
    nextErrors.firstName = 'Введите имя.';
  }

  if (!currentForm.birthDate.trim()) {
    nextErrors.birthDate = 'Введите дату рождения.';
  } else if (!parseBirthDate(currentForm.birthDate)) {
    nextErrors.birthDate = 'Используйте формат ДД.ММ.ГГГГ.';
  }

  validateRequiredPositiveNumber(nextErrors, currentForm.heightCm, 'heightCm', 'Введите рост.');
  validateRequiredPositiveNumber(nextErrors, currentForm.weightKg, 'weightKg', 'Введите вес.');
  validateOptionalNonNegativeNumber(nextErrors, currentForm.targetWeightKg, 'targetWeightKg');
  validateOptionalPositiveNumber(nextErrors, currentForm.sleepDurationHours, 'sleepDurationHours');
  validateOptionalPositiveNumber(nextErrors, currentForm.mealCount, 'mealCount');

  if (!currentForm.profileRecommendationsConsent) {
    nextErrors.profileRecommendationsConsent = 'Подтвердите согласие для персональных рекомендаций.';
  }

  return nextErrors;
}

function validateRequiredPositiveNumber(
  nextErrors: ProfileErrors,
  value: string,
  key: 'heightCm' | 'weightKg',
  emptyMessage: string
) {
  if (!value.trim()) {
    nextErrors[key] = emptyMessage;
    return;
  }

  const number = parseNumber(value);

  if (number === undefined || number <= 0) {
    nextErrors[key] = 'Значение должно быть больше нуля.';
  }
}

function validateOptionalNonNegativeNumber(
  nextErrors: ProfileErrors,
  value: string,
  key: 'targetWeightKg'
) {
  if (!value.trim()) {
    return;
  }

  const number = parseNumber(value);

  if (number === undefined || number < 0) {
    nextErrors[key] = 'Значение не может быть отрицательным.';
  }
}

function validateOptionalPositiveNumber(
  nextErrors: ProfileErrors,
  value: string,
  key: 'sleepDurationHours' | 'mealCount'
) {
  if (!value.trim()) {
    return;
  }

  const number = parseNumber(value);

  if (number === undefined || number <= 0) {
    nextErrors[key] = 'Значение должно быть больше нуля.';
  }
}

function formToProfileDraft(currentForm: ProfileForm): ProfileDraft {
  return {
    firstName: cleanText(currentForm.firstName),
    birthDate: cleanText(currentForm.birthDate),
    gender: currentForm.gender || undefined,
    sexAtBirth: currentForm.gender || undefined,
    heightCm: parseNumber(currentForm.heightCm),
    weightKg: parseNumber(currentForm.weightKg),
    targetWeightKg: parseNumber(currentForm.targetWeightKg),
    mainGoal: cleanText(currentForm.mainGoal),
    priorityFocus: cleanText(currentForm.priorityFocus),
    workType: cleanText(currentForm.workType),
    activityLevel: cleanText(currentForm.activityLevel),
    sleepSchedule: buildSleepSchedule(currentForm),
    wakeTime: cleanText(currentForm.wakeTime),
    bedtime: cleanText(currentForm.bedtime),
    sleepDurationHours: parseNumber(currentForm.sleepDurationHours),
    stressLevel: cleanText(currentForm.stressLevel),
    dietType: cleanText(currentForm.dietType),
    mealCount: parseNumber(currentForm.mealCount),
    foodAllergies: cleanText(currentForm.foodAllergies),
    foodIntolerances: cleanText(currentForm.foodIntolerances),
    caffeineServings: parseNumber(currentForm.caffeineServings),
    alcoholUse: cleanText(currentForm.alcoholUse),
    chronicConditions: cleanText(currentForm.chronicConditions),
    medications: cleanText(currentForm.medications),
    medicationAllergies: cleanText(currentForm.medicationAllergies),
    contraindications: cleanText(currentForm.contraindications),
    pregnancy: currentForm.gender === 'female' && currentForm.pregnancy !== null ? currentForm.pregnancy : undefined,
    breastfeeding: currentForm.gender === 'female' && currentForm.breastfeeding !== null ? currentForm.breastfeeding : undefined,
    currentSupplements: cleanText(currentForm.currentSupplements),
    supplementReactions: cleanText(currentForm.supplementReactions),
    measurementUnits: currentForm.measurementUnits,
    remindersEnabled: currentForm.remindersEnabled,
    profileRecommendationsConsent: currentForm.profileRecommendationsConsent
  };
}

function profileDraftToForm(profile: ProfileDraft & Record<string, unknown>): Partial<ProfileForm> {
  const gender = normalizeGender(profile.sexAtBirth ?? profile.gender ?? profile.gender_at_birth);

  return {
    firstName: stringValue(profile.firstName ?? profile.first_name ?? profile.name),
    birthDate: stringValue(profile.birthDate ?? profile.birth_date),
    gender,
    heightCm: numberValue(profile.heightCm ?? profile.height_cm),
    weightKg: numberValue(profile.weightKg ?? profile.weight_kg),
    targetWeightKg: numberValue(profile.targetWeightKg),
    mainGoal: stringValue(profile.mainGoal ?? profile.main_goal),
    priorityFocus: stringValue(profile.priorityFocus),
    activityLevel: stringValue(profile.activityLevel),
    workType: stringValue(profile.workType),
    wakeTime: stringValue(profile.wakeTime),
    bedtime: stringValue(profile.bedtime),
    sleepDurationHours: numberValue(profile.sleepDurationHours),
    stressLevel: stringValue(profile.stressLevel),
    dietType: stringValue(profile.dietType),
    mealCount: numberValue(profile.mealCount),
    foodAllergies: stringValue(profile.foodAllergies),
    foodIntolerances: stringValue(profile.foodIntolerances),
    caffeineServings: numberValue(profile.caffeineServings),
    alcoholUse: stringValue(profile.alcoholUse),
    chronicConditions: stringValue(profile.chronicConditions),
    medications: stringValue(profile.medications),
    medicationAllergies: stringValue(profile.medicationAllergies),
    contraindications: stringValue(profile.contraindications),
    pregnancy: booleanValue(profile.pregnancy),
    breastfeeding: booleanValue(profile.breastfeeding),
    currentSupplements: stringValue(profile.currentSupplements),
    supplementReactions: stringValue(profile.supplementReactions),
    measurementUnits: profile.measurementUnits === 'imperial' ? 'imperial' : 'metric',
    remindersEnabled: booleanValue(profile.remindersEnabled) ?? true,
    profileRecommendationsConsent: booleanValue(profile.profileRecommendationsConsent) ?? false
  };
}

function buildSleepSchedule(currentForm: ProfileForm) {
  const items = [
    currentForm.wakeTime.trim() ? `Пробуждение: ${currentForm.wakeTime.trim()}` : null,
    currentForm.bedtime.trim() ? `Сон: ${currentForm.bedtime.trim()}` : null,
    currentForm.sleepDurationHours.trim() ? `Длительность: ${currentForm.sleepDurationHours.trim()} ч` : null
  ].filter(Boolean);

  return items.length > 0 ? items.join('; ') : undefined;
}

function parseNumber(value: string) {
  const text = value.trim().replace(',', '.');

  if (!text) {
    return undefined;
  }

  const number = Number(text);
  return Number.isFinite(number) ? number : undefined;
}

function cleanText(value: string) {
  const text = value.trim();
  return text ? text : undefined;
}

function stringValue(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function numberValue(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? String(value) : '';
}

function booleanValue(value: unknown) {
  return typeof value === 'boolean' ? value : null;
}

function normalizeGender(value: unknown): ProfileGender {
  return value === 'male' || value === 'female' ? value : '';
}

function parseBirthDate(value: string) {
  const text = value.trim();
  const ruMatch = text.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const year = ruMatch ? Number(ruMatch[3]) : isoMatch ? Number(isoMatch[1]) : NaN;
  const month = ruMatch ? Number(ruMatch[2]) : isoMatch ? Number(isoMatch[2]) : NaN;
  const day = ruMatch ? Number(ruMatch[1]) : isoMatch ? Number(isoMatch[3]) : NaN;

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }

  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day || date > new Date()) {
    return null;
  }

  return date;
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: colors.background
  },
  keyboardRoot: {
    flex: 1
  },
  content: {
    paddingHorizontal: 18,
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
    height: '100%'
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
  sectionCard: {
    backgroundColor: colors.primary,
    borderColor: colors.accent,
    padding: 16,
    borderRadius: 22,
    marginBottom: 14
  },
  sectionTitle: {
    color: colors.textOnPrimary,
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 25,
    lineHeight: 30,
    marginBottom: 12
  },
  fieldBlock: {
    marginBottom: 12
  },
  fieldLabel: {
    color: colors.textOnPrimary,
    fontWeight: '800',
    marginBottom: 7,
    flexShrink: 1
  },
  requiredMark: {
    color: colors.accent,
    fontWeight: '900'
  },
  labelRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    columnGap: 10,
    rowGap: 6,
    marginBottom: 7
  },
  labelRowText: {
    flex: 1,
    minWidth: 0
  },
  input: {
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.background,
    color: colors.primary,
    paddingHorizontal: 13,
    paddingVertical: 10,
    fontSize: 15,
    lineHeight: 20
  },
  multilineInput: {
    minHeight: 82
  },
  inputError: {
    borderColor: colors.accent
  },
  errorText: {
    color: colors.accent,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 5
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8
  },
  segmentButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  segmentButtonActive: {
    backgroundColor: colors.background,
    borderColor: colors.accent
  },
  segmentText: {
    color: colors.primary,
    flexShrink: 1,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    textAlign: 'center'
  },
  segmentTextActive: {
    color: colors.accent
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  chip: {
    maxWidth: '100%',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  smallChip: {
    maxWidth: '100%',
    flexShrink: 0,
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.background,
    paddingHorizontal: 11,
    paddingVertical: 6
  },
  chipActive: {
    backgroundColor: colors.background,
    borderColor: colors.accent
  },
  chipText: {
    color: colors.primary,
    flexShrink: 1,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800'
  },
  smallChipText: {
    color: colors.primary,
    flexShrink: 1,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '900'
  },
  chipTextActive: {
    color: colors.accent
  },
  toggleRow: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 12
  },
  toggleLabel: {
    flex: 1,
    color: colors.primary,
    fontWeight: '800'
  },
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.background,
    padding: 3
  },
  toggleTrackActive: {
    backgroundColor: colors.background
  },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary
  },
  toggleKnobActive: {
    backgroundColor: colors.accent,
    transform: [{ translateX: 20 }]
  },
  consentRow: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.background,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  consentError: {
    borderColor: colors.accent
  },
  consentText: {
    flex: 1,
    color: colors.primary,
    fontWeight: '800'
  },
  saveButton: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginTop: 2
  },
  disabledButton: {
    opacity: 0.7
  },
  saveButtonText: {
    color: colors.primary,
    fontWeight: '900',
    fontSize: 16,
    lineHeight: 20
  }
});
