import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { SubscriptionStatus } from '@/types/subscription';

const premiumProduct = 'healthcoach_premium';
const missingSessionReason = 'missing_session';
const statusUnavailableReason = 'subscription_status_unavailable';
const invalidResponseReason = 'invalid_subscription_status_response';

export async function getSubscriptionStatus(session?: Session | null): Promise<SubscriptionStatus> {
  if (!session?.access_token) {
    return inactiveStatus(missingSessionReason);
  }

  if (!isSupabaseConfigured || !supabase) {
    return inactiveStatus(statusUnavailableReason);
  }

  try {
    const { data, error } = await supabase.functions.invoke<unknown>('get-subscription-status', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (error) {
      return inactiveStatus(statusUnavailableReason);
    }

    return normalizeSubscriptionStatus(data);
  } catch {
    return inactiveStatus(statusUnavailableReason);
  }
}

export function isSubscriptionStatusCheckFailure(status: SubscriptionStatus) {
  return status.reason === statusUnavailableReason || status.reason === invalidResponseReason;
}

function normalizeSubscriptionStatus(value: unknown): SubscriptionStatus {
  if (!isRecord(value) || value.product !== premiumProduct || typeof value.active !== 'boolean') {
    return inactiveStatus(invalidResponseReason);
  }

  const activeUntil = typeof value.activeUntil === 'string' ? value.activeUntil : null;

  return {
    active: value.active === true && activeUntil !== null,
    product: premiumProduct,
    activeUntil,
    source: typeof value.source === 'string' ? value.source : null,
    reason: typeof value.reason === 'string' ? value.reason : null
  };
}

function inactiveStatus(reason: string): SubscriptionStatus {
  return {
    active: false,
    product: premiumProduct,
    activeUntil: null,
    source: null,
    reason
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
