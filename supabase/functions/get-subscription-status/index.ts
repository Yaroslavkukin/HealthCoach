// eslint-disable-next-line import/no-unresolved
import { createClient } from 'npm:@supabase/supabase-js@2.108.1';

type EntitlementRow = {
  product: string | null;
  active: boolean | null;
  active_until: string | null;
  source: string | null;
  reason: string | null;
};

const premiumProduct = 'healthcoach_premium';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  Vary: 'Origin'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return json({ ok: true });
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405);
  }

  const authorization = req.headers.get('authorization')?.trim() ?? '';

  if (!authorization.toLowerCase().startsWith('bearer ')) {
    return json({ error: 'Authentication required.' }, 401);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')?.trim();
  const supabaseAnonKey = readLegacyOrNamedKey(
    'SUPABASE_ANON_KEY',
    'SUPABASE_PUBLISHABLE_KEY',
    'SUPABASE_PUBLISHABLE_KEYS'
  );

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Subscription status configuration is missing.');

    return json({ error: 'Subscription status is not configured.' }, 500);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authorization
      }
    }
  });

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return json({ error: 'Authentication required.' }, 401);
  }

  const { data, error } = await supabase
    .from('entitlements')
    .select('product,active,active_until,source,reason')
    .eq('user_id', user.id)
    .eq('product', premiumProduct)
    .maybeSingle<EntitlementRow>();

  if (error) {
    console.error('Unable to read subscription entitlement.', {
      userId: user.id,
      message: error.message
    });

    return json({ error: 'Unable to read subscription status.' }, 500);
  }

  if (!data) {
    return json(buildStatusResponse(null));
  }

  return json(buildStatusResponse(data));
});

function buildStatusResponse(entitlement: EntitlementRow | null) {
  const activeUntil = entitlement?.active_until ?? null;
  const activeUntilTime = activeUntil ? Date.parse(activeUntil) : NaN;
  const active =
    entitlement?.active === true &&
    activeUntil !== null &&
    Number.isFinite(activeUntilTime) &&
    activeUntilTime > Date.now();

  return {
    active,
    product: premiumProduct,
    activeUntil,
    source: entitlement?.source ?? null,
    reason: entitlement?.reason ?? null
  };
}

function readLegacyOrNamedKey(legacyName: string, ...namedKeysNames: string[]) {
  const legacyValue = Deno.env.get(legacyName)?.trim();

  if (legacyValue) {
    return legacyValue;
  }

  for (const namedKeysName of namedKeysNames) {
    const namedKeysValue = Deno.env.get(namedKeysName)?.trim();

    if (!namedKeysValue) {
      continue;
    }

    if (!namedKeysValue.startsWith('{')) {
      return namedKeysValue;
    }

    try {
      const parsed = JSON.parse(namedKeysValue);

      if (!isRecord(parsed)) {
        continue;
      }

      const defaultKey = parsed.default;

      if (typeof defaultKey === 'string' && defaultKey.trim()) {
        return defaultKey.trim();
      }

      const firstKey = Object.values(parsed).find(
        (value): value is string => typeof value === 'string' && value.trim().length > 0
      );

      if (firstKey?.trim()) {
        return firstKey.trim();
      }
    } catch {
      continue;
    }
  }

  return '';
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
