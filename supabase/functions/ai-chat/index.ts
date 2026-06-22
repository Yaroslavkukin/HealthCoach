type ChatRole = 'system' | 'user' | 'assistant';
type Locale = 'ru' | 'en';
type AiChatTask = 'ai_chat' | 'nutrition_plan';

type AiChatMessage = {
  role: ChatRole;
  content: string;
};

type AiChatRequest = {
  messages?: unknown;
  message?: unknown;
  locale?: unknown;
  language?: unknown;
  profileContext?: unknown;
  demoMode?: unknown;
  context?: unknown;
  task?: unknown;
};

type AiChatSuccessResponse = {
  ok: true;
  mode: 'provider';
  message: string;
  answer: string;
  model: string;
};

type AiChatFallbackCode =
  | 'AUTH_REQUIRED'
  | 'RATE_LIMITED'
  | 'REQUEST_TOO_LARGE'
  | 'SERVER_CONFIG_ERROR'
  | 'PROVIDER_NOT_CONFIGURED'
  | 'INVALID_REQUEST'
  | 'PROVIDER_REQUEST_FAILED'
  | 'PROVIDER_TIMEOUT'
  | 'PROVIDER_BAD_RESPONSE';

type AiChatFallbackResponse = {
  ok: false;
  code: AiChatFallbackCode;
  message: string;
  fallbackMode: 'demo';
};

type NormalizedChatRequest = {
  messages: AiChatMessage[];
  locale: Locale;
  task: AiChatTask;
  profileContext?: unknown;
};

type ProviderConfig = {
  apiKey: string;
  endpoint: string;
  model: string;
};

type SupabaseAdminConfig = {
  url: string;
  serviceRoleKey: string;
};

type AuthResult =
  | { ok: true; user: { id: string } }
  | { ok: false; code: 'AUTH_REQUIRED' | 'SERVER_CONFIG_ERROR'; message: string; status: number };

type RateLimitResult =
  | { ok: true }
  | { ok: false; code: 'RATE_LIMITED' | 'SERVER_CONFIG_ERROR'; message: string; status: number };

type RateLimitDecision = {
  allowed: boolean;
  reason: string | null;
  hourlyCount: number;
  dailyCount: number;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const maxRequestBodyBytes = 64_000;
const maxMessageLength = 2000;
const maxMessageHistory = 12;
const providerTimeoutMs = 15000;
const defaultAiChatHourlyLimit = 20;
const defaultAiChatDailyLimit = 80;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return json({ ok: true });
  }

  if (req.method !== 'POST') {
    return json(buildFallback('INVALID_REQUEST', 'Method not allowed'), 405);
  }

  if (isRequestBodyTooLarge(req)) {
    return json(buildFallback('REQUEST_TOO_LARGE', 'Request body is too large'), 413);
  }

  const authResult = await authenticateUser(req);

  if (!authResult.ok) {
    return json(buildFallback(authResult.code, authResult.message), authResult.status);
  }

  const requestResult = normalizeChatRequest(await readJson(req));

  if (!requestResult.ok) {
    return json(requestResult.response, 400);
  }

  const config = readProviderConfig();

  if (!config) {
    return json(buildFallback('PROVIDER_NOT_CONFIGURED', 'AI provider is not configured'), 503);
  }

  const quotaResult = await checkAndConsumeQuota(authResult.user.id);

  if (!quotaResult.ok) {
    return json(buildFallback(quotaResult.code, quotaResult.message), quotaResult.status);
  }

  const messages = [
    {
      role: 'system' as const,
      content: buildSystemPrompt(requestResult.request.locale, requestResult.request.profileContext)
    },
    ...requestResult.request.messages
  ];

  return callProvider(config, messages);
});

async function callProvider(config: ProviderConfig, messages: AiChatMessage[]) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), providerTimeoutMs);

  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: 0.4,
        max_tokens: 700
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      console.error('AI provider request failed', {
        code: 'PROVIDER_REQUEST_FAILED',
        status: response.status
      });

      return json(buildFallback('PROVIDER_REQUEST_FAILED', 'AI provider request failed'), 502);
    }

    const payload = await readResponseJson(response);
    const assistantText = extractAssistantText(payload);

    if (!assistantText) {
      console.error('AI provider returned a bad response', {
        code: 'PROVIDER_BAD_RESPONSE'
      });

      return json(buildFallback('PROVIDER_BAD_RESPONSE', 'AI provider returned an invalid response'), 502);
    }

    const result: AiChatSuccessResponse = {
      ok: true,
      mode: 'provider',
      message: assistantText,
      answer: assistantText,
      model: config.model
    };

    return json(result);
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError';
    const code: AiChatFallbackCode = timedOut ? 'PROVIDER_TIMEOUT' : 'PROVIDER_REQUEST_FAILED';

    console.error('AI provider request did not complete', { code });

    return json(
      buildFallback(code, timedOut ? 'AI provider request timed out' : 'AI provider request failed'),
      timedOut ? 504 : 502
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

async function authenticateUser(req: Request): Promise<AuthResult> {
  const authorization = req.headers.get('authorization')?.trim() ?? '';

  if (!authorization.toLowerCase().startsWith('bearer ')) {
    return {
      ok: false,
      code: 'AUTH_REQUIRED',
      message: 'Sign in to use Health Coach AI.',
      status: 401
    };
  }

  const supabaseUrl = readSupabaseUrl();
  const anonKey = readLegacyOrNamedKey('SUPABASE_ANON_KEY', 'SUPABASE_PUBLISHABLE_KEYS');

  if (!supabaseUrl || !anonKey) {
    console.error('AI chat auth configuration is missing');

    return {
      ok: false,
      code: 'SERVER_CONFIG_ERROR',
      message: 'AI chat authentication is not configured.',
      status: 500
    };
  }

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: authorization,
        apikey: anonKey
      }
    });

    if (!response.ok) {
      return {
        ok: false,
        code: 'AUTH_REQUIRED',
        message: 'Sign in to use Health Coach AI.',
        status: 401
      };
    }

    const payload = await readResponseJson(response);
    const userId = isRecord(payload) && typeof payload.id === 'string' ? payload.id : '';

    if (!userId) {
      return {
        ok: false,
        code: 'AUTH_REQUIRED',
        message: 'Sign in to use Health Coach AI.',
        status: 401
      };
    }

    return {
      ok: true,
      user: { id: userId }
    };
  } catch {
    return {
      ok: false,
      code: 'SERVER_CONFIG_ERROR',
      message: 'AI chat authentication check failed.',
      status: 500
    };
  }
}

async function checkAndConsumeQuota(userId: string): Promise<RateLimitResult> {
  const adminConfig = readSupabaseAdminConfig();

  if (!adminConfig) {
    console.error('AI chat rate limit configuration is missing');

    return {
      ok: false,
      code: 'SERVER_CONFIG_ERROR',
      message: 'AI chat rate limit is not configured.',
      status: 500
    };
  }

  const now = new Date();
  const hourlyLimit = readPositiveIntegerEnv('AI_CHAT_HOURLY_LIMIT', defaultAiChatHourlyLimit);
  const dailyLimit = readPositiveIntegerEnv('AI_CHAT_DAILY_LIMIT', defaultAiChatDailyLimit);

  try {
    const response = await fetch(`${adminConfig.url}/rest/v1/rpc/consume_ai_chat_quota`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminConfig.serviceRoleKey}`,
        apikey: adminConfig.serviceRoleKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        p_user_id: userId,
        p_hour_start: startOfHour(now).toISOString(),
        p_day_start: startOfUtcDay(now).toISOString(),
        p_hourly_limit: hourlyLimit,
        p_daily_limit: dailyLimit
      })
    });

    if (!response.ok) {
      const detail = await readResponseText(response);
      console.error('AI chat rate limit RPC failed', {
        status: response.status,
        detail
      });

      return {
        ok: false,
        code: 'SERVER_CONFIG_ERROR',
        message: 'AI chat rate limit check failed.',
        status: 500
      };
    }

    const decision = readRateLimitDecision(await readResponseJson(response));

    if (!decision) {
      console.error('AI chat rate limit RPC returned an invalid response');

      return {
        ok: false,
        code: 'SERVER_CONFIG_ERROR',
        message: 'AI chat rate limit check failed.',
        status: 500
      };
    }

    if (!decision.allowed) {
      console.warn('AI chat usage limit reached', {
        userId,
        reason: decision.reason,
        hourlyCount: decision.hourlyCount,
        dailyCount: decision.dailyCount
      });

      return {
        ok: false,
        code: 'RATE_LIMITED',
        message: decision.reason === 'day'
          ? 'Daily AI chat limit reached. Try again tomorrow.'
          : 'Hourly AI chat limit reached. Try again later.',
        status: 429
      };
    }

    return { ok: true };
  } catch (error) {
    console.error('AI chat rate limit check threw', {
      error: error instanceof Error ? error.message : String(error)
    });

    return {
      ok: false,
      code: 'SERVER_CONFIG_ERROR',
      message: 'AI chat rate limit check failed.',
      status: 500
    };
  }
}

function normalizeChatRequest(value: unknown):
  | { ok: true; request: NormalizedChatRequest }
  | { ok: false; response: AiChatFallbackResponse } {
  if (!isRecord(value)) {
    return invalidRequest();
  }

  const request = value as AiChatRequest;
  const locale = readLocale(request.locale, request.language);
  const task = readTask(request.task);
  const messages = normalizeMessages(request);

  if (messages.length === 0) {
    return invalidRequest();
  }

  return {
    ok: true,
    request: {
      messages: messages.slice(-maxMessageHistory),
      locale,
      task,
      profileContext: request.profileContext
    }
  };
}

function normalizeMessages(request: AiChatRequest) {
  if (typeof request.message === 'string') {
    const content = normalizeMessageContent(request.message);
    return content ? [{ role: 'user' as const, content }] : [];
  }

  if (!Array.isArray(request.messages)) {
    return [];
  }

  const normalizedMessages: AiChatMessage[] = [];

  for (const item of request.messages) {
    if (!isRecord(item) || item.role !== 'user' || typeof item.content !== 'string') {
      return [];
    }

    const content = normalizeMessageContent(item.content);

    if (content) {
      normalizedMessages.push({ role: 'user', content });
    }
  }

  return normalizedMessages;
}

function normalizeMessageContent(value: string) {
  return value.trim().slice(0, maxMessageLength);
}

function readProviderConfig(): ProviderConfig | null {
  const apiKey = Deno.env.get('DEEPSEEK_API_KEY')?.trim();
  const baseUrl = Deno.env.get('DEEPSEEK_BASE_URL')?.trim();
  const model = Deno.env.get('DEEPSEEK_MODEL')?.trim() || 'deepseek-v4-pro';

  if (!apiKey || !baseUrl) {
    return null;
  }

  return {
    apiKey,
    endpoint: buildProviderEndpoint(baseUrl),
    model
  };
}

function buildProviderEndpoint(baseUrl: string) {
  const trimmedBaseUrl = baseUrl.trim().replace(/\/+$/, '');

  try {
    const url = new URL(trimmedBaseUrl);
    const pathWithoutTrailingSlash = url.pathname.replace(/\/+$/, '');

    if (!pathWithoutTrailingSlash.endsWith('/chat/completions')) {
      url.pathname = `${pathWithoutTrailingSlash}/chat/completions`.replace(/\/{2,}/g, '/');
    }

    return url.toString();
  } catch {
    return trimmedBaseUrl.endsWith('/chat/completions')
      ? trimmedBaseUrl
      : `${trimmedBaseUrl}/chat/completions`;
  }
}

function buildSystemPrompt(locale: Locale, profileContext: unknown) {
  const languageInstruction =
    locale === 'ru'
      ? 'Отвечай на русском языке.'
      : 'Answer in English.';
  const profileSummary = summarizeProfileContext(profileContext);

  return [
    'You are an informational wellness coach inside Health Coach.',
    'Use provided profile context to explain energy, recovery, sleep, nutrition, body systems, supplements, analyses, and weekly actions.',
    'Do not diagnose, treat, claim to cure, or make definitive medical claims.',
    'Use cautious language and focus on lifestyle-support actions: sleep, recovery, nutrition, movement, supplements, and habits.',
    'For strong symptoms or concerning lab values, recommend consulting a qualified specialist.',
    languageInstruction,
    profileSummary ? `Profile context:\n${profileSummary}` : ''
  ].filter(Boolean).join('\n');
}

function summarizeProfileContext(value: unknown) {
  if (!isRecord(value)) {
    return '';
  }

  const lines = [
    formatStringField(value, 'User', ['userName', 'name', 'firstName']),
    formatNumberField(value, 'Overall score', ['overallScore', 'healthScore']),
    formatNumberField(value, 'Energy score', ['energyScore']),
    formatNumberField(value, 'Recovery score', ['recoveryScore']),
    formatNumberField(value, 'Sleep score', ['sleepScore']),
    formatNumberField(value, 'Nutrition score', ['nutritionScore']),
    formatArrayField(value, 'Main limiters', ['mainLimiters', 'limitingFactors']),
    formatStringField(value, 'Recommended focus', ['recommendedFocus', 'recommendedAction', 'planFocus'])
  ].filter((line): line is string => Boolean(line));

  return lines.join('\n');
}

function formatStringField(record: Record<string, unknown>, label: string, keys: string[]) {
  const value = keys.map((key) => record[key]).find((item): item is string => typeof item === 'string' && item.trim().length > 0);

  return value ? `${label}: ${cleanPromptText(value, 280)}` : '';
}

function formatNumberField(record: Record<string, unknown>, label: string, keys: string[]) {
  const value = keys.map((key) => record[key]).find((item): item is number => typeof item === 'number' && Number.isFinite(item));

  return typeof value === 'number' ? `${label}: ${value}` : '';
}

function formatArrayField(record: Record<string, unknown>, label: string, keys: string[]) {
  const value = keys
    .map((key) => record[key])
    .find((item): item is string[] => Array.isArray(item) && item.every((entry) => typeof entry === 'string'));

  return value ? `${label}: ${value.slice(0, 5).map((entry) => cleanPromptText(entry, 180)).join('; ')}` : '';
}

function cleanPromptText(value: string, maxLength: number) {
  return value
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, maxLength);
}

async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

async function readResponseJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

async function readResponseText(response: Response) {
  try {
    return await response.text();
  } catch {
    return '';
  }
}

function extractAssistantText(value: unknown) {
  if (!isRecord(value) || !Array.isArray(value.choices)) {
    return '';
  }

  for (const choice of value.choices) {
    if (!isRecord(choice) || !isRecord(choice.message)) {
      continue;
    }

    const content = choice.message.content;

    if (typeof content === 'string' && content.trim().length > 0) {
      return content.trim();
    }
  }

  return '';
}

function readLocale(locale: unknown, fallbackLocale: unknown): Locale {
  if (locale === 'ru' || fallbackLocale === 'ru') {
    return 'ru';
  }

  return 'en';
}

function readTask(task: unknown): AiChatTask {
  return task === 'nutrition_plan' ? 'nutrition_plan' : 'ai_chat';
}

function invalidRequest() {
  return {
    ok: false as const,
    response: buildFallback('INVALID_REQUEST', 'Invalid chat request')
  };
}

function buildFallback(code: AiChatFallbackCode, message: string): AiChatFallbackResponse {
  return {
    ok: false,
    code,
    message,
    fallbackMode: 'demo'
  };
}

function readSupabaseUrl() {
  return Deno.env.get('SUPABASE_URL')?.trim().replace(/\/+$/, '') ?? '';
}

function readSupabaseAdminConfig(): SupabaseAdminConfig | null {
  const url = readSupabaseUrl();
  const serviceRoleKey = readLegacyOrNamedKey('SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SECRET_KEYS');

  if (!url || !serviceRoleKey) {
    return null;
  }

  return {
    url,
    serviceRoleKey
  };
}

function readLegacyOrNamedKey(legacyName: string, namedKeysName: string) {
  const legacyValue = Deno.env.get(legacyName)?.trim();

  if (legacyValue) {
    return legacyValue;
  }

  const namedKeysValue = Deno.env.get(namedKeysName)?.trim();

  if (!namedKeysValue) {
    return '';
  }

  try {
    const parsed = JSON.parse(namedKeysValue);

    if (!isRecord(parsed)) {
      return '';
    }

    const defaultKey = parsed.default;

    if (typeof defaultKey === 'string' && defaultKey.trim()) {
      return defaultKey.trim();
    }

    const firstKey = Object.values(parsed).find((value): value is string => typeof value === 'string' && value.trim().length > 0);

    return firstKey?.trim() ?? '';
  } catch {
    return '';
  }
}

function readPositiveIntegerEnv(name: string, fallback: number) {
  const value = Number(Deno.env.get(name));

  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function readRateLimitDecision(value: unknown): RateLimitDecision | null {
  const row = Array.isArray(value) ? value[0] : value;

  if (!isRecord(row)) {
    return null;
  }

  return {
    allowed: row.allowed === true,
    reason: typeof row.reason === 'string' ? row.reason : null,
    hourlyCount: typeof row.hourly_count === 'number' ? row.hourly_count : 0,
    dailyCount: typeof row.daily_count === 'number' ? row.daily_count : 0
  };
}

function startOfHour(value: Date) {
  return new Date(Date.UTC(
    value.getUTCFullYear(),
    value.getUTCMonth(),
    value.getUTCDate(),
    value.getUTCHours(),
    0,
    0,
    0
  ));
}

function startOfUtcDay(value: Date) {
  return new Date(Date.UTC(
    value.getUTCFullYear(),
    value.getUTCMonth(),
    value.getUTCDate(),
    0,
    0,
    0,
    0
  ));
}

function isRequestBodyTooLarge(req: Request) {
  const contentLength = Number(req.headers.get('content-length'));

  return Number.isFinite(contentLength) && contentLength > maxRequestBodyBytes;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
