export const AuthUICode = `
"use client";
import { createClient } from '@supabase/supabase-js';

// Setup Supabase (Placeholder keys to prevent URL validation crashes)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co', 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'missing'
);

export function AuthUI() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };
  return (
    <button onClick={handleLogin} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-full transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]">
      Login / Sign Up
    </button>
  );
}
`.trim();
