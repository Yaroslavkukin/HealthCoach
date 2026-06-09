import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { DailyTask } from '@/types';

export type PersistenceMode = 'mock' | 'supabase';

export type PersistenceResult<T = undefined> =
  | {
      ok: true;
      mode: PersistenceMode;
      message: string;
      data?: T;
    }
  | {
      ok: false;
      mode: PersistenceMode;
      message: string;
      error: string;
    };

export type AuthPlaceholderContext = {
  mode: PersistenceMode;
  userId: string;
  email: string | null;
  reason?: string;
};

export type ProfileDraft = {
  email?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'not_specified';
  heightCm?: number;
  weightKg?: number;
  country?: string;
  city?: string;
};

export type DeliveryDraft = {
  country?: string;
  city?: string;
  addressLine1?: string;
  postalCode?: string;
  preferredDeliveryProvider?: string;
  cdekPickupPointAddress?: string;
  russianPostOfficeAddress?: string;
  deliveryNotes?: string;
};

export type BloodUploadMetadata = {
  fileName: string;
  packageCode: 'male_foundation' | 'male_advanced' | 'male_complete' | 'female_foundation' | 'female_complete' | 'custom';
  fileUrl?: string;
  status?: 'uploaded' | 'processing' | 'extracted' | 'failed' | 'needs_review';
};

export type OnboardingChecklistDraft = {
  bloodAnalysisCompleted?: boolean;
  bravermanCompleted?: boolean;
  lifestyleCompleted?: boolean;
  nutritionCompleted?: boolean;
  aiProfileGenerated?: boolean;
};

type OnboardingChecklistRow = {
  id: string;
  blood_analysis_completed: boolean | null;
  braverman_completed: boolean | null;
  lifestyle_completed: boolean | null;
  nutrition_completed: boolean | null;
  ai_profile_generated: boolean | null;
};

const mockUserId = '00000000-0000-4000-8000-000000000003';
const mockEmail = 'demo@healthcoach.local';

export async function getAuthPlaceholderContext(): Promise<AuthPlaceholderContext> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      mode: 'mock',
      userId: mockUserId,
      email: mockEmail,
      reason: 'Supabase public environment variables are not configured.'
    };
  }

  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session?.user) {
    return {
      mode: 'mock',
      userId: mockUserId,
      email: mockEmail,
      reason: error?.message ?? 'No Supabase auth session is active.'
    };
  }

  return {
    mode: 'supabase',
    userId: data.session.user.id,
    email: data.session.user.email ?? null
  };
}

export async function registerPlaceholderAccount(email?: string): Promise<PersistenceResult<AuthPlaceholderContext>> {
  const context = await getAuthPlaceholderContext();

  return {
    ok: true,
    mode: context.mode,
    message:
      context.mode === 'supabase'
        ? 'Existing Supabase session detected. Continuing with authenticated user.'
        : `Using mock auth placeholder${email ? ` for ${email}` : ''}.`,
    data: { ...context, email: context.mode === 'mock' ? (email ?? context.email) : context.email }
  };
}

export async function fetchProfile(): Promise<PersistenceResult<Record<string, unknown> | null>> {
  const context = await getAuthPlaceholderContext();

  if (context.mode === 'mock' || !supabase) {
    return { ok: true, mode: 'mock', message: 'Profile read skipped; using mock profile data.', data: null };
  }

  const { data, error } = await supabase.from('profiles').select('*').eq('id', context.userId).maybeSingle();

  if (error) {
    return { ok: false, mode: 'supabase', message: 'Unable to read Supabase profile.', error: error.message };
  }

  return { ok: true, mode: 'supabase', message: 'Profile loaded from Supabase.', data };
}

export async function upsertProfileDraft(profile: ProfileDraft): Promise<PersistenceResult<Record<string, unknown>>> {
  const context = await getAuthPlaceholderContext();

  if (context.mode === 'mock' || !supabase) {
    return { ok: true, mode: 'mock', message: 'Profile saved to mock fallback.', data: { ...profile, id: context.userId } };
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: context.userId,
      email: profile.email ?? context.email,
      first_name: profile.firstName,
      last_name: profile.lastName,
      age: profile.age,
      gender: profile.gender ?? 'not_specified',
      height_cm: profile.heightCm,
      weight_kg: profile.weightKg,
      country: profile.country,
      city: profile.city,
      profile_completed: true,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    return { ok: false, mode: 'supabase', message: 'Unable to save Supabase profile.', error: error.message };
  }

  return { ok: true, mode: 'supabase', message: 'Profile saved to Supabase.', data };
}

export async function deleteProfileDraft(): Promise<PersistenceResult> {
  const context = await getAuthPlaceholderContext();

  if (context.mode === 'mock' || !supabase) {
    return { ok: true, mode: 'mock', message: 'Mock profile delete acknowledged.' };
  }

  const { error } = await supabase.from('profiles').delete().eq('id', context.userId);

  if (error) {
    return { ok: false, mode: 'supabase', message: 'Unable to delete Supabase profile.', error: error.message };
  }

  return { ok: true, mode: 'supabase', message: 'Profile deleted from Supabase.' };
}

export async function upsertDeliveryDraft(delivery: DeliveryDraft): Promise<PersistenceResult<Record<string, unknown>>> {
  const context = await getAuthPlaceholderContext();

  if (context.mode === 'mock' || !supabase) {
    return { ok: true, mode: 'mock', message: 'Delivery information saved to mock fallback.', data: { ...delivery, user_id: context.userId } };
  }

  const payload = {
    user_id: context.userId,
    country: delivery.country,
    city: delivery.city,
    address_line_1: delivery.addressLine1,
    postal_code: delivery.postalCode,
    preferred_delivery_provider: delivery.preferredDeliveryProvider,
    cdek_pickup_point_address: delivery.cdekPickupPointAddress,
    russian_post_office_address: delivery.russianPostOfficeAddress,
    delivery_notes: delivery.deliveryNotes,
    is_default: true,
    updated_at: new Date().toISOString()
  };

  const { data: existing, error: selectError } = await supabase
    .from('user_delivery_profiles')
    .select('id')
    .eq('user_id', context.userId)
    .eq('is_default', true)
    .maybeSingle();

  if (selectError) {
    return { ok: false, mode: 'supabase', message: 'Unable to read delivery profile.', error: selectError.message };
  }

  const query = existing?.id
    ? supabase.from('user_delivery_profiles').update(payload).eq('id', existing.id).select().single()
    : supabase.from('user_delivery_profiles').insert(payload).select().single();

  const { data, error } = await query;

  if (error) {
    return { ok: false, mode: 'supabase', message: 'Unable to save delivery profile.', error: error.message };
  }

  return { ok: true, mode: 'supabase', message: 'Delivery profile saved to Supabase.', data };
}

export async function saveBloodUploadMetadata(metadata: BloodUploadMetadata): Promise<PersistenceResult<Record<string, unknown>>> {
  const context = await getAuthPlaceholderContext();

  if (context.mode === 'mock' || !supabase) {
    return { ok: true, mode: 'mock', message: 'Blood upload metadata saved to mock fallback.', data: { ...metadata, user_id: context.userId } };
  }

  const { data, error } = await supabase
    .from('blood_test_uploads')
    .insert({
      user_id: context.userId,
      package_code: metadata.packageCode,
      file_name: metadata.fileName,
      file_url: metadata.fileUrl,
      status: metadata.status ?? 'uploaded'
    })
    .select()
    .single();

  if (error) {
    return { ok: false, mode: 'supabase', message: 'Unable to save blood upload metadata.', error: error.message };
  }

  return { ok: true, mode: 'supabase', message: 'Blood upload metadata saved to Supabase.', data };
}

export async function saveOnboardingChecklist(checklist: OnboardingChecklistDraft): Promise<PersistenceResult<Record<string, unknown>>> {
  const context = await getAuthPlaceholderContext();

  if (context.mode === 'mock' || !supabase) {
    return { ok: true, mode: 'mock', message: 'Onboarding checklist saved to mock fallback.', data: { ...checklist, user_id: context.userId } };
  }

  const { data: existing, error: selectError } = await supabase
    .from('onboarding_checklist')
    .select('id,blood_analysis_completed,braverman_completed,lifestyle_completed,nutrition_completed,ai_profile_generated')
    .eq('user_id', context.userId)
    .maybeSingle<OnboardingChecklistRow>();

  if (selectError) {
    return { ok: false, mode: 'supabase', message: 'Unable to read onboarding checklist.', error: selectError.message };
  }

  const payload = {
    user_id: context.userId,
    blood_analysis_completed: checklist.bloodAnalysisCompleted ?? existing?.blood_analysis_completed ?? false,
    braverman_completed: checklist.bravermanCompleted ?? existing?.braverman_completed ?? false,
    lifestyle_completed: checklist.lifestyleCompleted ?? existing?.lifestyle_completed ?? false,
    nutrition_completed: checklist.nutritionCompleted ?? existing?.nutrition_completed ?? false,
    ai_profile_generated: checklist.aiProfileGenerated ?? existing?.ai_profile_generated ?? false,
    updated_at: new Date().toISOString()
  };

  const query = existing?.id
    ? supabase.from('onboarding_checklist').update(payload).eq('id', existing.id).select().single()
    : supabase.from('onboarding_checklist').insert(payload).select().single();

  const { data, error } = await query;

  if (error) {
    return { ok: false, mode: 'supabase', message: 'Unable to save onboarding checklist.', error: error.message };
  }

  return { ok: true, mode: 'supabase', message: 'Onboarding checklist saved to Supabase.', data };
}

export async function saveDailyTaskStatus(task: DailyTask): Promise<PersistenceResult<Record<string, unknown>>> {
  const context = await getAuthPlaceholderContext();

  if (context.mode === 'mock' || !supabase) {
    return { ok: true, mode: 'mock', message: 'Daily task status saved to mock fallback.', data: task };
  }

  const { data, error } = await supabase
    .from('daily_tasks')
    .insert({
      user_id: context.userId,
      task_date: new Date().toISOString().slice(0, 10),
      category: mapTaskCategory(task.category),
      title: task.title,
      instruction: task.instruction,
      scheduled_time: toDatabaseTime(task.time),
      status: task.completed ? 'completed' : 'pending',
      completed_at: task.completed ? new Date().toISOString() : null
    })
    .select()
    .single();

  if (error) {
    return { ok: false, mode: 'supabase', message: 'Unable to save daily task status.', error: error.message };
  }

  return { ok: true, mode: 'supabase', message: 'Daily task status saved to Supabase.', data };
}

function mapTaskCategory(category: DailyTask['category']) {
  switch (category) {
    case 'supplement':
      return 'supplement';
    case 'nutrition':
      return 'nutrition';
    case 'bee_product':
      return 'bee_product';
    case 'sleep':
      return 'sleep';
    case 'movement':
    case 'training':
      return 'physical_activity';
    case 'water':
    case 'recovery':
      return 'lifestyle';
    default:
      return 'lifestyle';
  }
}

function toDatabaseTime(value?: string) {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) {
    return null;
  }

  return value;
}
