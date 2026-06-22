import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { buildDemoAiCoachResponse } from '@/data/demoAiCoach';
import { useI18n, type Language } from '@/i18n';
import { callHealthCoachAI } from '@/lib/aiClient';
import { colors } from '@/theme/colors';

type ChatAttachment = {
  id: string;
  kind: 'image' | 'file';
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  attachments?: ChatAttachment[];
  status?: 'loading' | 'error';
  meta?: string;
};

type ComposerIconName = keyof typeof Ionicons.glyphMap;

const aiAssistantHeader = require('../../assets/images/ai-assistant-header.png');
const AI_HEADER_PLAQUE_SURFACE = '#FEF8F1';
const aiHeaderTitle = 'AI-ассистент';
const aiHeaderSubtitle = 'Помогает понять показатели, найти причины усталости и выбрать следующий шаг.';
const voiceInputHint = 'Голосовой ввод скоро будет доступен';
const attachmentOnlyResponse = 'Вложения добавлены в чат. Сейчас они остаются локально; отправка файлов в AI будет подключена после backend-хранилища.';

export default function AIScreen() {
  const { language, t } = useI18n();
  const { context } = useLocalSearchParams<{ context?: string }>();
  const isNutritionContext = context === 'nutrition';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState(isNutritionContext ? t('ai.nutritionPrompt') : '');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isAttachmentMenuVisible, setIsAttachmentMenuVisible] = useState(false);
  const [composerHint, setComposerHint] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSend = Boolean(message.trim()) || attachments.length > 0;

  async function submitMessage() {
    const trimmedMessage = message.trim();
    const selectedAttachments = attachments;

    if ((!trimmedMessage && selectedAttachments.length === 0) || isSubmitting) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: createId('user'),
        role: 'user',
        text: trimmedMessage,
        attachments: selectedAttachments
      }
    ]);
    setMessage('');
    setAttachments([]);
    setComposerHint('');

    if (!trimmedMessage) {
      setMessages((current) => [
        ...current,
        {
          id: createId('assistant'),
          role: 'assistant',
          text: attachmentOnlyResponse
        }
      ]);
      return;
    }

    const loadingMessageId = createId('assistant-loading');
    setMessages((current) => [
      ...current,
      {
        id: loadingMessageId,
        role: 'assistant',
        text: '',
        status: 'loading'
      }
    ]);
    setIsSubmitting(true);

    try {
      // TODO: upload selectedAttachments to backend storage/provider when the file-capable AI flow is added.
      const result = await callHealthCoachAI({
        userId: 'local-user',
        task: isNutritionContext ? 'nutrition_plan' : 'ai_chat',
        input: {
          message: trimmedMessage,
          context: isNutritionContext ? 'nutrition' : 'general',
          language
        }
      });

      if ('answer' in result) {
        const responseAnswer =
          result.answer ||
          buildDemoAiCoachResponse({
            message: trimmedMessage,
            language,
            context: isNutritionContext ? 'nutrition' : 'general'
          });
        const isFallback = !result.ok;
        const answerText = isFallback ? `${t('ai.demoFallbackMessage')}\n\n${responseAnswer}` : responseAnswer;
        const nutritionMeta = isNutritionContext && result.nutritionPlan ? t('ai.nutritionPlanSaved') : undefined;

        if (isFallback) {
          const detail = result.error ?? result.message;
          console.error('AI chat request failed in UI', {
            context: isNutritionContext ? 'nutrition' : 'general',
            task: isNutritionContext ? 'nutrition_plan' : 'ai_chat',
            error: detail
          });
        }

        updateAssistantMessage(loadingMessageId, {
          text: answerText,
          status: isFallback ? 'error' : undefined,
          meta: nutritionMeta
        });
      } else {
        console.error('AI chat returned an unexpected client response', {
          context: isNutritionContext ? 'nutrition' : 'general',
          task: isNutritionContext ? 'nutrition_plan' : 'ai_chat',
          result
        });

        updateAssistantMessage(loadingMessageId, {
          text: `${t('ai.demoFallbackMessage')}\n\n${buildDemoAiCoachResponse({
            message: trimmedMessage,
            language,
            context: isNutritionContext ? 'nutrition' : 'general'
          })}`,
          status: 'error'
        });
      }
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      console.error('AI chat request threw in UI', {
        context: isNutritionContext ? 'nutrition' : 'general',
        task: isNutritionContext ? 'nutrition_plan' : 'ai_chat',
        error: detail
      });

      updateAssistantMessage(loadingMessageId, {
        text: t('ai.demoFallbackMessage'),
        status: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateAssistantMessage(messageId: string, patch: Partial<ChatMessage>) {
    setMessages((current) =>
      current.map((chatMessage) =>
        chatMessage.id === messageId
          ? {
              ...chatMessage,
              ...patch,
              status: patch.status
            }
          : chatMessage
      )
    );
  }

  async function pickPhoto() {
    setIsAttachmentMenuVisible(false);
    setComposerHint('');

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        setComposerHint('Разрешите доступ к фото, чтобы прикрепить изображение.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.9
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];

      if (!asset) {
        return;
      }

      setAttachments((current) => [
        ...current,
        {
          id: createId('attachment'),
          kind: 'image',
          uri: asset.uri,
          name: asset.fileName ?? `Фото ${current.length + 1}`,
          mimeType: asset.mimeType ?? undefined,
          size: asset.fileSize
        }
      ]);
    } catch (error) {
      console.error('Unable to pick AI chat photo attachment', error);
      setComposerHint('Не удалось выбрать фото.');
    }
  }

  async function pickFile() {
    setIsAttachmentMenuVisible(false);
    setComposerHint('');

    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: false,
        copyToCacheDirectory: true
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];

      if (!asset) {
        return;
      }

      setAttachments((current) => [
        ...current,
        {
          id: createId('attachment'),
          kind: 'file',
          uri: asset.uri,
          name: asset.name,
          mimeType: asset.mimeType ?? undefined,
          size: asset.size
        }
      ]);
    } catch (error) {
      console.error('Unable to pick AI chat file attachment', error);
      setComposerHint('Не удалось выбрать файл.');
    }
  }

  function removeAttachment(id: string) {
    setAttachments((current) => current.filter((attachment) => attachment.id !== id));
  }

  function toggleVoiceHint() {
    setComposerHint((current) => (current === voiceInputHint ? '' : voiceInputHint));
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screenRoot}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 76 : 0}
        style={styles.keyboardRoot}
      >
        <AIPlaque />

        <FlatList
          data={messages}
          keyExtractor={(chatMessage) => chatMessage.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          keyboardShouldPersistTaps="handled"
          style={styles.messagesList}
          contentContainerStyle={[
            styles.messagesContent,
            messages.length === 0 && styles.emptyMessagesContent
          ]}
          ListEmptyComponent={<EmptyChatState language={language} />}
        />

        <View style={styles.composerPanel}>
          {attachments.length > 0 ? (
            <View style={styles.selectedAttachments}>
              {attachments.map((attachment) => (
                <AttachmentChip
                  key={attachment.id}
                  attachment={attachment}
                  removable
                  onRemove={() => removeAttachment(attachment.id)}
                />
              ))}
            </View>
          ) : null}

          {composerHint ? <AppText style={styles.composerHint}>{composerHint}</AppText> : null}

          <View style={styles.composerInputRow}>
            <ComposerIconButton
              accessibilityLabel="Прикрепить файл"
              icon="add"
              onPress={() => setIsAttachmentMenuVisible(true)}
            />
            <View style={styles.composerInputWrap}>
              {!message ? (
                <View pointerEvents="none" style={styles.composerPlaceholderLayer}>
                  <AppText
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.72}
                    style={styles.composerPlaceholderText}
                  >
                    {t('ai.placeholder')}
                  </AppText>
                </View>
              ) : null}
              <TextInput
                value={message}
                onChangeText={setMessage}
                multiline
                style={styles.composerInput}
              />
            </View>
            <ComposerIconButton
              accessibilityLabel="Голосовой ввод"
              icon="mic-outline"
              onPress={toggleVoiceHint}
              active={composerHint === voiceInputHint}
            />
            <ComposerIconButton
              accessibilityLabel={t('ai.send')}
              icon="arrow-up"
              onPress={() => void submitMessage()}
              disabled={!canSend || isSubmitting}
              variant="send"
            />
          </View>
        </View>

        <AttachmentMenu
          visible={isAttachmentMenuVisible}
          onClose={() => setIsAttachmentMenuVisible(false)}
          onPickPhoto={() => void pickPhoto()}
          onPickFile={() => void pickFile()}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function AIPlaque() {
  return (
    <View style={styles.aiPlaqueFrame}>
      <Image
        source={aiAssistantHeader}
        resizeMode="cover"
        style={styles.aiPlaqueImage}
      />
      <View pointerEvents="none" style={styles.aiPlaqueLeftStripMask} />
      <View pointerEvents="none" style={styles.aiPlaqueTextBlock}>
        <AppText
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.84}
          style={styles.aiPlaqueTitle}
        >
          {aiHeaderTitle}
        </AppText>
        <AppText style={styles.aiPlaqueSubtitle}>
          {aiHeaderSubtitle}
        </AppText>
      </View>
    </View>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const isLoading = message.status === 'loading';

  return (
    <View style={[styles.messageRow, isUser ? styles.userMessageRow : styles.assistantMessageRow]}>
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.assistantBubble,
          message.status === 'error' && styles.errorBubble
        ]}
      >
        {isLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.accent} size="small" />
            <AppText style={styles.loadingText}>Пишу ответ...</AppText>
          </View>
        ) : null}

        {message.text ? (
          <AppText style={[styles.messageText, isUser && styles.userMessageText]}>
            {message.text}
          </AppText>
        ) : null}

        {message.attachments?.length ? (
          <View style={styles.messageAttachments}>
            {message.attachments.map((attachment) => (
              <AttachmentChip key={attachment.id} attachment={attachment} inUserBubble={isUser} />
            ))}
          </View>
        ) : null}

        {message.meta ? <AppText style={styles.messageMeta}>{message.meta}</AppText> : null}
      </View>
    </View>
  );
}

function AttachmentChip({
  attachment,
  removable,
  inUserBubble,
  onRemove
}: {
  attachment: ChatAttachment;
  removable?: boolean;
  inUserBubble?: boolean;
  onRemove?: () => void;
}) {
  return (
    <View style={[styles.attachmentChip, inUserBubble && styles.userAttachmentChip]}>
      <Ionicons
        name={attachment.kind === 'image' ? 'image-outline' : 'document-outline'}
        size={14}
        color={inUserBubble ? colors.textOnPrimary : colors.primary}
      />
      <View style={styles.attachmentTextBlock}>
        <AppText
          numberOfLines={1}
          style={[styles.attachmentName, inUserBubble && styles.userAttachmentText]}
        >
          {attachment.name}
        </AppText>
        {attachment.mimeType || attachment.size ? (
          <AppText
            numberOfLines={1}
            style={[styles.attachmentMeta, inUserBubble && styles.userAttachmentMeta]}
          >
            {[attachment.mimeType, formatAttachmentSize(attachment.size)].filter(Boolean).join(' · ')}
          </AppText>
        ) : null}
      </View>
      {removable ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Удалить вложение" onPress={onRemove} style={styles.removeAttachmentButton}>
          <Ionicons name="close" size={14} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

function ComposerIconButton({
  accessibilityLabel,
  icon,
  onPress,
  disabled,
  active,
  variant = 'plain'
}: {
  accessibilityLabel: string;
  icon: ComposerIconName;
  onPress?: () => void;
  disabled?: boolean;
  active?: boolean;
  variant?: 'plain' | 'send';
}) {
  const isSend = variant === 'send';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.composerIconButton,
        isSend && styles.sendButton,
        active && styles.composerIconButtonActive,
        disabled && styles.composerIconButtonDisabled,
        pressed && !disabled && styles.pressed
      ]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={isSend && !disabled ? colors.textOnPrimary : colors.primary}
      />
    </Pressable>
  );
}

function AttachmentMenu({
  visible,
  onClose,
  onPickPhoto,
  onPickFile
}: {
  visible: boolean;
  onClose: () => void;
  onPickPhoto: () => void;
  onPickFile: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.attachmentMenu}>
          <AttachmentMenuItem label="Фото" icon="image-outline" onPress={onPickPhoto} />
          <AttachmentMenuItem label="Файл" icon="document-outline" onPress={onPickFile} />
          <AttachmentMenuItem label="Отмена" icon="close-circle-outline" onPress={onClose} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function AttachmentMenuItem({
  label,
  icon,
  onPress
}: {
  label: string;
  icon: ComposerIconName;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.attachmentMenuItem, pressed && styles.pressed]}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <AppText style={styles.attachmentMenuLabel}>{label}</AppText>
    </Pressable>
  );
}

function EmptyChatState({ language }: { language: Language }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="chatbubble-ellipses-outline" size={26} color={colors.accent} />
      </View>
      <AppText style={styles.emptyTitle}>
        {language === 'ru' ? 'Чем помочь сегодня?' : 'How can I help today?'}
      </AppText>
      <AppText style={styles.emptyCopy}>
        {language === 'ru'
          ? 'Спросите про анализы, питание, добавки или восстановление.'
          : 'Ask about labs, nutrition, supplements, or recovery.'}
      </AppText>
    </View>
  );
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatAttachmentSize(size?: number) {
  if (!size) {
    return '';
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: colors.background
  },
  keyboardRoot: {
    flex: 1
  },
  aiPlaqueFrame: {
    width: '100%',
    height: 112,
    minHeight: 108,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.accent,
    overflow: 'hidden'
  },
  aiPlaqueImage: {
    width: '100%',
    height: '100%'
  },
  aiPlaqueLeftStripMask: {
    position: 'absolute',
    left: 1,
    top: 1,
    bottom: 1,
    width: '0.8%',
    backgroundColor: AI_HEADER_PLAQUE_SURFACE
  },
  aiPlaqueTextBlock: {
    position: 'absolute',
    left: 22,
    top: 15,
    width: '60%',
    maxWidth: 330
  },
  aiPlaqueTitle: {
    color: colors.primary,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900'
  },
  aiPlaqueSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '500',
    marginTop: 5
  },
  messagesList: {
    flex: 1
  },
  messagesContent: {
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16
  },
  emptyMessagesContent: {
    justifyContent: 'center'
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 28
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  emptyTitle: {
    color: colors.primary,
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '900',
    textAlign: 'center'
  },
  emptyCopy: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 6
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12
  },
  userMessageRow: {
    justifyContent: 'flex-end'
  },
  assistantMessageRow: {
    justifyContent: 'flex-start'
  },
  messageBubble: {
    maxWidth: '84%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 11
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 5
  },
  assistantBubble: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderBottomLeftRadius: 5
  },
  errorBubble: {
    borderColor: colors.accent
  },
  messageText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 21
  },
  userMessageText: {
    color: colors.textOnPrimary
  },
  messageMeta: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 10
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 18
  },
  messageAttachments: {
    gap: 7,
    marginTop: 8
  },
  composerPanel: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6
  },
  selectedAttachments: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8
  },
  composerHint: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
    paddingHorizontal: 4
  },
  composerInputRow: {
    minHeight: 52,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 7,
    paddingHorizontal: 8,
    paddingVertical: 7
  },
  composerInputWrap: {
    flex: 1,
    maxHeight: 120,
    minHeight: 36,
    justifyContent: 'center'
  },
  composerPlaceholderLayer: {
    position: 'absolute',
    left: 4,
    right: 4,
    top: 0,
    bottom: 0,
    justifyContent: 'center'
  },
  composerPlaceholderText: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 18
  },
  composerInput: {
    flex: 1,
    maxHeight: 120,
    minHeight: 36,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 8,
    textAlignVertical: 'top'
  },
  composerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center'
  },
  composerIconButtonActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft
  },
  composerIconButtonDisabled: {
    opacity: 0.42
  },
  sendButton: {
    borderColor: colors.primary,
    backgroundColor: colors.primary
  },
  pressed: {
    opacity: 0.72
  },
  attachmentChip: {
    minHeight: 34,
    maxWidth: '100%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingLeft: 10,
    paddingRight: 8,
    paddingVertical: 7
  },
  userAttachmentChip: {
    borderColor: colors.textOnPrimaryMuted,
    backgroundColor: 'rgba(255, 247, 234, 0.12)'
  },
  attachmentTextBlock: {
    minWidth: 0,
    maxWidth: 210
  },
  attachmentName: {
    color: colors.primary,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '800'
  },
  attachmentMeta: {
    color: colors.textMuted,
    fontSize: 10,
    lineHeight: 13,
    marginTop: 1
  },
  userAttachmentText: {
    color: colors.textOnPrimary
  },
  userAttachmentMeta: {
    color: colors.textOnPrimaryMuted
  },
  removeAttachmentButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(7, 26, 20, 0.35)',
    justifyContent: 'flex-end',
    padding: 16
  },
  attachmentMenu: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    paddingVertical: 6,
    overflow: 'hidden'
  },
  attachmentMenuItem: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18
  },
  attachmentMenuLabel: {
    color: colors.primary,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '800'
  }
});
