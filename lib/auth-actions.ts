import { supabase } from './supabase';

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  if (error) console.error("Erro ao conectar com Google:", error.message);
  return { data, error };
}

export async function signUpEmail(email: string, pass: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
  });
  return { data, error };
}

export async function signInEmail(email: string, pass: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });
  return { data, error };
}