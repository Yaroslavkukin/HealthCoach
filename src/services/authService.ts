import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export type AuthMode = 'mock' | 'supabase';

export type AuthActionResult = {
  ok: boolean;
  mode: AuthMode;
  session: Session | null;
  user: User | null;
  error?: string;
};

export async function getCurrentAuthSession(): Promise<AuthActionResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: true, mode: 'mock', session: null, user: null };
  }

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return { ok: false, mode: 'supabase', session: null, user: null, error: error.message };
  }

  return {
    ok: true,
    mode: 'supabase',
    session: data.session,
    user: data.session?.user ?? null
  };
}

export async function signUpWithEmailPassword(email: string, password: string): Promise<AuthActionResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: true, mode: 'mock', session: null, user: null };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    return { ok: false, mode: 'supabase', session: null, user: null, error: error.message };
  }

  return {
    ok: true,
    mode: 'supabase',
    session: data.session,
    user: data.user
  };
}

export async function signInWithEmailPassword(email: string, password: string): Promise<AuthActionResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: true, mode: 'mock', session: null, user: null };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return { ok: false, mode: 'supabase', session: null, user: null, error: error.message };
  }

  return {
    ok: true,
    mode: 'supabase',
    session: data.session,
    user: data.user
  };
}

export async function signOutCurrentUser(): Promise<AuthActionResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: true, mode: 'mock', session: null, user: null };
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { ok: false, mode: 'supabase', session: null, user: null, error: error.message };
  }

  return { ok: true, mode: 'supabase', session: null, user: null };
}
